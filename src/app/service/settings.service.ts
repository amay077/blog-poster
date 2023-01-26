import { Injectable } from '@angular/core';
import { AppSettings } from '../types/app-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() {
    if (this.current == null) {
      const model: AppSettings = {
        repository_name: '',
        repository_owner: '',
        github_access_token: '',
        branch_name: 'main',
        path_to_posts: '',
        path_to_images: '',
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
