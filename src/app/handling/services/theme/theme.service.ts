import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ThemeList } from 'src/app/common/enums/themes';
import { User } from 'src/app/auth/model/user';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SessionService } from 'src/app/auth/services/session.service';

/**
 * Application Theme service.
 *
 * ---
 *
 * Can handle different themes (mainly dark and light mode).
 *
 * ---
 *
 * How themes are handled :
 *
 * - Each theme has a normal css stylesheet inside the '/assets/themes' folder.
 *
 * - The stylesheet defines custom root variables and import the corresponding PrimeNG Theme stylesheet, so we only end up with one global stylesheet.
 *   These stylesheets defines the theme for the whole application.
 *
 * - Rather than loading the css through the Webpack ('styles' option in Angular.json), the theme is directly loaded in the HTML head through a link tag.
 *   This allows for switching stylesheet at runtime by editing the href. The link is empty by default.
 *
 * - Since the css is injected through Javascript, the screen will flash white before the application is bootstrapped, as the DOM is initialized with an empty (white) background.
 *
 * - To avoid this FOIT (Flash Of Incorrect Theme):
 *    - The theme is loaded through a script injected in the Angular.json ('scripts' option), as it is executed before the bootstrapping.
 *    - The body background is set separately from the stylesheet injection, by checking the user-agent preference and setting a 'data-theme' attribute in the html tag.
 *      The DOM is re-rendered immediately an no flash occurs. The attribute is handled directly inside the main stylesheet (style.scss).
 *
 * ---
 *
 * Flow of the Theme setting :
 *
 * - App opens, no user is logged : the user-agent preference is used (prefers-color-scheme).
 *
 * - The user logs in: the chosen theme is loaded from the user settings.
 *    - If the theme is set to default (user chose system setting, or never chose anything ever), the user-agent preference is still used.
 *    - Else, the theme is set to the user preferred theme, and the value is persisted on its own in sessionStorage for faster reading (faster than retreiving it from the user object).
 *
 * - While the user is logged in, its preferred theme is used, even on page refresh/reload (Angular reloads the entire app, so this is handled by the script again).
 *
 * - If the user changes the theme, the new theme is persisted into the user settings and the value stored in sessionStorage is updated.
 *
 * - When the user logs off, the sessionStorage is cleared, so the login page can use the user-agent preference again.
 *
 * ---
 *
 * Theme is handled or referenced in :
 * - Theme service.
 * - Script executed before bootstrapping.
 * - Login component.
 * - Header component where theme settings are located.
 * - Main scss stylesheet and specific stylesheets.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Retrieves the HTML Document.
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private sessionService: SessionService
  ) {}

  /**
   * Sets the theme and persists it into user settings.
   *
   * @param theme name of the theme to apply. Always defined, and equal to a theme name, or 'default' for user-agent preference.
   */
  updateTheme(theme: string): void {

    // Retreives active user object from session.
    const user: User | null = this.sessionService.getUser();

    if(user !== null) {
      user.settings.theme = theme;

      this.authService.updateUserSettings(user)
      .pipe(
        map( (success: boolean) => {
          if(success) this.setTheme(theme); // Wait for success before updating.
        }) // dans un map car tout sera fait en async
      ).subscribe();
    }
  }

  /**
   * Effectively changes the application theme by updating the stylesheet href and setting the HTML tag data attribute,
   * as well as saving the current theme in sessionStorage.
   *
   * @param theme name of the theme to apply. Always defined, and equal to a theme name, or 'default' for user-agent preference.
   */
  setTheme(theme: string): void {

    // Converts default theme value to the user-agent preference.
    if(theme === ThemeList.DEFAULT) {

      if(window.matchMedia('(prefers-color-scheme: dark').matches) {
        theme = ThemeList.DARK;

      } else {
        theme = ThemeList.LIGHT;
      }
    }

    const themeNode = this.document.getElementById('theme') as HTMLLinkElement;

    if(themeNode) {
      themeNode.href = 'theme-' + theme + '.css';
      document.documentElement.setAttribute('data-theme', theme);

      sessionStorage.setItem('theme', theme);
    }
  }
}
