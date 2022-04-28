import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Geography } from '../model/geography';
import { GeographyApiService } from './geography-api.service';

@Injectable({
  providedIn: 'root'
})
export class GeographyService {

  geographyListSubject: BehaviorSubject<Geography[]> = new BehaviorSubject<Geography[]>([]);

  constructor(
    private messageService: MessageService,
    private geographyApiService: GeographyApiService
  ) {}

  get(): Observable<void> {
    return this.geographyApiService.get()
      .pipe(
        map( (data: Geography[]) => this.geographyListSubject.next(data))
      );
  }

  add(name: string): Observable<void> {

    if(!!name) {

      return this.geographyApiService.add(name)
        .pipe(
          map( (data: Geography) => {
            let geographyList: Geography[] = this.geographyListSubject.value;

            this.geographyListSubject.next([...geographyList, data]);

            // Displays toast popup to confirm action success.
            this.messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully added' });
          })
        );
    }
    throw new Error('Name is not defined');
  }

  edit(geography: Geography): Observable<void> {

    if(!!geography?.name) {

      // Clones the parameter to avoid updating it in the table before request success, as it's an underlying component property.


      return this.geographyApiService.edit(geography)
        .pipe(
          map( (success: boolean) => {
            if(success) {
              // Upon success, finds the corresponding DTO in the list and updates (works with filter action as well).
              let geographyList: Geography[] = this.geographyListSubject.value;

              geographyList.filter(geo => geo._id === geography._id)[0].name = geography.name; // Always present.

              // Updates DTO list by spreading to retrigger data update with sorts and filters.
              this.geographyListSubject.next([...geographyList]);

              this.messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully edited' });
            }
          })
        );
    }
    throw new Error('Name is not defined');
  }

  delete(id: number): Observable<void> {
      return this.geographyApiService.delete(id)
        .pipe(
          map( (success: boolean) => {
            if(success) {
              // Updates DTO list by spreading to retrigger data update with sorts and filters.
              let geographyList: Geography[] = this.geographyListSubject.value;

              geographyList.splice(this.findIndexFromId(geographyList, id), 1);
              this.geographyListSubject.next([...geographyList]);

              this.messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully deleted' });
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

@Injectable({
  providedIn: 'root'
})
export class GeographyFacade {

  // Exposes the Subject as Observable to make it read-only for subscribers (cannot call next on it).
  geographyList$: Observable<Geography[]> = this._geographyService.geographyListSubject.asObservable();

  constructor(
    private _geographyService: GeographyService
  ) {}
}
