import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/services/handling/theme/theme.service';

/**
 * Header de l'application.
 *
 * - Accessible seulement si connecté.
 * - Contiens :
 *    - Accès à l'édition des géographies et secteurs.
 *    - Accès au dashboard
 *    - Titre de la page actuelle.
 *    - Précédent / Suivant.
 *    - Profil utilisateur, logout et menu options.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title: string = "";
  manageItems: MenuItem[] = [];

  checked: boolean = false;
  displaySidebar: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.observeNavigation();

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

  toggleDarkMode(event: any): void {
    this.themeService.toggleDarkMode(event.checked);
  }
}
