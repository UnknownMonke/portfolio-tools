import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User, UserInfos } from 'src/app/models/user';

const TOKEN_KEY = 'auth-token';
const USER_KEY = "auth-user";

/**
 * Service to handle session parameters through sessionStorage.
 *
 * Stores the JWT (JSON Web Token) and user details (username, email, settings...) upon login.
 *
 * The token is created server-side when the user logs in.
 * It stays stored as long as the user stays connected, or until the tab / browser window is deleted.
 *
 * sessionStorage is cleared when session expires, unlike localStorage.
 *
 * An Observable is created to easily notify other parts of the application.
 *
 * ---
 *
 * Login is achieved by storing the newly created token and user details in the session.
 *
 * Logout is implemented by simply cleaning the session of all attributes.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  loggedIn$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getUser(): User | null {
    const user = sessionStorage.getItem(USER_KEY);

    // Parsing string | null is possible but not allowed by the compiler.
    if(user) return JSON.parse(user);

    return null;
  }

  /**
   * Will store token and user details in session if both are valid (not null, not undefined).
   * Will also store user settings such as current theme and so on.
   *
   * Only then the login event is emitted and the view can be accessed through the AuthGuard.
   *
   * @param userInfos must contain existing token and user object.
   */
  signIn(userInfos: UserInfos): void {

    sessionStorage.setItem(TOKEN_KEY, userInfos.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(userInfos.user));

    this.loggedIn$.next(true); // next emits the value, validates login.
  }

  signOut(): void {
    sessionStorage.clear();

    this.loggedIn$.next(false);
  }
}
