import { Injectable } from '@angular/core';
import { PostMeta } from './github.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  constructor() { }

  loadPosts(): PostMeta[] {
    const itemsStr = localStorage.getItem('posteiro-items');
    const list: PostMeta[] = itemsStr != null ? JSON.parse(itemsStr) : [];
    const metaCache = this.metaCache;
    return list.map(x => {
      const cachedMeta = metaCache.find(y => y.download_url == x.download_url);
      if (cachedMeta != null) {
        x.title = cachedMeta.title;
        x.posted_at = cachedMeta.posted_at;
      }
      return x;
    });
  }

  savePosts(items: readonly PostMeta[]) {
    localStorage.setItem('posteiro-items', JSON.stringify(items));
  }

  get metaCache(): PostMeta[] {
    const itemsStr = localStorage.getItem('posteiro-item-metas');
    return itemsStr != null ? JSON.parse(itemsStr) : [];
  }
  set metaCache(items: readonly PostMeta[]) {
    localStorage.setItem('posteiro-item-metas', JSON.stringify(items));
  }


  clearPosts() {
    localStorage.removeItem('posteiro-items');
  }

  putMeta(meta: PostMeta) {
    const metas = this.metaCache;
    const hitIndex = metas.findIndex(x => x.download_url == meta.download_url);
    if (hitIndex >= 0) {
      metas[hitIndex] = meta;
    } else {
      metas.push(meta);
    }
    this.metaCache = metas;
  }
}
