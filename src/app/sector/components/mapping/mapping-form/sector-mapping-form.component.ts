import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sector-mapping-form',
  templateUrl: './sector-mapping-form.component.html',
  styleUrls: ['./sector-mapping-form.component.scss']
})
export class SectorMappingFormComponent implements OnInit {

  submitted: boolean = false;

  form: FormGroup = new FormGroup({});

  @Input()
  selectedName: string | null = '';

  @Output()
  showChange = new EventEmitter<boolean>();

  @Output()
  formSubmit = new EventEmitter<string>();
  // no need for ngsubmit, submit button linked to form ,etc
  // using simple form control witohut form group will reload page (the base form is submitted outside angular)

  constructor(
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Creates the form.
    this.form = this._fb.group({
      name: [this.selectedName, [Validators.required, Validators.pattern('[A-Za-z ]*')]]
    });
  }

  // Getter to shorten the syntax.
  get f() { return this.form.controls }

  onSubmit() {
    this.submitted = true;

    if(this.form.valid) {
      this.formSubmit.emit(this.f['name'].value);
    }
  }

  hideModal() {
    this.showChange.emit(false);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [SectorMappingFormComponent],
  exports: [SectorMappingFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ]
})
export class SectorMappingFormModule {}
