import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { UserInfos } from '../../model/user';
import { map, Subject, takeUntil } from 'rxjs';
import { LoginForm, LoginFormModule } from './login-form/login-form.component';
import { AvatarModule } from 'src/app/common/components/avatar/avatar.component';
import { ButtonModule } from 'primeng/button';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ThemeService } from 'src/app/core/services/theme.service';

/**
 * User login container component (not register).
 *
 * ---
 *
 * Handles the login logic with the user login form sent by the child component (loginFormComponent).
 *
 * The view is only accessed if no user is logged in, meaning the JWT is not present or not valid (see AuthGuard).
 *
 * Users, login and registration are handled or referenced in :
 * - /auth component folder.
 * - /auth service folder.
 * - appRoutingModule for user rights.
 * - Header component (does not display if the user is not logged in).
 * - Theme service, to persist user chosen theme.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private _isDead$: Subject<boolean> = new Subject(); // Used for unsubscribing to services.

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _sessionService: SessionService,
    private _themeService: ThemeService,
    public loadingFacade: LoadingService
  ) {}

  ngOnInit(): void {

    // Listens to login event so that we redirect to the home page as soon as the log-in process has been achieved successfully.
    this._sessionService.loggedIn$
      .pipe(
        takeUntil(this._isDead$),
        map( (value: boolean) => {
          if(value) this._router.navigateByUrl(''); // navigateByUrl changes the entire url suffix, while navigate patches the url and preserves params.
        })
      ).subscribe(); // Analog to jQuery ".on('change')", listens to the event emitted by an Observable, and lauches the request.
  }

  /**
   * User login logic, called when the child component successfully emits the user login form.

   * - Calls service to check if user exists with given credentials.
   * - If yes:
   *    - Updates the application current theme according to user preference (default: user-agent preference).
   *    - Updates the token and user details in session which will trigger redirection to the home page (using the empty default path, to let the router handle this part).
   * - If no, throws error that displays an error message with details (handled by the Interceptor).
   *
   * Login is achieved by storing the newly created token and user details in the session (using sessionStorage), which emits the login event.
   *
   * @param {LoginForm} form the submitted user login form, contains username and password.
   */
  submitUser(form: LoginForm): void {

    this._authService.login(form.username, form.password)
      .pipe(
        takeUntil(this._isDead$),
        map( (data: UserInfos) => { // In case of a response error (status code != 200), no data will be sent.

          // IMPORTANT : Inserting undefined or null will convert it to a string ("undefined", "null"), so we must do a value check beforehand.
          if(!data.token) {
            throw new Error('Invalid token');

          } else if(!data.user) {
            throw new Error('Invalid user infos');

          } else {
            // Retreives the user preferred theme and applies it.
            this._themeService.setTheme(data.user.settings.theme);

            // Updates token and user details in session, logs in.
            this._sessionService.signIn(data);
            }
        }) // Handles logic in map instead of subscribe, to allow for possible async pipe use and better control the request flow.
      ).subscribe();
  }

  ngOnDestroy(): void {
    this._isDead$.next(false);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [LoginComponent],
  exports: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    LoginFormModule
  ]
})
export class LoginModule {}
