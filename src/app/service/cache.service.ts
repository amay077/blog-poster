import { Injectable } from '@angular/core';
import { PostMeta } from './github.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  constructor() { }

  loadPosts(): PostMeta[] {
    const itemsStr = localStorage.getItem('posteiro-items');
    return itemsStr != null ? JSON.parse(itemsStr) : [];
  }

  savePosts(items: readonly PostMeta[]) {
    localStorage.setItem('posteiro-items', JSON.stringify(items));
  }

  clearPosts() {
    localStorage.removeItem('posteiro-items');
  }
}
