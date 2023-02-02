import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SettingsService } from 'src/app/service/settings.service';
import { RepositorySettings } from 'src/app/types/app-settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  private readonly onDestroy$ = new Subject();

  readonly menus = [
    { title: 'Repository', link: '/settings/repo' },
    { title: 'Front Matter', link: '/settings/matter' },
  ];

  constructor() {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
  }
}
