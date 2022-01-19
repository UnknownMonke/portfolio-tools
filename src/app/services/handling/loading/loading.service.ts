import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/** Service d'activation du loader, via un Observable. */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  // Change l'état de l'observable selon la valeur d'entrée.
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}
