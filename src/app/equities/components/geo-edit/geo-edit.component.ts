import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GeographyExposition } from 'src/app/common/models/geography';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

/**
 * Composant pour l'édition de la répartition géographique d'une équité.
 *
 * - Récupère la répartition actuelle en input.
 * - Récupère la liste des géographies en base et ajoute l'exposure si trouvée dans la répartition actuelle de l'équité,
 *   pour être à jour (ajout à 0 pour une géographie nouvellement ajoutée).
 * - Emet le résultat de la form en output.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-geo-edit',
  templateUrl: './geo-edit.component.html',
  styleUrls: ['./geo-edit.component.scss']
})
export class GeoEditComponent implements OnInit {

  submitted: boolean = false;

  form: FormGroup = new FormGroup({});

  @Input() repartition: GeographyExposition[] | null = [];
  @Output() repartitionChange = new EventEmitter<GeographyExposition[]>();

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setForm();
  }

  // Getter to shorten the syntax.
  get f() { return this.form.controls['repartitionArray'] }

  get array() { return (this.form.get('repartitionArray') as FormArray).controls }

  setForm(): void {
    const repArray: FormArray = this.fb.array([]);

    if(this.repartition && this.repartition.length > 0) {
      this.repartition.forEach(rep => {
        repArray.push(this.fb.group({
          _id: /*rep.geography._id,*/ 0,
          name: "",
          exposure: rep.exposure // no validators as input mask validates format
        }))
      })
    }
    this.form = this.fb.group({
      repartitionArray: repArray
    });
  }

  // Renvoi au parent pour mise à jour.
  onSubmit(): void {
    this.submitted = true;

    if(this.form.valid) {
      this.repartitionChange.emit(this.f.value);
    }
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [GeoEditComponent],
  exports: [GeoEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputMaskModule,
    ButtonModule
  ],
})
export class GeoEditModule {}
