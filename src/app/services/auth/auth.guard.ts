import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { TokenStorageService } from "./token-storage.service";

/**
 * Interface de gestion des droits sur la navigation.
 *
 * Donne accès à la page si l'utilisateur est connecté et qu'il a le droit de la consulter (non implémenté).
 */
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

    // Retourne vers la page de login avec l'info de l'url requêtée précedemment.
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
