import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { checkUpdate, updateApp } from 'src/app/misc/app-updater';
import { AppService } from 'src/app/service/app.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  loading = false;
  availableUpdate = false;
  readonly app_version = this.app.app_version;
  readonly build_at = this.app.build_at;
  latest_build_at = '';
  latest_app_version = '';


  constructor(private router: Router, private app: AppService) {
    //
  }

  back() {
    history.back();
  }

  async ngOnInit(): Promise<void> {
    this.availableUpdate = await this.app.checkUpdate();
    this.latest_build_at = this.app.latest_build_at;
    this.latest_app_version = this.app.latest_app_version;
  }

  async updateApps() {
    await updateApp();
  }
}

