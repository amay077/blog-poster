import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { MainComponent } from './ui/main/main.component';
import { SettingsComponent } from './ui/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' } as Route,
  { path: 'main', component: MainComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
