import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenStorageService } from 'src/app/services/auth/token-storage.service';

/**
 * Composant de connexion utilisateur.
 *
 * La page n'est accessible que si le token n'est pas présent, donc si l'utilisateur n'est pas connecté (géré par l'AuthGuard).
 *
 * Règles de gestion :
 * - Username obligatoire.
 * - Password obligatoire.
 */
//TODO register & update user
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Getter pour raccourcir la syntaxe
  get f() { return this.form.controls }

  /**
   * Appel en base pour voir si l'user existe pour ces données là.
   * Si oui, on met à jour le token avec la token renvoyé, et on redirige vers le path par défaut.
   */
  submitUser(): void {
    this.submitted = true;

    if(this.form.invalid) {
      return;
    }

    this.authService.login(this.form.value.username, this.form.value.password)
      .subscribe( (data: User) => {
        this.tokenStorageService.setToken(data.token);
        this.tokenStorageService.setUser(data);

        this.router.navigateByUrl('');
      });
  }
}
