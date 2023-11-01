import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { Geography, GeographyExposition } from '../../common/models/geography';
import { GeographyApiService } from './geography.provider';

@Injectable({
  providedIn: 'root'
})
export class GeographyService {

  private _geographyListSubject: BehaviorSubject<Geography[]> = new BehaviorSubject<Geography[]>([]);
  geoRepartitionSubject: BehaviorSubject<GeographyExposition[]> = new BehaviorSubject([] as GeographyExposition[]);

  geographyList$: Observable<Geography[]>;

  constructor(
    private _messageService: MessageService,
    private _geographyApiService: GeographyApiService
  ) {
    this.geographyList$ = this._geographyListSubject.asObservable()
      .pipe(
        switchMap(list => list !== null && list.length > 0 ? of(list) : this.get())
      )
  }

  get(): Observable<Geography[]> {
    return this._geographyApiService.get()
      .pipe(
        tap( (data: Geography[]) => this._geographyListSubject.next(data))
      );
  }

  add(name: string): Observable<void> {
    if(!!name) {

      return this._geographyApiService.add(name)
        .pipe(
          map( (data: Geography) => {
            let geographyList: Geography[] = this._geographyListSubject.value;

            this._geographyListSubject.next([...geographyList, data]);

            // Displays toast popup to confirm action success.
            this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully added' });
          })
        );
    }
    throw new Error('Name is not defined');
  }

  edit(geography: Geography): Observable<void> {

    if(!!geography?.name) {

      // Clones the parameter to avoid updating it in the table before request success, as it's an underlying component property.


      return this._geographyApiService.edit(geography)
        .pipe(
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
        );
    }
    throw new Error('Name is not defined');
  }

  delete(id: number): Observable<void> {
      return this._geographyApiService.delete(id)
        .pipe(
          map( (success: boolean) => {
            if(success) {
              // Updates DTO list by spreading to retrigger data update with sorts and filters.
              let geographyList: Geography[] = this._geographyListSubject.value;

              geographyList.splice(this.findIndexFromId(geographyList, id), 1);
              this._geographyListSubject.next([...geographyList]);

              this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully deleted' });
            }
          })
        );
  }

  //TODO TUs
  private findIndexFromId(geographyList: Geography[], id: number): number {
    const idList = geographyList.map(geography => geography._id);

    return idList.indexOf(
      idList.filter(curr_id => curr_id === id)[0]
    );
  }
}
