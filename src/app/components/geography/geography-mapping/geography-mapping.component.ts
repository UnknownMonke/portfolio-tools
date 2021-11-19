import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Geography } from 'src/app/models/geography';
import { GeographyService } from 'src/app/services/geography/geography.service';


/** Mapping via template-driven form (ngModel): la propriété est directement modifiée à chaque itération */
@Component({
  selector: 'app-geography-mapping',
  templateUrl: './geography-mapping.component.html',
  styleUrls: ['./geography-mapping.component.scss']
})
export class GeographyMappingComponent implements OnInit {

  emptyGeography: Geography = {
    _id: "0",
    name: ""
  };
  modify: boolean = false; // Ouverture modal
  submitted: boolean = false; // Form validation
  dialogTitle: string = "";
  geographyList: Geography[] = [];

  @Input() selectedGeography: Geography = this.emptyGeography;


  constructor(
    private confirmationService: ConfirmationService,
    private geographyService: GeographyService
  ) {}

  ngOnInit(): void {
    this.getGeographies();
  }

  openDialog(empty: boolean, geography?: Geography): void {
    this.modify = true;
    this.submitted = false;

    if(!empty && geography) {
      this.selectedGeography = geography;
      this.dialogTitle = "Edit Geography";
    } else {
      this.selectedGeography = this.emptyGeography; // Reset input
      this.dialogTitle = "Create new Geography";
    }
  }

  hideDialog(): void {
    this.modify = false;
    this.submitted = false;
    this.selectedGeography = this.emptyGeography; // Reset input
  }

  getGeographies(): void {
    this.geographyService.getGeography()
      .subscribe((data: Geography[]) => { // Subscribe will actually launch the request
        this.geographyList = data;
      });
  }

  editGeography(geography: Geography): void {
    this.submitted = true;

    console.log(geography);

    if(geography.name.trim()) {

      this.modify = false; // Le dialog écoute le changement d'attribut et se fermera

      if(geography._id !== "0") {
        this.geographyService.editGeography(geography)
          .subscribe( (status: number) => {
            if(status === 200) {
              // Update data property
              this.geographyList[this.findIndexFromId(geography._id)].name = geography.name;
              this.selectedGeography = this.emptyGeography; // Reset input
            }
          })
      } else {
        this.geographyService.addGeography(geography.name.trim())
          .subscribe( (data: Geography) => { // Assignation
            geography._id = data._id;
            geography.name = data.name
          })

        // Update data property
        this.geographyList.push(geography);
        this.selectedGeography = this.emptyGeography; // Reset input
      }
    }
  }

  deleteGeography(geography: Geography): void {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete the geography ' + geography.name + '?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.geographyService.deleteGeography(geography)
          .subscribe( (status: number) => {
            if(status === 200) {
              // Update data property
              this.geographyList.splice(this.findIndexFromId(geography._id), 1);
            }
          })
        //TODO alert message
        console.log(geography);
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
