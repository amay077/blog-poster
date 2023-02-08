import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { saveAs } from 'file-saver';
import { SettingsService } from 'src/app/service/settings.service';

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

  constructor(private settings: SettingsService) {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
  }

  async onImport(event: any) {
    const file: File = event?.target?.files[0];
    if (!file) return;

    const res = await this.settings.import(file);
    alert(res.success ? 'Imported!' : `Import failed - ${res.error}`);
  }

  onInputFileReset(event: any) {
    event.target.value = '';
  }

  onExport() {
    const json = this.settings.export();
    var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "posteiro_settings.json");
    alert('Exported!');
  }
}
