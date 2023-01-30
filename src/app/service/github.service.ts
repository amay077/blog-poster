import { Injectable } from '@angular/core';
import { filter, from, orderBy } from 'leseq';
import { ulid } from 'ulid';
import { SettingsService } from './settings.service';
import { Buffer } from 'buffer';
import * as dayjs from 'dayjs';

export type PostMeta = {
  name: string,
  download_url: string,
  sha?: string,
 };

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private settings: SettingsService) { }

  async listPosts(): Promise<readonly PostMeta[]> {
    const settings = this.settings.current;
    if (settings == null) {
      return [];
    }

    const token = settings.github_access_token;
    const owner = settings.repository_owner;
    const repo = settings.repository_name;
    const branch = settings.branch_name;
    const path_to_posts = settings.path_to_posts;

    const params = { ref : branch };
    const query = new URLSearchParams(params);

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path_to_posts}?${query}`;

    const p: RequestInit = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    const res = await fetch(url, p);
    if (res.ok) {
      const resJson = await res.json() as PostMeta[];
      return from(resJson).pipe(
        orderBy(x => x.name, 'desc'),
        filter(x => x.name.toLowerCase().endsWith('md') || x.name.toLowerCase().endsWith('markdown'))
      ).toArray();
      console.log(`${this.constructor.name} ~ ngOnInit ~ resJson`, resJson);
    } else {
      console.log(`${this.constructor.name} ~ ngOnInit ~ res.status`, res.status);
      return [];
    }
  }

  async getPostMeta(name: string): Promise<{ meta: PostMeta, markdown: string} | undefined> {
    const settings = this.settings.current;
    if (settings == null) {
      return undefined;
    }

    const token = settings.github_access_token;
    const owner = settings.repository_owner;
    const repo = settings.repository_name;
    const branch = settings.branch_name;
    const path_to_posts = settings.path_to_posts;

    const params = { ref : branch };
    const query = new URLSearchParams(params);

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path_to_posts}/${name}?${query}`;

    const p: RequestInit = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const res = await fetch(url, p);
    if (res.ok) {
      const meta = await res.json() as PostMeta;
      const markdown = Buffer.from((meta as any)['content'], 'base64').toString();
      return { meta, markdown };
      console.log(`${this.constructor.name} ~ ngOnInit ~ resJson`, meta);
    } else {
      console.log(`${this.constructor.name} ~ ngOnInit ~ res.status`, res.status);
      return undefined;
    }
  }

  async uploadImage(file: File): Promise<string | undefined> {
    const settings = this.settings.current;
    if (settings == null) {
      return undefined;
    }

    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (r) => {
          const base64str = (r.target?.result as string).replace(/data:.*\/.*;base64,/, '');
          resolve(base64str);
        };
        reader.onerror = (e) => reject(e);
      });
    };

    const content = await fileToBase64(file);

    const data = JSON.stringify({
      'branch': settings.branch_name,
      'message': 'upload image via POSTEIRO',
      'content': `${content}`
    });

    const token = settings.github_access_token;
    const owner = settings.repository_owner;
    const repo = settings.repository_name;

    const date = dayjs().format('YYYY-MM-DD');
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${settings.path_to_images}/$${date}-{ulid()}.png`;

    const p = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type
      },
      body: data
    };

    const res = await fetch(url, p);
    if (res.ok) {
      const resJson = await res.json();
      console.log(`${this.constructor.name} ~ doUpload ~ resJson`, resJson, resJson.content.download_url);

      return resJson.content.download_url;
    } else {
      return undefined;
    }
  }

  async uploadPost(markdown: string, name: string, sha?: string): Promise<string | undefined> {
    const settings = this.settings.current;
    if (settings == null) {
      return undefined;
    }

    const content = Buffer.from(markdown).toString('base64');

    const data = JSON.stringify({
      sha,
      'branch': settings.branch_name,
      'message': 'upload post via POSTEIRO',
      'content': content
    });

    const token = settings.github_access_token;
    const owner = settings.repository_owner;
    const repo = settings.repository_name;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${settings.path_to_posts}/${name}`;

    const p = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: data
    };

    const res = await fetch(url, p);
    if (res.ok) {
      const resJson = await res.json();
      console.log(`${this.constructor.name} ~ doUpload ~ resJson`, resJson, resJson.content.download_url);

      return resJson.content.download_url;
    } else {
      return undefined;
    }
  }

  async deletePost(name: string, sha: string): Promise<void | undefined> {
    const settings = this.settings.current;
    if (settings == null) {
      return undefined;
    }

    const data = JSON.stringify({
      sha,
      'branch': settings.branch_name,
      'message': 'delete post via POSTEIRO',
    });

    const token = settings.github_access_token;
    const owner = settings.repository_owner;
    const repo = settings.repository_name;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${settings.path_to_posts}/${name}`;

    const p = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: data
    };

    const res = await fetch(url, p);
    if (res.ok) {
      return;
    } else {
      return undefined;
    }
  }
}
