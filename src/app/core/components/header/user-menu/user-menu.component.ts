import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SessionService } from 'src/app/auth/services/session.service';
import { ThemeList } from 'src/app/common/enums/themes';
import { ThemeService } from 'src/app/handling/services/theme/theme.service';

/**
 * User settings menu.
 *
 * ---
 *
 * Located on the top right of the application.
 *
 * Handles various user settings :
 * - Application theme selection.
 * - Log out.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent { // No need for OnInit implementation.

  // Defines PrimeNG Menu component array for user settings menu.
  menuItems: MenuItem[] = [
    {
      label: 'Select Theme',
      icon: 'pi pi-sun',
      styleClass: 'menu-left',
      items: [
        {
          label: 'Use device theme',
          command: () => this._themeService.updateTheme(ThemeList.DEFAULT)
        },
        {
          label: 'Light theme',
          command: () => this._themeService.updateTheme(ThemeList.LIGHT)
        },
        {
          label: 'Dark theme',
          command: () => this._themeService.updateTheme(ThemeList.DARK)
        }
      ]
    },
    {
      label: 'Log Out',
      icon: 'pi pi-power-off',
      command: () => this.logout()
    }
  ];

  constructor(
    private _sessionService: SessionService,
    private _themeService: ThemeService
  ) {}

  logout(): void {
    this._sessionService.signOut();
    location.reload();
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [UserMenuComponent],
  exports: [UserMenuComponent],
  imports: [
    ButtonModule,
    MenuModule,
    TieredMenuModule
  ]
})
export class UserMenuModule {}
