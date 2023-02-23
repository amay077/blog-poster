import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  readonly hasRepositorySettings: boolean;

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
  }

  ngOnDestroy(): void {
  }

  async reload() {
    try {
      this.loading = true;
      this.items = [];
      this.items = await this.github.listPostMetas();
      this.cache.saveGHContentMetas(this.items);
    } finally {
      this.loading = false;
    }
  }

  async onClickItem(item: GHContentMeta) {
    await this.router.navigate(['edit', item.name]);
  }
}
