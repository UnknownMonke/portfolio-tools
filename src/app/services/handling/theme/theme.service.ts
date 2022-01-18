import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/** Service d'injection de stylesheet au runtime via un link HTML */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Récupération du doc HTML
  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  //TODO persister avec l'utilisateur
  // Change la stylesheet externe (theme PrimeNG) et la stylesheet interne (couleurs perso)
  toggleDarkMode(toggle: boolean): void {

    const extTheme: string = toggle ? 'vela-blue' : 'saga-blue';
    const localTheme: string = toggle ? 'theme-dark' : 'theme-light';

    this.toggleTheme('app-ext-theme', extTheme);
    this.toggleTheme('app-theme', localTheme);
  }

  // Récupère la sheet pour l'id correspondante et update le href
  toggleTheme(linkId: string, themeName: string): void {
    const themeLink = this.document.getElementById(linkId) as HTMLLinkElement;

    if(themeLink) {
      themeLink.href = themeName + '.css';
    }
  }
}
