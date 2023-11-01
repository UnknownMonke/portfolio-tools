import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SessionService } from 'src/app/auth/services/session.service';
import { ButtonModule } from 'src/app/common/components/button/button.component';
import { TieredMenuModule } from 'src/app/common/components/tiered-menu/tiered-menu.component';
import { ThemeList } from 'src/app/common/enums/themes';
import { ThemeService } from 'src/app/core/services/theme.service';

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
  templateUrl: './user-menu.component.html'
})
export class UserMenuComponent {

  // Defines PrimeNG Menu component array for the menu.
  readonly menuItems: MenuItem[] = [
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
    private _router: Router,
    private _sessionService: SessionService,
    private _themeService: ThemeService
  ) {}

  logout(): void {
    this._sessionService.signOut();
    this._router.navigateByUrl('/login');
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [UserMenuComponent],
  exports: [UserMenuComponent],
  imports: [
    TieredMenuModule,
    ButtonModule
  ]
})
export class UserMenuModule {}
