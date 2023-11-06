import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Input, NgModule, TemplateRef } from '@angular/core';
import { ProgressSpinnerModule } from 'src/app/common/components/progress-spinner/progress-spinner.component';

/**
 * Presentational component to display a PrimeNG datatable inside a wrapper.
 *
 * ---
 *
 * Offers a common structure for the tables loading strategy.
 *
 * Actions :
 *
 * - Displays the loading spinner if the data is not yet received from the parent component (async subscription).
 * - Displays an empty icon if empty data.
 * - Passes the data array to the table component via a TemplateRef.
 *
 * The template holds the data and can be accessed from the parent component via the ngTemplateOutlet directive.
 * It instantiates a template dynamically using a template reference and context object as parameters.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> {

  @Input() data: T[] = [];

  @ContentChild(TemplateRef) tableTemplate!: TemplateRef<T>;
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [TableComponent],
  exports: [TableComponent],
  imports: [
    CommonModule,
    ProgressSpinnerModule
  ]
})
export class TableModule {}
