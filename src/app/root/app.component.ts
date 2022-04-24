// Core.
import {Component, ErrorHandler, OnInit, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// PrimeNG.
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

// Components.
import { AppRoutingModule } from '../app-routing.module';

import { HeaderModule } from '../core/components/header/header.component';
import { FooterModule } from '../core/components/footer/footer.component';



import { GlobalErrorHandler } from '../handling/services/error/error-handler.service';
import { HttpCustomInterceptor } from '../handling/services/interceptor/http-custom-interceptor.service';

/**
 * Root component for the Angular Application.
 *
 * ---
 *
 * Links to all other components via the navigation router,
 * exept the header and footer, which are directly injected.
 *
 * Also injects the toast for alert, info and error messages popups.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    // Required to activate the ripple effect on buttons.
    this.primengConfig.ripple = true;
  }
}

/**
 * Root module of the Angular Application.
 *
 * ---
 *
 * Constructs everything from here.
 *
 * '@NgModule' takes a metadata object that describes how to compile a component template and how to create an injector at runtime.
 * It identifies the module own components, directives, and pipes, making some of them public, through the exports property, so that external components can use them.
 *
 * '@NgModule' can also add service providers to the application dependency injectors.
 */
 @NgModule({
  // Declares application components (only components, directives and pipes).
  declarations: [AppComponent],
  // Imports external components (Angular/ PrimeNG).
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RippleModule,
    ToastModule,
    HeaderModule,
    FooterModule
  ],
  // Imports services.
  providers: [
    ConfirmationService,
    MessageService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpCustomInterceptor, multi: true }
  ],
  // Defines components that are directly bootstrapped into the main HTML file (usually contains only the root component).
  bootstrap: [AppComponent]
})
export class AppModule {}

/**
 * The HttpClientInMemoryWebApiModule module intercepts HTTP requests and returns simulated server responses.
 * Remove it when a real server is ready to receive requests.
 */
// HttpClientInMemoryWebApiModule.forRoot(
//   InMemoryDataService, { dataEncapsulation: false }
// )
