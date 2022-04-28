import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, NgModule, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

/**
 * User login form presentational component.
 *
 * ---
 *
 * The form is decoupled from the login logic to keep it simple.
 *
 * Contains :
 * - A form, with username and password, and validation according to requirements.
 *
 * Requirements :
 * - Mandatory username.
 * - Mandatory password.
 *
 * On submit, the form validation is checked and if valid, the value is sent to the parent component for login.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  submitted: boolean = false;
  // Using Angular reactive forms.
  form: FormGroup = new FormGroup({});

  @Output()
  formSubmit = new EventEmitter<LoginForm>();

  constructor(
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Creates the form.
    this.form = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Getter to shorten the syntax.
  get f() { return this.form.controls }

  /**
   * On submit :
   * - Checks form validation.
   * - If valid :
   *    - Emits the form through the emitter.
   *
   * No built in Observable can be used like valueChanges.
   */
  onSubmit(): void {
    this.submitted = true;

    if(this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}

/**
 * Simple form DTO for easy type check.
 */
export interface LoginForm {
  username: string,
  password: string
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule
  ]
})
export class LoginFormModule {}
