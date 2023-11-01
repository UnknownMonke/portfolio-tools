import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ChipModule } from 'src/app/common/components/chip/chip.component';
import { environment } from 'src/environments/environment';

/**
 * Presentational component to hold a footer tag containing current app version.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  currentVersion = environment.VERSION; //TODO dynamic version
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [FooterComponent],
  exports: [FooterComponent],
  imports: [ChipModule]
})
export class FooterModule {}
