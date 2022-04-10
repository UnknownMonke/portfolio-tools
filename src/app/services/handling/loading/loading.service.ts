import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
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
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  // Emits the new value.
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}
