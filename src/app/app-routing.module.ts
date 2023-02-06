import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { UiSettingsFrontMatterComponent } from './ui-settings-front-matter/ui-settings-front-matter.component';
import { UiSettingsRepositoryComponent } from './ui-settings-repository/ui-settings-repository.component';
import { AboutComponent } from './ui/about/about.component';
import { ListComponent } from './ui/list/list.component';
import { MainComponent } from './ui/main/main.component';
import { SettingsComponent } from './ui/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' } as Route,
  { path: 'main', component: MainComponent },
  { path: 'edit/:name', component: MainComponent },
  { path: 'list', component: ListComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/repo', component: UiSettingsRepositoryComponent },
  { path: 'settings/matter', component: UiSettingsFrontMatterComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
