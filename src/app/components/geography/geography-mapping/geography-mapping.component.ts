import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Geography } from 'src/app/models/geography';
import { GeographyService } from 'src/app/services/geography/geography.service';
import { LoadingService } from 'src/app/services/handling/loading/loading.service';

/**
 * Composant pour l'édition des secteurs géographiques.
 *
 * - Utilise les Reactive Forms.
 * - Affiche sous forme de table éditable (PrimeNG), via popup puis CRUD.
 */
@Component({
  selector: 'app-geography-mapping',
  templateUrl: './geography-mapping.component.html',
  styleUrls: ['./geography-mapping.component.scss']
})
export class GeographyMappingComponent implements OnInit {

  name: FormControl = new FormControl('', [Validators.required]);

  selectedGeography: Geography | undefined;

  modify: boolean = false; // Ouverture modal.
  submitted: boolean = false; // Form validation.
  dialogTitle: string = "";
  geographyList: Geography[] = [];

  constructor(
    public loadingService: LoadingService,
    private confirmationService: ConfirmationService,
    private geographyService: GeographyService
  ) {}

  ngOnInit(): void {
    this.getGeographies();
  }

  // Ouverture popup de confirmation.
  openDialog(geography?: Geography): void {
    this.modify = true;
    this.submitted = false;

    if(geography) {
      this.name.setValue(geography.name); // Met l'input à jour avec le nom sélectionné.
      this.dialogTitle = "Edit Geography";
      this.selectedGeography = geography;

    } else {
      this.name.setValue(''); // Reset input.
      this.dialogTitle = "Create new Geography";
      this.selectedGeography = undefined;
    }
  }

  hideDialog(): void {
    this.modify = false;
    this.submitted = false;
  }

  /**------------------------CRUD------------------------*/
  getGeographies(): void {
    this.geographyService.getGeographies()
      .subscribe( (data: Geography[]) => { // Subscribe will actually launch the request.
        this.geographyList = data;
      });
  }

  editGeography(geography?: Geography): void {
    this.submitted = true;

    // Edition
    if(geography) {

      if(this.name.value !== '') {
        geography.name = this.name.value; // Met à jour le nom avec le contenu de l'input.

        this.geographyService.editGeography(geography)
          .subscribe( (status: number) => {
            if(status === 200) {
              this.modify = false; // Le dialog écoute le changement d'attribut et se fermera.
              // Update data property.
              this.geographyList[this.findIndexFromId(geography._id)].name = geography.name;
            }
          });
      }
    // Ajout nouvelle geographie.
    } else {
      this.geographyService.addGeography(this.name.value)
        .subscribe( (data: Geography) => {
          this.modify = false; // Le dialog écoute le changement d'attribut et se fermera.
          // Update data property.
          this.geographyList.push(data);
        });
    }
  }

  deleteGeography(id: string): void {
    // Remplissage du modal de confirmation.
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete this geography ?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.geographyService.deleteGeography(id)
          .subscribe( (status: number) => {
            if(status === 200) {
              // Update data property.
              this.geographyList.splice(this.findIndexFromId(id), 1);
            }
          });
        //TODO alert message
      }
    });
  }

  //TODO TUs
  private findIndexFromId(id: string): number {
    const idList = this.geographyList.map(geography => geography._id);
    return idList.indexOf(
      idList.filter(curr_id => curr_id === id)[0]
    );
  }
}
