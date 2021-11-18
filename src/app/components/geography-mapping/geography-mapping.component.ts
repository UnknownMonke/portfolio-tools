import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Geography } from 'src/app/models/geography';
import { GeographyService } from 'src/app/services/geography.service';


/** Mapping via template-driven form (ngModel): la propriété est directement modifiée à chaque itération */
@Component({
  selector: 'app-geography-mapping',
  templateUrl: './geography-mapping.component.html',
  styleUrls: ['./geography-mapping.component.scss']
})
export class GeographyMappingComponent implements OnInit {

  emptyGeography: Geography = {
    id: "0",
    name: ""
  };

  modify: boolean = false;
  submitted: boolean = false; //form validation

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

  openDialog(geography?: Geography): void {
    this.modify = true;
    this.submitted = false;

    if(geography) {
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
  }

  getGeographies(): void {
    this.geographyService.getGeography()
      .subscribe((data: Geography[]) => { // Ssubscribe will actually launch the request
        this.geographyList = data;
      });
  }

  editGeography(geography: Geography): void {
    this.submitted = true;

    if(geography.name.trim()) {

      this.modify = false; //le dialog écoute le changement d'attribut et se fermera

      if(geography.id !== "0") {
        this.geographyService.editGeography(geography);

        //update data property
        this.geographyList[this.findById(geography.id)].name = geography.name;
      } else {
        this.geographyService.addGeography(geography.name.trim());
        //update data property
        this.geographyList.push(geography);
      }
    }
  }

  deleteGeography(geography: Geography): void {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete the geography ' + geography.name + '?',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.geographyService.deleteGeography(geography);
        //TODO alert message
        console.log(geography);

        //update data property
        this.geographyList = this.geographyList.splice(this.findById(geography.id), 1);
      }
    });
  }

  findById(id: string): number {
    const idList = this.geographyList.map(geography => geography.id);
    return idList.indexOf(
      idList.filter(curr_id => curr_id = id)[0]
    );
  }
}
