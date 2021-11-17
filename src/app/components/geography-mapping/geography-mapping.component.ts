import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Geography } from 'src/app/models/geography';

/**
 * mapping via template-driven form (ngModel): la propriété est directement modifiée à chaque itération
 */
@Component({
  selector: 'app-geography-mapping',
  templateUrl: './geography-mapping.component.html',
  styleUrls: ['./geography-mapping.component.scss']
})
export class GeographyMappingComponent implements OnInit {

  modify: boolean = false;
  submitted: boolean = false; //form validation

  dialogTitle: string = "";

  geographyList: Geography[] = [];

  @Input() selectedGeography?: Geography;

  constructor(
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.geographyList = [
      {
        id: 1,
        name: "USA"
      },
      {
        id: 2,
        name: 'EU West'
      }
    ]
  }

  openDialog(geography?: Geography): void {
    this.modify = true;
    this.submitted = false;

    if(geography) {
      this.selectedGeography = geography;
      this.dialogTitle = "Edit Geography";
    } else {
      this.dialogTitle = "Create new Geography";
    }
  }

  hideDialog(): void {
    this.modify = false;
    this.submitted = false;
  }

  editGeography(geography: Geography): void {
    this.submitted = true;

    if(geography.name.trim()) {
      console.log(geography);

      this.modify = false; //le dialog écoute le changement d'attribut et se fermera
    }


  }

  deleteGeography(geography: Geography): void {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete the geography ' + geography.name + '?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        //persistence
        //TODO alert message
        console.log(geography);
      }
    });
  }

}
