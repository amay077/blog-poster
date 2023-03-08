import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, from, map, take } from 'leseq';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { updateApp } from 'src/app/misc/app-updater';
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
  itemsMaster: PostMeta[] = [];
  items: PostMeta[] = [];
  error: string = '';
  readonly hasRepositorySettings: boolean;

  enableSearch = false;
  searchWord = '';
  private readonly searchWordS = new Subject<string>();

  private destroyed = false;
  private onDestroy$ = new Subject<void>();

  @ViewChild('inputSearch') inputSearch!: ElementRef<HTMLInputElement>;

  constructor(
    private github: GithubService,
    private cache: CacheService,
    private router: Router,
    private route: ActivatedRoute,
    settings: SettingsService,
    private zone: NgZone,
    private snackBar: MatSnackBar,
    private app: AppService
  ) {

    this.hasRepositorySettings = (settings?.repository?.github_access_token ?? '') != '';

    if (browserRefresh) {
      this.cache.clearPostMetas();
    }

    this.searchWord = route.snapshot.queryParamMap.get('q') ?? '';
    this.enableSearch = this.searchWord != '';

    this.itemsMaster = this.cache.loadPostMetas();
    console.log(`${this.constructor.name} ~ this.items:`, this.itemsMaster);
    if ((this.itemsMaster?.length ?? 0) <= 0) {
      (async () => {
        await this.reload();
      })().then(x => {});
    } else {
      this.filterPosts();
    }
  }

  ngOnInit(): void {

    const f = window.requestIdleCallback ?? setTimeout

    f(this.idlePostMetaReaderTask);
    f(this.idleUpdateCheckerTask);

    this.searchWordS
      .pipe(takeUntil(this.onDestroy$), distinctUntilChanged(), debounceTime(500))
      .subscribe(() => {
        console.log(`this.searchWordS raised`)
        this.filterPosts();
        this.updateUrl();
      });
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
      const f = window.requestIdleCallback ?? setTimeout;
      f(this.idlePostMetaReaderTask);
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
        const instance = this.snackBar.open(`Ver ${this.app.app_version}(${this.app.latest_build_at}) available`, `Update`, { duration: 10000 });
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
        this.itemsMaster = res.data;
        this.cache.saveGHContentMetas(this.itemsMaster);
        this.filterPosts();
      } else {
        this.error = res.error;
      }
    } finally {
      this.loading = false;
    }
  }

  private filterPosts() {
    this.items = this.itemsMaster.filter(x => JSON.stringify(x).indexOf(this.searchWord) >= 0);
  }

  async onClickItem(item: GHContentMeta) {
    await this.router.navigate(['edit', item.name]);
  }

  async onEnableSearch() {
    this.enableSearch = true;
    await new Promise(resolve => setTimeout(resolve, 1));
    this.inputSearch.nativeElement.focus();
  }

  onChangeSearchWord() {
    this.searchWordS.next(this.searchWord);
  }

  onClearSearch() {
    this.enableSearch = false;
    this.searchWord = '';
    this.filterPosts();
    this.updateUrl();
    window.scrollY = 0;
  }

  private updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.searchWord },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  onLogoClick() {
    const firstItem = document.querySelector('.scroll-target');
    firstItem?.scrollIntoView({ behavior: 'smooth' });
  }
}
