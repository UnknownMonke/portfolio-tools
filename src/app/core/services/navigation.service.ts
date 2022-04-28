import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';

/**
 * Service to handle various navigation events.
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {}

  /**
   * Subscribes to the navigation event to update data on route change.
   * After the navigation is completed, get various data from the current route.
   */
  observeNavigation(): Observable<string> {
    return this._router.events
      .pipe(
        filter( (event: any) => event instanceof NavigationEnd),
        map(() => this.getTitle())
      );
  }

  /**
   * Returns the current title of the page found in the current route 'data' attribute.
   */
  getTitle(): string {
    let child = this._activatedRoute.firstChild;

    while(child) {

      if(child.firstChild) {
        child = child.firstChild;

      } else if(child.snapshot.data && child.snapshot.data['title']) {
        return child.snapshot.data['title'];

      } else {
        return '';
      }
    }
    return '';
  }
}
