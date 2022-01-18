import { Component, OnInit } from '@angular/core';

/**
 * Composant de connexion utilisateur.
 *
 * Règles de gestion :
 * - Username obligatoire.
 * - Password obligatoire et min 6 caractères.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
