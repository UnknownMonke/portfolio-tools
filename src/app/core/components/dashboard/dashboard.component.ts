import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'src/app/common/components/button/button.component';

/**
 * Home component.
 *
 * ---
 *
 * For now, contains a single button that redirects to the portfolio via a router link.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
  imports: [
    RouterModule,
    ButtonModule
  ]
})
export class DashboardModule {}
