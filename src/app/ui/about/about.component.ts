import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  loading = false;
  availableUpdate = false;

  // @ts-ignore
  build_at = `${window['build_at']}`;
  latest_build_at = '';

  back() {
    history.back();
  }

  async ngOnInit(): Promise<void> {
    try {
      const res = await fetch(`version.json?date=${new Date().getTime()}`);
      const json = await res.json();
      console.log(json);
      this.latest_build_at = json.build_at;

      this.availableUpdate = this.latest_build_at != this.build_at;
    } catch (error) {
      console.warn('fetch version.json failed.', error);
    }
  }

  async updateApps() {
    await updateApp();
  }
}

// PWA を強制更新する(Serviceworker のキャッシュを破棄してリロード)
// https://www.codit.work/codes/pwqxmywbampxtls2k6jc/
export async function updateApp() {
  try {
    const registrations =
      await window.navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) {
      registration.unregister();
    }
    window.location.reload();
  } catch (error) {
    console.log(`[pwa-util]update ~ error`, error);
  }
}
