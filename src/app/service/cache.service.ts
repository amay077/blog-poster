import { Injectable } from '@angular/core';
import { GHContentMeta, PostMatter, PostMeta } from './github.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  constructor() { }

  loadPostMetas(): PostMeta[] {
    const itemsStr = localStorage.getItem('posteiro-items');
    const list: PostMeta[] = itemsStr != null ? JSON.parse(itemsStr) : [];
    const metaCache = this.postMatterCache;
    return list.map(x => {
      const cachedMeta = metaCache.get(x.download_url);
      if (cachedMeta != null) {
        x.title = cachedMeta.title;
        x.posted_at = cachedMeta.posted_at;
      }
      return x;
    });
  }

  clearPostMetas() {
    localStorage.removeItem('posteiro-items');
  }

  saveGHContentMetas(items: readonly GHContentMeta[]) {
    localStorage.setItem('posteiro-items', JSON.stringify(items));
  }

  get postMatterCache(): Map<string, PostMatter> {
    const itemsStr = localStorage.getItem('posteiro-post-matters');
    const list: PostMatter[] = itemsStr != null ? JSON.parse(itemsStr) : [];
    return list.reduce((pre, cur) => {
      pre.set(cur.download_url, cur);
      return pre;
    }, new Map<string, PostMatter>())
  }
  set postMatterCache(items: Map<string, PostMatter>) {
    localStorage.setItem('posteiro-post-matters', JSON.stringify(Array.from(items.values())));
  }

  putPostMatter(meta: PostMatter) {
    const metas = this.postMatterCache;
    const hit = metas.get(meta.download_url);
    if (hit != null) {
      metas.set(hit.download_url, meta);
    } else {
      metas.set(meta.download_url, meta);
    }
    this.postMatterCache = metas;
  }
}
