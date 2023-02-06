import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  loading = false;

  // @ts-ignore
  app_version = `${window['app_version']}`;

  back() {
    history.back();
  }

}
