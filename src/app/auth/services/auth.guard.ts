import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { SessionService } from "./session.service";

/**
 * Service to handle user rights.
 *
 * ---
 *
 * Requirements :
 * - Every view can be accessed as long as an user is logged in (ie the token is present).
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _sessionService: SessionService
  ) {}

  /**
   * Checks if the route can be activated.
   *
   * Will be called for every view of the application, inside the routing module,
   * to determine if the user can or cannot access it, or if the view can be accessed while logged off.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    /*
    Double negation : getToken() returns a string or null.
    A single exclamation mark can negate an expression which is not a boolean.
    Ex : !'a' <=> 'a' === null => false since 'a' is not the null string.
    So !!getToken() <=> getToken() !== null ? true : false;
    */
    const isLoggedIn: boolean = !!this._sessionService.getToken();

    if(!isLoggedIn) {
      // Redirects to login page.
      this._router.navigate(['/login']);
    }
    return isLoggedIn;
  }
}
