import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Geography } from '../../common/models/geography';
import { GeographyProvider } from './geography.provider';

@Injectable({
  providedIn: 'root'
})
export class GeographyService {

  private _geographyListSubject: BehaviorSubject<Geography[]> = new BehaviorSubject<Geography[]>([]);

  geographyList$: Observable<Geography[]> = this._geographyListSubject.asObservable()
    .pipe(
      switchMap( (list: Geography[]) =>
        list !== null && list.length > 0 ? of(list) : this.get() ) // Loads from server if empty.
    );

  constructor(
    private _messageService: MessageService,
    private _geographyProvider: GeographyProvider
  ) {}

  get(): Observable<Geography[]> { //TODO double emission calling next within the observable
    return this._geographyProvider.get()
      .pipe(
        tap( (data: Geography[]) => this._geographyListSubject.next(data))
      );
  }

  add(name: string): void {

    if(!!name) {

      this._geographyProvider.add(name)
        .pipe(
          take(1),
          map( (data: Geography) => {
            let geographyList: Geography[] = this._geographyListSubject.value;

            this._geographyListSubject.next([...geographyList, data]);

            // Displays toast popup to confirm action success.
            this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully added' });
          })
        ).subscribe();

    } else {
      throw new Error('Name is not defined');
    }
  }

  edit(geography: Geography): void {

    if(!!geography?.name) {

      this._geographyProvider.edit(geography)
        .pipe(
          take(1),
          map( (success: boolean) => {
            if(success) {
              // Upon success, finds the corresponding DTO in the list and updates (works with filter action as well).
              let geographyList: Geography[] = this._geographyListSubject.value;

              geographyList.filter(geo => geo._id === geography._id)[0].name = geography.name; // Always present.

              // Updates DTO list by spreading to retrigger data update with sorts and filters.
              this._geographyListSubject.next([...geographyList]);

              this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully edited' });
            }
          })
        ).subscribe();

    } else {
      throw new Error('Name is not defined');
    }
  }

  delete(id: number): void {

      this._geographyProvider.delete(id)
        .pipe(
          take(1),
          map( (success: boolean) => {
            if(success) {
              // Updates DTO list by spreading to retrigger data update with sorts and filters.
              let geographyList: Geography[] = this._geographyListSubject.value;

              geographyList.splice(this._findIndexFromId(geographyList, id), 1);
              this._geographyListSubject.next([...geographyList]);

              this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully deleted' });
            }
          })
        ).subscribe();
  }

  //TODO TUs
  private _findIndexFromId(geographyList: Geography[], id: number): number {
    const idList = geographyList.map(geography => geography._id);

    return idList.indexOf(
      idList.filter(curr_id => curr_id === id)[0]
    );
  }
}
