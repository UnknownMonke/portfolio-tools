import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GeographyExposition } from 'src/app/geography/model/geography';
import { GeographyService } from 'src/app/geography/service/geography.service';
import { Geography } from 'src/app/geography/model/geography';

/**
 * Composant pour l'édition de la répartition géographique d'une équité.
 *
 * - Récupère la répartition actuelle en input.
 * - Récupère la liste des géographies en base et ajoute l'exposure si trouvée dans la répartition actuelle de l'équité,
 *   pour être à jour (ajout à 0 pour une géographie nouvellement ajoutée).
 * - Emet le résultat de la form en output.
 */
@Component({
  selector: 'app-geography-edit',
  templateUrl: './geography-edit.component.html',
  styleUrls: ['./geography-edit.component.scss']
})
export class GeographyEditComponent implements OnInit {

  repartitionForm: FormArray = this.fb.array([]);
  formGroup: FormGroup = this.fb.group({
    repartitions: this.repartitionForm
  });

  @Input() geographicRepartition: GeographyExposition[] = []; // undefined au chargement, loadé en async.
  @Output() geographicRepartitionChange = new EventEmitter<any>(); //TODO utiliser valueChange : observable, dans le register
  // TODO utiliser dirty, touched pour le controle des messages d'erreurs dans les forms : faire un composant erreur des forms

  constructor(
    private geographyService: GeographyService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fillExposition();
  }

  // Rempli la liste des géographies avec les valeurs mappées en base et non les valeurs concaténées des equités.
  fillExposition(): void {
    this.geographyService.get()
      .subscribe( (data: Geography[]) => {

        if(data.length > 0) {

          const defaultGeographies = data
            .map(geography => {
              return {
                geography: geography,
                exposure: 0
              };
            });

          // Edite la liste des repartitions avec les valeurs trouvées dans les équités.
          if(this.geographicRepartition.length > 0) {

            defaultGeographies.forEach(repartition => {
              const correspondingExpoMap = this.geographicRepartition
                .filter(expo => expo.geography._id === repartition.geography._id);

              if(correspondingExpoMap.length > 0) {
                repartition.exposure = correspondingExpoMap[0].exposure;
              }
            });
          }
          this.geographicRepartition = defaultGeographies;

          // Passe l'objet entier en tant que formControl pour le renvoyer simplement lors de l'émission.
          for(let i = 0; i < this.geographicRepartition.length; i++) {
            this.repartitionForm.push(this.fb.group(this.geographicRepartition[i]));
          }

        } else {
          //TODO error message
        }
      });
  }

  // Renvoi au parent pour mise à jour.
  submitRepartition(): void {
    this.geographicRepartitionChange.emit(this.repartitionForm.value);
  }
}
