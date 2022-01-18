import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = "auth-user";

/** Manage token and user infos (username, email) inside Browser's session storage. For logout, we just clear the storage */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {}

  signOut(): void {
    sessionStorage.clear();
  }

  updateToken(token: string): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  updateUser(user: any): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}
