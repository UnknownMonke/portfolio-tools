// Core.
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ErrorHandler, NgModule, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG.
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';


// Components.
import { AppRoutingModule } from './app-routing.module';



import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GlobalErrorHandler } from '../../services/error-handler.service';
import { HttpCustomInterceptor } from '../../services/http-custom-interceptor.service';
import { DisplayModule } from '../display/display.component';

//TODO install eslint, jest cypress, prettier, desinstall karma
/**
 * Root component for the Angular Application.
 *
 * ---
 *
 * Links to all other components via the navigation router,
 * exept the header and footer, which are directly injected.
 *
 * Also injects the toast for alert, info and error messages popups.
 *
 * Handles the page metadata (eg title) inside, as the navigation event is not always accessible from within the header component for some reason,
 * for instance after the login redirection.
 * The ng-content tag is used, which allows to insert parent logic in the child directly from the parent without the need for inputs/outputs.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  template: `
    <app-display></app-display>
  `
})
export class AppComponent implements OnInit {

  constructor(
    private primengConfig: PrimeNGConfig,
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
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    RippleModule,
    DisplayModule
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
