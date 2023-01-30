import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { ListComponent } from './ui/list/list.component';
import { MainComponent } from './ui/main/main.component';
import { SettingsComponent } from './ui/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' } as Route,
  { path: 'main', component: MainComponent },
  { path: 'edit/:name', component: MainComponent },
  { path: 'list', component: ListComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
