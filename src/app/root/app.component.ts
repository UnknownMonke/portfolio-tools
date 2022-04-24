import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

/**
 * Root component for the Angular Application.
 *
 * ---
 *
 * Links to all other components via the navigation router,
 * exept the header and footer, which are directly injected.
 *
 * Also injects the toast for alert, info and error messages popups.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    // Required to activate the ripple effect on buttons.
    this.primengConfig.ripple = true;
  }
}
