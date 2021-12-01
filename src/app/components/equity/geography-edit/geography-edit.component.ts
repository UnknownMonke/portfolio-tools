import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GeographyExposition } from 'src/app/models/geographyExposition';
import { GeographyService } from 'src/app/services/geography/geography.service';
import { Geography } from 'src/app/models/geography';

@Component({
  selector: 'app-geography-edit',
  templateUrl: './geography-edit.component.html',
  styleUrls: ['./geography-edit.component.scss']
})
export class GeographyEditComponent implements OnInit {

  defaultGeographies: GeographyExposition[] = [];

  repartitionForm = this.fb.array([]);
  formGroup = this.fb.group({
    repartitions: this.repartitionForm
  });

  @Input() geographicRepartition: GeographyExposition[] = []; // undefined au chargement, loadé en async
  @Output() geographicRepartitionChange = new EventEmitter<any>();


  constructor(
    private geographyService: GeographyService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fillExposition();
  }

  // Rempli la liste des géographies avec les valeurs mappées en base et non les valeurs concaténées des equités
  fillExposition(): void {
    this.geographyService.getGeographies()
      .subscribe( (data: Geography[]) => {

        if(data.length > 0) {

          this.defaultGeographies = data
            .map(geography => {
              return {
                geography: geography,
                exposure: 0
              };
            });

          // Edite la liste des repartitions avec les valeurs trouvées dans les équités
          if(this.geographicRepartition.length > 0) {

            this.geographicRepartition.forEach(repartition => {
              const correspondingExpoMap = this.defaultGeographies
                .filter(expo => expo.geography._id === repartition.geography._id);

              if(correspondingExpoMap.length > 0) {
                repartition.exposure = correspondingExpoMap[0].exposure;
              }
            });
          } else {
            this.geographicRepartition = this.defaultGeographies;
          }
          // Pass the entire object as formControl to retreive it already updated when submitted
          for(let i = 0; i < this.geographicRepartition.length; i++) {
            this.repartitionForm.push(this.fb.group(this.geographicRepartition[i]));
          }

        } else {
          //TODO error message
        }
      });
  }

  // Renvoi au parent pour mise à jour
  submitRepartition(): void {
    this.geographicRepartitionChange.emit(this.repartitionForm.value);
  }
}
