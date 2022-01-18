import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { TokenStorageService } from "./token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn: boolean = !!this.tokenStorageService.getToken();

    if(isLoggedIn) {
      return true;
    }

    // Redirect to login page with the return url (url previously queried)
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

}
