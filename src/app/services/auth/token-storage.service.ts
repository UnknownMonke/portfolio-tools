import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = "auth-user";

/**
 * Gère le token JWT et les infos utilisateurs (username, email) depuis le sessionStorage du navigateur.
 *
 * Le token est créé côté serveur lors de la connection.
 *
 * Un observable est créé pour notifier certaines parties de l'application à la volée lors de la connexion.
 *
 * La déconnexion est effectuée en vidant la session.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  loggedIn$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  signOut(): void {
    sessionStorage.clear();

    this.loggedIn$.next(false);
  }

  setToken(token: string): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);

    this.loggedIn$.next(true);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  setUser(user: any): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}
