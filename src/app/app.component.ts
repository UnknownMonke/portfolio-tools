import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TokenStorageService } from './services/auth/token-storage.service';

/** Composant racine de l'application. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Récupération de l'info utilisateur connecté pour ne pas afficher le header dans la page de login.
  isLoggedIn: boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }
}
