import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { SessionFacade } from 'src/app/auth/services/session.service';
import { CommonModule } from '@angular/common';
import { UserMenuModule } from './user-menu/user-menu.component';
import { ContextMenuModule } from './context-menu/context-menu.component';

/**
 * Application Header container component.
 *
 * ---
 *
 * This component is only a container and only handles display when user is logged in.
 *
 * Contains various menus and navigation :
 *
 * - Context menu component :
 *    - Navigate to previous and next page.
 *    - Navigation to Geography and Sector mapping.
 *    - Navigation to dashboard, homepage of the application.
 *
 * - Title of the current view, handled in parent component (appComponent) through ng-content.
 *
 * - User menu component :
 *    - Access to user menu, settings and logout options.
 *
 * The header is displayed only when user is connected (through sessionFacade), despite being injected independently from the router.
 * This logic is handled here rather than inside the root component to prevent header displaying before past-login redirection.
 *
 * Therefore the component is always injected but only displayed when logged in.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    public sessionFacade: SessionFacade
  ) {}
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [
    CommonModule,
    ContextMenuModule,
    UserMenuModule
  ]
})
export class HeaderModule {}
