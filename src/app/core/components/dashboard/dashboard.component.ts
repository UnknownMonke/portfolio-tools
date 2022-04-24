import { Component, OnInit } from '@angular/core';

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
export class DashboardComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
