import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'src/app/common/components/button/button.component';
import { GeographyExposure } from 'src/app/common/models/geography';
import { EquityService } from '../../services/equity.service';

/**
 * Presentational component to handle the equity geographic exposure edition.
 *
 * ---
 *
 * Receives an array of existing exposures for all current geographies, or 0 if none is set.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-geo-edit',
  templateUrl: './geo-edit.component.html',
  styleUrls: ['./geo-edit.component.scss']
})
export class GeoEditComponent implements OnInit {

  submitted = false;

  form: FormGroup = new FormGroup({});

  // Added geography name mapped from the Geography table.
  @Input() mappedExposure: { geoExposure: GeographyExposure, name: string }[] = [];

  constructor(
    private _fb: FormBuilder,
    private _equityService: EquityService
  ) {}

  ngOnInit(): void {
    console.log(this.mappedExposure)
    this.setForm();
  }

  // Getter to shorten the syntax.
  get f() { return this.form.controls['exposureArray'] }

  get array() { return (this.form.get('exposureArray') as FormArray).controls }

  /** Fills array then pushes it into the form group. */
  setForm(): void {
    const exposureArray: FormArray = this._fb.array([]);

    if(this.mappedExposure && this.mappedExposure.length > 0) {

      this.mappedExposure.forEach(mapped => {

        exposureArray.push(
          this._fb.group({
            _id: mapped.geoExposure.geographyId,
            name: mapped.name,
            exposure: mapped.geoExposure.exposure // No validators as input mask validates format.
          })
        )
      })
    }
    this.form = this._fb.group({ exposureArray });
  }

  onSubmit(): void {
    this.submitted = true;

    if(this.form.valid) {
      this._equityService.exposureSubmit(this.f.value, 'geo');
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
