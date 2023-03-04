import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter, from, map, take } from 'leseq';
import { Subject, takeUntil } from 'rxjs';
import { checkUpdate, updateApp } from 'src/app/misc/app-updater';
import { parse } from 'src/app/misc/front-matter-parser';
import { AppService } from 'src/app/service/app.service';
import { CacheService } from 'src/app/service/cache.service';
import { GithubService, GHContentMeta, PostMeta } from 'src/app/service/github.service';
import { SettingsService } from 'src/app/service/settings.service';

import { browserRefresh } from '../../app.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  loading = false;
  items: PostMeta[] = [];
  error: string = '';
  readonly hasRepositorySettings: boolean;

  private destroyed = false;
  private onDestroy$ = new Subject<void>();

  constructor(
    private github: GithubService,
    private cache: CacheService,
    private router: Router,
    settings: SettingsService,
    private zone: NgZone,
    private snackBar: MatSnackBar,
    private app: AppService
  ) {

    this.hasRepositorySettings = (settings?.repository?.github_access_token ?? '') != '';

    if (browserRefresh) {
      this.cache.clearPostMetas();
    }

    this.items = this.cache.loadPostMetas();
    if ((this.items?.length ?? 0) <= 0) {
      (async () => {
        await this.reload();
      })().then(x => {});
    }
  }

  ngOnInit(): void {
    window?.requestIdleCallback(this.idlePostMetaReaderTask);
    window?.requestIdleCallback(this.idleUpdateCheckerTask);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.onDestroy$.next();
  }

  private readonly idlePostMetaReaderTask = async () => {
    console.log('Start backgroud post meta reader.', Date.now());

    await new Promise(resolve => setTimeout(resolve, 3000)) // 3秒待つ

    const uncachedNames = from(this.cache.loadPostMetas())
      .pipe(
        filter(x => x.title == undefined),
        map(x => x.name),
        take(5)
      );

    let hasUpdate = false;
    for (const nm of uncachedNames) {
      const res = await this.github.getPost(nm);
      const meta = res?.meta;
      if (meta != null) {
        const hit = this.items.find(x => x.download_url == meta.download_url);
        if (hit != null) {
          console.log(`${this.constructor.name} ~ readonlyidleTask= ~ meta:`, meta);
          hit.title = meta.title;
          hit.tags = meta.tags;
          hit.posted_at = meta.posted_at;
          hasUpdate = true;
        }
      }
    }

    if (hasUpdate) {
      // Zone.run を呼ぶことで画面の更新を起こさせる
      this.zone.run(() => { });
    }


    if (!this.destroyed) {
      window.requestIdleCallback(this.idlePostMetaReaderTask);
    }

    console.log('Finished backgroud post meta reader.', Date.now());
    return Date.now();
  }

  private readonly idleUpdateCheckerTask = async () => {
    console.log('Start idleUpdateCheckerTask.', Date.now());
    await new Promise(resolve => setTimeout(resolve, 5000));

    const hasUpdate = await this.app.checkUpdate()
    if (hasUpdate) {
      this.zone.run(() => {
        const instance = this.snackBar.open(`App(${this.app.latest_build_at}) available`, `Update`, { duration: 10000 });
        instance.onAction().pipe(takeUntil(this.onDestroy$)).subscribe(async () => {
          await updateApp();
        });
      });
    }
    console.log('Finished idleUpdateCheckerTask.', Date.now());
  }

  async reload() {
    try {
      this.loading = true;
      this.items = [];
      const res = await this.github.listPostMetas();
      if (res.ok) {
        this.error = '';
        this.items = res.data;
        this.cache.saveGHContentMetas(this.items);
      } else {
        this.error = res.error;
      }
    } finally {
      this.loading = false;
    }
  }

  async onClickItem(item: GHContentMeta) {
    await this.router.navigate(['edit', item.name]);
  }
}
