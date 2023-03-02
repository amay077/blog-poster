import { Component, OnInit } from '@angular/core';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/service/settings.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  status: 'signin' | 'done' | 'failed' = 'signin';
  err = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {

      const url = window as any;// new URL(window.location.href);
      console.log("auth-callback.html", url, window.location.href);
      const code = url?.searchParams?.get('code') ?? '';
      const state = url?.searchParams?.get('state') ?? '';

      this.err = '';
      const accessTokenUrl = `${environment.github_access_token_api_endpoint}?code=${code}`
      const res = await fetch(accessTokenUrl);

      if (!res.ok) {
        this.status = 'failed';
        this.err = `statusCode = ${res.status}, error = ${res.body}`;
        this.settings.repository = {
          ...this.settings.repository,
          github_access_token: ''
        };
        return;
      }

      const json = await res.json();
      const github_access_token = json.access_token;
      this.settings.repository = {
        ...this.settings.repository,
        github_access_token
      };
      await this.router.navigate(['settings/repo']);
      this.status = 'done';
    } catch (error) {
      this.status = 'failed';
      this.err = error as string;
      this.settings.repository = {
        ...this.settings.repository,
        github_access_token: ''
      };
    }
  }
}
