import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/core/components/root/app.component';
import { environment } from './environments/environment';

if(environment.production) {
  enableProdMode();
}

/**
 * The Application is bootstrapped here, through the main module.
 */
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
