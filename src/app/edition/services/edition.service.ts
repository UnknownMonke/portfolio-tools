import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Geography } from 'src/app/common/models/geography';
import { Sector } from 'src/app/common/models/sector';
import { SectorService } from 'src/app/edition/services/sector.service';
import { GeographyService } from './geography.service';

/**
 * Service to handle opening, filling and submitting the Geographies & Sectors edition modal.
 *
 * Allows for adding, editing and deleting Geographies & Sectors through a form contained within the modal.
 */
@Injectable({
  providedIn: 'root'
})
export class EditionService {

  private _modalShowSubject = new BehaviorSubject<boolean>(false);
  private _modalDataSubject = new BehaviorSubject<ModalData>({ title: '', formFields: { name: '' }});

  private _selectedType?: 'geo' | 'sec';
  private _currentAction?: 'add' | 'addChild' | 'edit' | 'del';
  private _selectedGeography?: Geography;
  private _selectedSector?: Sector;

  modalShow$: Observable<boolean> = this._modalShowSubject.asObservable();
  modalData$: Observable<ModalData> = this._modalDataSubject.asObservable();

  constructor(
    private _confirmationService: ConfirmationService,
    private _geographyService: GeographyService,
    private _sectorService: SectorService
  ) {}

  show(show: boolean): void {
    this._modalShowSubject.next(show);
  }

  setData(title: string, name: string): void {
    this._modalDataSubject.next({ title, formFields: { name }});
  }

  openModal(action: 'add' | 'addChild' | 'edit' | 'del', type: 'geo' | 'sec', data?: Geography | Sector): void {
    this._selectedType = type;
    this._currentAction = action;

    switch(type) {
      case 'geo':
        this.openModalGeo(action, data as Geography | undefined);
        break;

      case 'sec':
        this.openModalSector(action, data as Sector | undefined);
        break;

      default:
        break;
    }
  }

  openModalGeo(action: 'add' | 'addChild' | 'edit' | 'del', data?: Geography): void {
    switch(action) {

      case 'add':
        this.setData('Create new Geography', '');
        this._selectedGeography = undefined;
        this.show(true);
        break;

      case 'edit':
        if(data) {
          this.setData('Edit Geography', data.name);
          this._selectedGeography = data;
          this.show(true);
        }
        break;

      case 'del':
        if(data) {
          // Fills confirmation modal.
          this._confirmationService.confirm({
            header: 'Confirm',
            message: 'Are you sure you want to delete this geography ?',
            rejectButtonStyleClass: 'p-button-text p-button-danger',
            accept: () => this._geographyService.delete(data._id)
          });
        }
        break;

      default:
        break;
    }
  }

  openModalSector(action: 'add' | 'addChild' | 'edit' | 'del', data?: Sector): void {
    switch(action) {

      case 'add':
        this.setData('Add Major Sector', '');
        this._selectedSector = undefined;
        this.show(true);
        break;

      case 'addChild':
        if(data) {
          this.setData('Add Sub Sector', '');
          this._selectedSector = data as Sector;
          this.show(true);
        }
        break;

      case 'edit':
        if(data) {
          this.setData('Edit Sector', data.name);
          this._selectedSector = data;
          this.show(true);
        }
        break;

      case 'del':
        if(data) {
          // Fills confirmation modal.
          this._confirmationService.confirm({
            header: 'Confirm',
            message: 'Are you sure you want to delete this sector ?',
            rejectButtonStyleClass: 'p-button-text p-button-danger',
            accept: () => this._sectorService.delete(data)
          });
        }
        break;

      default:
        break;
    }
  }

  submit(name: string): void {
    this.show(false);

    switch(this._selectedType) {

      case 'geo':
        if(this._currentAction === 'edit' && this._selectedGeography) {
          this._geographyService.edit({...this._selectedGeography, name});

        } else {
          this._geographyService.add(name);
        }
        break;

      case 'sec':
        if(this._currentAction === 'add') {
          this._sectorService.add(name);

        } else if(this._currentAction === 'addChild' && this._selectedSector) {
          this._sectorService.add(name, this._selectedSector);

        } else if(this._currentAction === 'edit' && this._selectedSector) {
          this._sectorService.edit({...this._selectedSector, name});
        }
        break;

      default:
        break;
    }
  }
}

export interface ModalData {
  title: string,
  formFields: {
    name: string
  }
}
