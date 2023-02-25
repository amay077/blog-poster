import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SettingsService } from 'src/app/service/settings.service';
import { RepositorySettings } from 'src/app/types/app-settings';

@Component({
  templateUrl: './settings-repository.component.html',
  styleUrls: ['./settings-repository.component.scss']
})
export class SettingsRepositoryComponent implements OnDestroy {
  private readonly onDestroy$ = new Subject();

  public readonly settingForm: FormGroup;

  constructor(private settings: SettingsService) {
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
}
