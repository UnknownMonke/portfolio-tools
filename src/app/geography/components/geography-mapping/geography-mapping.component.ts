import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GeographyService } from 'src/app/geography/service/geography.service';
import { Geography } from 'src/app/geography/model/geography';
import { LoadingService } from 'src/app/handling/services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinner, ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';

/**
 * Component to edit Geographies.
 *
 * ---
 *
 * Displays all Geographies in a PrimeNG Table, with creation, edition and deletion buttons.
 *
 * The table is sorted by default in alphabetical order.
 *
 * Geographies only consist of an id and name.
 * All Geographies are on the same level for now.
 *
 * The same modal handles creation and edition, the table provides the selected DTO to edit.
 * Only the Geography name can be edited, the forms only contains one value.
 * The modals updates its title and selected name according to the action selected.
 *
 * Deletion is handled through a PrimeNG Confirmation modal.
 *
 * The loader is activated for longer requests.
 */
//TODO component for modal
@Component({
  selector: 'app-geography-mapping',
  templateUrl: './geography-mapping.component.html',
  styleUrls: ['./geography-mapping.component.scss']
})
export class GeographyMappingComponent implements OnInit {

  // Modal elements. Changes title and selected DTO to send.
  modalTitle: string = '';
  show: boolean = false; // Shows modal.
  submitted: boolean = false; // Form validation.

  // Using Angular template driven forms. //TODO
  name: FormControl = new FormControl('', [Validators.required]);
  selectedGeography: Geography | undefined;

  // DTO list.
  geographyList: Geography[] = [];

  constructor(
    public loadingService: LoadingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private geographyService: GeographyService
  ) {}

  ngOnInit(): void {
    this.getGeographies(); // Loads Geography list on init.
  }

  /**
   * Called upon creation and edition. In this case contains the selected Geography DTO as parameter.
   */
  openModal(geography?: Geography): void {
    this.show = true;
    this.submitted = false;

    if(geography) {
      this.name.setValue(geography.name); // Updates form input value.
      this.modalTitle = 'Edit Geography';
      this.selectedGeography = geography;

    } else {
      this.name.setValue(''); // Resets form input from previous openings.
      this.modalTitle = 'Create new Geography';
      this.selectedGeography = undefined;
    }
  }

  hideModal(): void {
    this.show = this.submitted = false;
  }

  /** ---------------------- CRUD ---------------------- */

  getGeographies(): void {
    this.geographyService.get()
      .subscribe( (data: Geography[]) => { // Subscribing will actually launch the request.
        this.geographyList = data;
      });
  }

  addGeography(): void {
    this.submitted = true;
    this.show = false; // Closes modal before request.

    if(this.name.value && this.name.value !== '') {

      this.geographyService.add(this.name.value)
        .subscribe( (data: Geography) => {
          // Updates DTO list by spreading to retrigger data update with sorts and filters.
          this.geographyList = [...this.geographyList, data];

          // Displays toast popup to confirm action success.
          this.messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully added' });
        });
    }
  }

  editGeography(geography: Geography): void {
    this.submitted = true;
    this.show = false;

    if(this.name.value && this.name.value !== '') {

      // Clones the parameter to avoid updating it in the table before request success, as it's an underlying component property.
      const clone = {...geography};
      // Updates the clone with the form value.
      clone.name = this.name.value;

      this.geographyService.edit(clone)
        .subscribe( (success: boolean) => {
          if(success) {
            // Upon success, finds the corresponding DTO in the list and updates (works with filter action as well).
            this.geographyList.filter(geo => geo._id === geography._id)[0].name = this.name.value; // Always present.
            // Updates DTO list by spreading to retrigger data update with sorts and filters.
            this.geographyList = [...this.geographyList];

            this.messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully edited' });
          }
        });
    }
  }

  deleteGeography(id: number): void {
    // Fills confirmation modal.
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete this geography ?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.geographyService.delete(id)
          .subscribe( (success: boolean) => {
            if(success) {
              // Updates DTO list by spreading to retrigger data update with sorts and filters.
              this.geographyList.splice(this.findIndexFromId(id), 1)
              this.geographyList = [...this.geographyList];

              this.messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully deleted' });
            }
          });
      }
    });
  }

  /** -------------------------------------------------- */

  //TODO TUs
  private findIndexFromId(id: number): number {
    const idList = this.geographyList.map(geography => geography._id);

    return idList.indexOf(
      idList.filter(curr_id => curr_id === id)[0]
    );
  }
}

@NgModule({
  declarations: [GeographyMappingComponent],
  exports: [GeographyMappingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class GeographyMappingModule {}
