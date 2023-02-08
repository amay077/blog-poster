import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { FrontMatterSettings, RepositorySettings, Settings } from '../types/app-settings';
import { Result } from '../types/misc';

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

  export(): string {

    const repository = { ...this.repository };

    // @ts-ignore
    delete repository.github_access_token;

    // @ts-ignore
    const app_version = `${window['app_version']}`;


    const obj: Settings = {
      posteiro_settings: {
        file_version: '1.0',
        app_version,
        export_at: dayjs().toISOString(),
      },
      repository,
      front_matter: { ...this.frontMatter },
    }
    return JSON.stringify(obj, null, '  ');
  }

  async import(file: File): Promise<Result<void>> {
    const fileToJson = (file: File): Promise<Settings> => {
      return new Promise<Settings>((resolve, reject) => {
        const reader = new FileReader();
        console.log('readAsDataURL start', new Date().getTime());
        reader.readAsText(file);
        reader.onload = (r) => {
          console.log('readAsDataURL end', new Date().getTime());
          const replaced = (r.target?.result as string);
          const settings: Settings = JSON.parse(replaced);
          resolve(settings);
        };
        reader.onerror = (e) => reject(e);
      });
    };

    const settings = await fileToJson(file);
    if (settings?.posteiro_settings?.file_version != '1.0') {
      return { success: false, error: `Invalid JSON format - ${settings?.posteiro_settings}` };
    }

    const github_access_token = this.repository.github_access_token;

    this.repository = {
      ...settings.repository,
      github_access_token
    };

    this.frontMatter = settings.front_matter;

    return { success: true, result: undefined };
  }
}
