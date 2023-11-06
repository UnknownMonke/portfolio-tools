import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "../../../common/components/button/button.component";
import { EditionService } from "../../services/edition.service";

/**
 * Presentational component to handle the edition form for Geographies & Sector edition.
 *
 * ---
 *
 * Holds the form and passes the submit to the service.
 *
 * Fields :
 *
 * - The name of the Geography or Sector to edit.
 *
 * ---
 *
 * A new component is instantiated each time the modal is opened.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edition-form',
  templateUrl: './edition-form.component.html',
  styleUrls: ['./edition-form.component.scss']
})
export class EditionFormComponent {

  submitted = false;

  form: FormGroup = new FormGroup({});

  @Input() selectedName: string = '';

  constructor(
    private _fb: FormBuilder,
    private _editionService: EditionService
  ) {}

  ngOnInit(): void {
    // Creates the form.
    this.form = this._fb.group({ // Using simple form control without a formGroup will reload page (the base form is submitted outside Angular).
      name: [this.selectedName, [Validators.required, Validators.pattern('[A-Za-z ]*')]]
    });
  }

  // Getter to shorten the syntax.
  get f() { return this.form.controls }

  onSubmit() {
    this.submitted = true;

    if(this.form.valid) {
      this._editionService.submit(this.f['name'].value);
    }
  }

  hideModal() {
    this._editionService.show(false);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [EditionFormComponent],
  exports: [EditionFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class EditionFormModule {}
