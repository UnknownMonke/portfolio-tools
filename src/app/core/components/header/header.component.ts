import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { SessionService } from 'src/app/auth/services/session.service';
import { TitleModule } from 'src/app/core/components/title/title.component';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { NavMenuModule } from '../nav-menu/nav-menu.component';
import { UserMenuModule } from '../user-menu/user-menu.component';

/**
 * Application Header container component.
 *
 * ---
 *
 * This component is only a container and only handles display when user is logged in.
 *
 * Contains various menus and navigation :
 *
 * - Navigation menu component :
 *    - Navigate to previous and next page.
 *    - Navigation to Geography and Sector mapping.
 *    - Navigation to dashboard, homepage of the application.
 *
 * - Title of the current view, handled in parent component (appComponent) through ng-content.
 *
 * - User menu component :
 *    - Access to user menu, settings and logout options.
 *
 * The header is displayed only when user is connected or when the route is valid, despite being injected independently from the router.
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

  readonly display$: Observable<boolean>;

  constructor(
    private _navigationService: NavigationService,
    private _sessionService: SessionService
  ) {
    this.display$ = combineLatest([
        this._navigationService.routeValid(),
        this._sessionService.loggedIn$
      ])
      .pipe(
        map( ([routeValid, loggedIn]: boolean[]) => routeValid && loggedIn)
      );
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [
    CommonModule,
    NavMenuModule,
    TitleModule,
    UserMenuModule
  ]
})
export class HeaderModule {}
