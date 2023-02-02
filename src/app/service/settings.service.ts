import { Injectable } from '@angular/core';
import { FrontMatterSettings, RepositorySettings } from '../types/app-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() {
  }

  get repository(): RepositorySettings {

    // Migration
    const old = localStorage.getItem('posteiro-settings');
    if (old != null) {
      localStorage.setItem('posteiro-settings-repository', old);
      localStorage.removeItem('posteiro-settings');
    }

    const str = localStorage.getItem('posteiro-settings-repository');
    if (str == null) {
      return {
        repository_name: '',
        repository_owner: '',
        github_access_token: '',
        branch_name: 'main',
        path_to_posts: '',
        path_to_images: '',
      };
    }

    return JSON.parse(str);
  }
  set repository(value: RepositorySettings) {
    localStorage.setItem('posteiro-settings-repository', JSON.stringify(value));
  }


  get frontMatter(): FrontMatterSettings {
    const str = localStorage.getItem('posteiro-settings-matters');
    if (str == null) {
      return {
        body: `templateKey: blog-post
title: {{title}}
date: {{date}}
tags:
`,
      };
    }

    return JSON.parse(str);
  }
  set frontMatter(value: FrontMatterSettings) {
    localStorage.setItem('posteiro-settings-matters', JSON.stringify(value));
  }
}
