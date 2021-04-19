import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { initializeKeycloak } from '@core/auth/init';
import { csrfProviderFactory } from './core/provider/csrf/csrf.factory';
import { CsrfProvider } from './core/provider/csrf/csrf.provider';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: csrfProviderFactory,
      multi: true,
      deps: [CsrfProvider]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
