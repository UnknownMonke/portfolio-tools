import { Injectable } from '@angular/core';


/* 
 * service de gestion du titre du header.
 * fonctionne aussi pour mettre à jour le titre de la page en important { Title } from '@angular/platform-browser'
 */
@Injectable({
  providedIn: 'root'
})
export class AppTitleService {

  title: string = "";

  constructor(

  ) {}

  

  getTitle(): string {
    return this.title;
  }
  
  setTitle(newTitle: string): void {
      this.title = newTitle;
  }
}
