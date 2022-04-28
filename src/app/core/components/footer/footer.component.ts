import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { environment } from 'src/environments/environment';

/**
 * Footer tag containing current app version.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
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
