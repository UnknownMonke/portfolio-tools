import { BehaviorSubject, distinctUntilChanged, Observable, map, shareReplay } from 'rxjs';

/**
 * State management functional service.
 *
 * ---
 *
 * Holds a state inside a BehaviorSubject and provides methods to read and write the state.
 */
export class StateService<T> {

  private _state$: BehaviorSubject<T>;

  constructor(initialState: T) {
    this._state$ = new BehaviorSubject<T>(initialState);
  }

  protected get state(): T {
    return this._state$.getValue();
  }

  protected set state(newState: T) {
    this._state$.next({ ...newState });
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this._state$.asObservable()
      .pipe(
        map((state: T) => mapFn(state)),
        shareReplay({ refCount: true, bufferSize: 1 })
      );
  }
}
