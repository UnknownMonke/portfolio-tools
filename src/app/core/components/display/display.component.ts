import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastModule } from 'primeng/toast';
import { FooterModule } from "../footer/footer.component";
import { HeaderModule } from "../header/header.component";

/**
 * Standalone component to hold the app display structure.
 *
 * ---
 *
 * Holds a content container, a fixed footer and a fixed header.
 * One display is instantiated throughout the whole application.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent  {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [DisplayComponent],
  exports: [DisplayComponent],
  imports: [
    RouterModule,
    ToastModule,
    FooterModule,
    HeaderModule
  ]
})
export class DisplayModule {}
