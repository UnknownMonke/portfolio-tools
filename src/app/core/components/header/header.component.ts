import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/handling/services/theme/theme.service';
import { SessionService } from 'src/app/auth/services/session.service';
import { ThemeList } from 'src/app/common/enums/themes';

/**
 * Application Header.
 *
 * ---
 *
 * Contains various menus and navigation :
 * - Navigation to Geography and Sector mapping.
 * - Navigation to dashboard, homepage of the application.
 * - Title of the current view (defined in the routes).
 * - Navigate to previous and next page.
 * - Access to user menu, settings and logout options.
 *
 * The header is displayed only when user is connected, despite being injected independently from the router.
 * This logic is handled here rather than inside the root component to prevent header displaying before past-login redirection.
 *
 * Therefore the component is always injected but only displayed when logged in.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // Init parameters.
  isLoggedIn: boolean = false;
  title: string = "";
  manageItems: MenuItem[] = [];
  settingsItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    // Displays component only if logged in (token is present). Will also update on login change.
    this.isLoggedIn = !!this.sessionService.getToken();

    this.sessionService.loggedIn$
      .subscribe( (value: boolean) => {
        this.isLoggedIn = value;
      });

    // Defines PrimeNG Menu component arrays, for management menu and user settings menu.
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
        label: 'Select Theme',
        icon: 'pi pi-sun',
        styleClass: 'menu-left',
        items: [
          {
            label: 'Use device theme',
            command: () => this.themeService.updateTheme(ThemeList.DEFAULT)
          },
          {
            label: 'Light theme',
            command: () => this.themeService.updateTheme(ThemeList.LIGHT)
          },
          {
            label: 'Dark theme',
            command: () => this.themeService.updateTheme(ThemeList.DARK)
          }
        ]
      },
      {
        label: 'Log Out',
        icon: 'pi pi-power-off',
        command: () => this.logout()
      }
    ];

    this.observeNavigation();
  }

  /**
   * Subscribes to the navigation event to update the page title on route change.
   * After the navigation is completed, get the title from the data attribute of the current route.
   */
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
      ).subscribe( (data: any) => { // Analog to jQuery ".on('change')", listens to the event emitted by an Observable, and lauches the request.
        if(data) {
          this.title = data;
        }
      });
  }

  logout(): void {
    this.sessionService.signOut();
    location.reload();
  }

  // Unsubscribes to observable to avoid memory leaks.
  ngOnDestroy(): void {
    this.sessionService.loggedIn$.unsubscribe();
  }
}
