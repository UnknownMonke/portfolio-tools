import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfos } from 'src/app/auth/model/user';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { LoadingService } from 'src/app/handling/services/loading/loading.service';
import { ThemeService } from 'src/app/handling/services/theme/theme.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

/**
 * User login component (not register).
 *
 * ---
 *
 * The view is only accessed if no user is logged in, meaning the JWT is not present or not valid (see AuthGuard).
 *
 * Contains :
 * - A form, with username and password, and validation according to requirements.
 *
 * Requirements :
 * - Mandatory username.
 * - Mandatory password.
 *
 * Users, login and registration are handled or referenced in :
 * - /auth component folder.
 * - /auth service folder.
 * - appRoutingModule for user rights.
 * - Header component (does not display if the user is not logged in).
 * - Theme service, to persist user chosen theme.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Using Angular reactive forms.
  form: FormGroup = new FormGroup({});

  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService,
    private themeService: ThemeService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // Creates the form.
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Subscribes to the loggedIn event so that we redirect to the home page as soon as the log-in process has been achieved successfully.
    this.sessionService.loggedIn$
      .subscribe( (value: boolean) => {
        if(value) this.router.navigateByUrl('');
      });
  }

  // Getter to shorten the syntax.
  get f() { return this.form.controls }

  /**
   * On submit :
   * - Checks form validation.
   * - If valid :
   *    - Calls service to check if user exists with those credentials.
   *    - If yes:
   *        - Updates the application current theme according to user preference (default: user-agent preference).
   *        - Updates the token and user details in session which will trigger redirection to the home page (using the empty default path, to let the router handle this part).
   *    - If no, throws error that displays an error message with details (handled by the Interceptor).
   *
   * Login is achieved by storing the newly created token and user details in the session (using sessionStorage), which emits the login event.
   */
  submitUser(): void {
    this.submitted = true;

    if(this.form.invalid) {
      return;
    }

    this.authService.login(this.form.value.username, this.form.value.password)
      .subscribe( (data: UserInfos) => { // In case of a response error (status code != 200), no data will be sent.

        // IMPORTANT : Inserting undefined or null will convert it to a string ("undefined", "null"), so we must do a value check beforehand.
        if(!data.token) {
          throw new Error('Invalid token');

        } else if(!data.user) {
          throw new Error('Invalid user infos');

        } else {
          // Retreives the user preferred theme and applies it.
          this.themeService.setTheme(data.user.settings.theme);

          // Updates token and user details in session, logs in.
          this.sessionService.signIn(data);
          }
      });
  }
}

@NgModule({
  declarations: [LoginComponent],
  exports: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    CardModule,
    AvatarModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ], // CommonModule is mandatory, ReactiveFormsModules contains the FormBuilder
})
export class LoginModule {}
