import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/services/handling/theme/theme.service';
import { TokenStorageService } from 'src/app/services/auth/token-storage.service';

/**
 * Header de l'application.
 *
 * Contiens :
 * - Accès à l'édition des géographies et secteurs.
 * - Accès au dashboard
 * - Titre de la page actuelle.
 * - Précédent / Suivant.
 * - Profil utilisateur, logout et options.
 *
 * Le header n'est accessible que si l'utilisateur est connecté.
 * Cela est géré ici plutôt que dans le composant d'appel (AppComponent) pour éviter de charger le header avant la redirection post-login.
 *
 * Ainsi le composant est dans tous les cas chargé, mais il est vide dans certains cas (page de login).
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;

  title: string = "";
  manageItems: MenuItem[] = [];
  settingsItems: MenuItem[] = [];

  checked: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    // Gestion refresh après être loggé, le sujet n'émet rien donc on regarde si le token existe directement
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    // Récupère la préférence du thème
    this.checked = localStorage.getItem('darkMode') === 'true';

    // Menu de management secteurs / géographies.
    this.manageItems = [
      {
        label: 'Edit Geographies',
        routerLink: ['/edit/geography']
      },
      {
        label: 'Edit Sectors',
        routerLink: ['/edit/sector']
      }
    ];

    this.settingsItems = [
      {
        id: 'setting-dm',
        label: 'Toggle Dark Mode',
        icon: 'pi pi-sun',
        command: (event: any) => this.toggleDarkMode()
      },
      {
        id: 'setting-logout',
        label: 'Log Out',
        icon: 'pi pi-power-off',
        command: (event: any) => this.logout()
      }
    ];

    this.tokenStorageService.loggedIn$
    .subscribe( (value: boolean) => {
      this.isLoggedIn = value;
    });

    this.observeNavigation();
  }

  // Subscribe à la navigation pour mettre à jour le titre du header.
  observeNavigation(): void {
    this.router.events
      .pipe(
        filter( (event: any) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while(child) {
            if(child.firstChild) {
              child = child.firstChild;
            } else if(child.snapshot.data && child.snapshot.data['title']) {
              return child.snapshot.data['title'];
            } else {
              return null;
            }
          }
          return null;
        })
      ).subscribe( (data: any) => { // Analog to jQuery ".on()".
        if(data) {
          this.title = data;
        }
      });
  }

  toggleDarkMode(): void {
    this.checked = !this.checked;
    this.themeService.toggleDarkMode(this.checked);
  }

  logout(): void {
    this.tokenStorageService.signOut();
    location.reload();
  }

  ngOnDestroy(): void {
    this.tokenStorageService.loggedIn$.unsubscribe();
  }
}
