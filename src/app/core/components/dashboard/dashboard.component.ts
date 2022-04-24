import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

/**
 * Home component.
 *
 * ---
 *
 * For now, contains a single button that redirects to the portfolio via a router link.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {}

@NgModule({
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
  imports: [
    RouterModule,
    ButtonModule
  ],
})
export class DashboardModule {}
