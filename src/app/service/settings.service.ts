import { Injectable } from '@angular/core';
import { AppSettings } from '../types/app-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() {
    if (this.current == null) {
      const model: AppSettings = {
        repository_name: 'postaro',
        repository_owner: 'amay077',
        github_access_token: 'fsdafdarefvzkllkrtewjjsd',
        branch_name: 'main',
        path_to_posts: 'src/posts',
        path_to_images: 'src/images',
      };
      this.save(model);
    }
  }

  get current(): AppSettings | undefined {
    const str = localStorage.getItem('settings');
    if (str == null) {
      return undefined;
    }

    return JSON.parse(str);
  }

  save(value: AppSettings) {
    localStorage.setItem('settings', JSON.stringify(value));
  }
}
