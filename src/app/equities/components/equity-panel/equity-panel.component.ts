import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { Equity } from '../../../common/models/equity';

/**
 * Persentational component to display details about the selected Equity,
 * inside a PrimeNG Panel component.
 *
 * ---
 *
 * Only displays static infos.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-equity-panel',
  templateUrl: './equity-panel.component.html',
  styleUrls: ['./equity-panel.component.scss']
})
export class EquityPanelComponent {

  @Input() equity?: Equity;
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [EquityPanelComponent],
  exports: [EquityPanelComponent],
  imports: [
    CommonModule,
    PanelModule
  ],
})
export class EquityPanelModule {}
