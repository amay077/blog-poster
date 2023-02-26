import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { SettingsFrontMatterComponent } from './ui/settings-front-matter/settings-front-matter.component';
import { SettingsRepositoryComponent } from './ui/settings-repository/settings-repository.component';
import { AboutComponent } from './ui/about/about.component';
import { ListComponent } from './ui/list/list.component';
import { MainComponent } from './ui/main/main.component';
import { SettingsComponent } from './ui/settings/settings.component';
import { AuthComponent } from './ui/auth/auth.component';
import { AuthCallbackComponent } from './ui/auth-callback/auth-callback.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' } as Route,
  { path: 'main', component: MainComponent },
  { path: 'edit/:name', component: MainComponent },
  { path: 'list', component: ListComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/repo', component: SettingsRepositoryComponent },
  { path: 'settings/matter', component: SettingsFrontMatterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'auth-callback/:code', component: AuthCallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
