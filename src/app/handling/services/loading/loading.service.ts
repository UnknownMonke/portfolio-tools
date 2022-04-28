import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Loading and progress management service.
 *
 * ---
 *
 * Provides an Observable that allow views to trigger a loading spinner on the screen, using the PrimeNG ProcessSpinner component.
 *
 * Loading is triggered in :
 * - HTTP Interceptor (for requests).
 *
 * Observable is subscribed by multiple views throughout the application.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  // BehaviorSubject can be subscribed to multiple times by multiple sources.
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Emits the new value.
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}

/**
 * Façade of `LoadingService`.
 *
 * ---
 *
 * Service containing publicly exposed data from the private service.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingFacade {

  // Exposes the Subject as Observable to make it read-only for subscribers (cannot call next on it).
  loading$: Observable<boolean> = this._loadingService.loadingSubject.asObservable();

  constructor(
    private _loadingService: LoadingService
  ) {}
}
