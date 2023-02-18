import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  loading = false;

  // @ts-ignore
  app_version = `${window['app_version']}`;
  latest_app_version = '';

  back() {
    history.back();
  }

  async ngOnInit(): Promise<void> {
    try {
      const res = await fetch(`version.json?date=${new Date().getTime()}`);
      const json = await res.json();
      console.log(json);
      this.latest_app_version = json.app_version;
    } catch (error) {
      console.warn('fetch version.json failed.', error);
    }
  }
}
