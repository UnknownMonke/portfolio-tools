import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, filter, map, merge } from 'rxjs';

/**
 * Service to handle various navigation events.
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private _titleSubject$ = new BehaviorSubject<string>('');

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  /**
   * Merger: return the router event observable and the Subject merged, so that the component
   * can subscribe to the router event AND trigger the getTitle method by emitting in the Subject
   * at initialization, in a declarative way.
   * This allows for a single subscription in the component, without directly calling the Subject from the component or handling subscription in the service.
   */
  title$(): Observable<string> {
    return merge(
      this._titleSubject$.asObservable(),
      this._router.events
        .pipe(
          filter( (event: any) => event instanceof NavigationEnd),
          map(() => this._getTitle()) // Subscribes to the navigation event to update title on route change.
        )
    );
  }

  loadTitle(): void {
    this._titleSubject$.next(this._getTitle());
  }

  /**
   * Watches if the navigated route is valid to display header and footer.
   */
  routeValid(): Observable<boolean> {
    return this._router.events
      .pipe(
        filter( (event: any) => event instanceof NavigationEnd),
        map((event: any) =>
          this._matchRoute(event.url))
      );
  }

  /**
   * Returns the current title of the page found in the current route 'data' attribute.
   */
  private _getTitle(): string {
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

  //TODO TUs
  private _matchRoute(url: string): boolean {
    let path = this._activatedRoute.snapshot.children[0].routeConfig?.path;

    if(path?.includes(':')) {
      path = path.substring(0, path.indexOf(':'));
      return url.includes(path);

    } else {
      return path === url.replace('/', '');
    }
  }
}
