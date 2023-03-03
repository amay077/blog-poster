import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SettingsService } from 'src/app/service/settings.service';
import { RepositorySettings } from 'src/app/types/app-settings';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './settings-repository.component.html',
  styleUrls: ['./settings-repository.component.scss']
})
export class SettingsRepositoryComponent implements OnDestroy {
  private readonly onDestroy$ = new Subject();

  public readonly settingForm: FormGroup;

  get signedIn(): boolean {
    return (this.settings.repository.github_access_token ?? '') != '';
  }

  constructor(
    route: ActivatedRoute,
    private settings: SettingsService) {

    const code = route.snapshot.queryParamMap.get('code') ?? '';

    const model = settings.repository ?? {} as RepositorySettings;
    const controls: any = {};
    for (const prop of Object.keys(model)) {
      controls[prop] = [(model as any)[prop]];
    }

    const builder = new FormBuilder();
    this.settingForm = builder.group(controls);

    this.settingForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.onDestroy$))
      .subscribe(form => {
      this.settings.repository  = form;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
  }

  onSigninWithGitHub() {
    const clientId = environment.github_oauth_client_id;
    const state = Math.random().toString(32).substring(2);
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&allow_signup=false&state=${state}`;

    window.location.href  = url;
  }

  onSignoutWithGitHub() {
    this.settings.repository = {
      ...this.settings.repository,
      github_access_token: '',
    }
  }
}
