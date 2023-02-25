import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MainComponent } from './ui/main/main.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SettingsComponent } from './ui/settings/settings.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule} from '@angular/material/input';
import { MatCardModule} from '@angular/material/card';
import { ListComponent } from './ui/list/list.component';
import { MatMenuModule} from '@angular/material/menu';
import { NgxLoadingModule } from "ngx-loading";
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { AboutComponent } from './ui/about/about.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SettingsFrontMatterComponent } from './ui/settings-front-matter/settings-front-matter.component';
import { SettingsRepositoryComponent } from './ui/settings-repository/settings-repository.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SettingsComponent,
    ListComponent,
    SettingsFrontMatterComponent,
    SettingsRepositoryComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FormsModule, // make sure FormsModule is imported to make ngModel work
    LMarkdownEditorModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatButtonModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatMenuModule,
    NgxLoadingModule.forRoot({}),
    NgxScrollTopModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
