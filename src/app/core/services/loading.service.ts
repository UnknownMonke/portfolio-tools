import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Loading and progress management service.
 *
 * ---
 *
 * Provides an Observable that allow views to trigger a loading spinner on the screen, using the ProcessSpinner component.
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
  private _loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this._loadingSubject.asObservable();

  /**
   * Emits the new value.
   */
  setLoading(loading: boolean): void {
    this._loadingSubject.next(loading);
  }
}
