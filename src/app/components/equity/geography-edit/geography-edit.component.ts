import { Component, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Equity } from 'src/app/models/equity';
import { GeographyExposition } from 'src/app/models/geographyExposition';
import { GeographyService } from 'src/app/services/geography/geography.service';
import { Geography } from 'src/app/models/geography';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-geography-edit',
  templateUrl: './geography-edit.component.html',
  styleUrls: ['./geography-edit.component.scss']
})
export class GeographyEditComponent implements OnInit {

  geographicExpositions: GeographyExposition[] = [];
  geographyNameList: string[] = [];

  expositionForm = new FormArray([]);
  formGroup = new FormGroup({
    expositions: this.expositionForm
  });

  @Input() equity!: Equity; // undefined au chargement, loadé en async
  //@Output() equityEvent = new EventEmitter();

  constructor(
    private geographyService: GeographyService
  ) {}

  ngOnInit(): void {
    this.fillExposition();
  }

  // Rempli la liste des géographies avec les valeurs mappées en base et non les valeurs concaténées des equités
  fillExposition(): void {
    this.geographyService.getGeographies()
      .subscribe( (data: Geography[]) => {
        this.geographicExpositions = data
          .map(geography => {
            return {
              geography: geography,
              exposure: 0
            };
          });

        // Edite la liste des expositions avec les valeurs trouvées dans les équités
        if(this.equity.geography.length > 0) {

          this.geographicExpositions.forEach(exposition => {
            const correspondingExpoMap = this.equity.geography
              .filter(expo => expo.geography._id === exposition.geography._id);

            if(correspondingExpoMap.length > 0) {
              exposition.exposure = correspondingExpoMap[0].exposure;
            }
          });
        }
        // Rempli la form
        for(let i = 0; i < this.geographicExpositions.length; i++) {
          this.geographyNameList.push(this.geographicExpositions[i].geography.name);
          this.expositionForm.push(new FormControl(this.geographicExpositions[i].exposure));
        }
      });
  }

  // Met à jour l'exposition de l'équité avec les nouvelles expositions, et écrase celles qui n'était pas dans les géographies chargées
  submitExposition(): void {
    console.log(this.expositionForm.value);
  }
}
