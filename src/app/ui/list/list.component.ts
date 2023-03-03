import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, from, map, take } from 'leseq';
import { parse } from 'src/app/misc/front-matter-parser';
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
  items: readonly PostMeta[] = [];
  error: string = '';
  readonly hasRepositorySettings: boolean;

  private idleTaskHandle?: number;
  private destroyed = false;

  constructor(
    private github: GithubService,
    private cache: CacheService,
    private router: Router,
    settings: SettingsService,
  ) {

    this.hasRepositorySettings = settings?.repository?.github_access_token != null;

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
    window?.requestIdleCallback(this.idleTask);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  private readonly idleTask = async () => {
    console.log('It is idle.');

    await new Promise(resolve => setTimeout(resolve, 3000)) // 3秒待つ

    const uncachedNames = from(this.cache.loadPostMetas())
      .pipe(
        filter(x => x.title == undefined),
        map(x => x.name),
        take(5)
      );

    for (const nm of uncachedNames) {
      await this.github.getPost(nm);
    }

    if (!this.destroyed) {
      this.idleTaskHandle = window.requestIdleCallback(this.idleTask);
    }

    return Date.now();
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
