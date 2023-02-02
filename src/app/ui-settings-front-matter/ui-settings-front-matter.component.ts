import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SettingsService } from 'src/app/service/settings.service';
import { FrontMatterSettings, RepositorySettings } from 'src/app/types/app-settings';

@Component({
  selector: 'app-ui-settings-front-matter',
  templateUrl: './ui-settings-front-matter.component.html',
  styleUrls: ['./ui-settings-front-matter.component.scss']
})
export class UiSettingsFrontMatterComponent implements OnDestroy {

  private readonly onDestroy$ = new Subject();

  public readonly settingForm: FormGroup;

  constructor(private settings: SettingsService) {
    const model = settings.frontMatter ?? {} as FrontMatterSettings;
    const controls: any = {};
    for (const prop of Object.keys(model)) {
      controls[prop] = [(model as any)[prop]];
    }

    const builder = new FormBuilder();
    this.settingForm = builder.group(controls);

    this.settingForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.onDestroy$))
      .subscribe(form => {
      this.settings.frontMatter  = form;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
  }
}
