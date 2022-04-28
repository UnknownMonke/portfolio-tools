// Core.
import {Component, ErrorHandler, OnInit, NgModule, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { NavigationService } from '../core/services/navigation.service';

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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title$: Observable<string> = of(''); // Page title with default value.
  private _isDead$: Subject<boolean> = new Subject(); // Used for unsubscribing to services.

  constructor(
    private primengConfig: PrimeNGConfig,
    private _navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    // Required to activate the ripple effect on buttons.
    this.primengConfig.ripple = true;

    this.title$ = this._navigationService.observeNavigation().pipe(takeUntil(this._isDead$));

    /*this._router.events
      .pipe(
        filter( (event: any) => event instanceof NavigationEnd),
        tap( event => console.log(event))
      ).subscribe();*/
  }

  ngOnDestroy(): void {
    this._isDead$.next(false);
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
