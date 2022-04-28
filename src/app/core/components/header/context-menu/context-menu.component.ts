import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { LastPageDirective } from 'src/app/core/directives/last-page.directive';
import { NextPageDirective } from 'src/app/core/directives/next-page.directive';

/**
 * Context management menu.
 *
 * ---
 *
 * Located on the top left of the application.
 *
 * Handles various actions :
 * - Navigation to previous and next page.
 * - Navigation to Geography and Sector mapping.
 * - Navigation to dashboard, homepage of the application.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {

  // Defines PrimeNG Menu component array for context menu.
  menuItems: MenuItem[] = [
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

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [
    ContextMenuComponent,
    LastPageDirective,
    NextPageDirective
  ],
  exports: [ContextMenuComponent],
  imports: [
    RouterModule,
    ButtonModule,
    MenuModule
  ]
})
export class ContextMenuModule {}
