import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

/**
 * Navigation management menu.
 *
 * ---
 *
 * Encapsulates the Menubar PrimeNG component.
 *
 * Handles various actions :
 * - Navigation to previous and next page.
 * - Navigation to Geography and Sector mapping.
 * - Navigation to dashboard, homepage of the application.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

  constructor(
    private _location: Location
  ) {}

  // PrimeNG MenuItems definition object.
  readonly menuItems: MenuItem[] = [
    {
      icon: 'pi pi-arrow-left',
      command: () => this._location.back()
    },
    {
      icon: 'pi pi-arrow-right',
      command: () => this._location.forward()
    },
    {
      label: 'Manage',
      items: [
        {
          label: 'Edit Geographies',
          routerLink: ['/edit/geography']
        },
        {
          label: 'Edit Sectors',
          routerLink: ['/edit/sector']
        }
      ]
    },
    {
      label: 'Dashboard',
      routerLink: ['/dashboard']
    }
  ];
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [NavMenuComponent],
  exports: [NavMenuComponent],
  imports: [
    RouterModule,
    MenubarModule
  ]
})
export class NavMenuModule {}
