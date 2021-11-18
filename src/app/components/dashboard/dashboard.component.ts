import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  items: MenuItem[] = [];

  constructor() {}

  ngOnInit(): void {
    // Menu de management
    this.items = [
      {
        label: 'Edit Geographies',
        routerLink: ['/geography/edit']
      },
      {
        label: 'Edit Sectors',
        routerLink: ['/sector/edit']
      }
    ]
  }
}
