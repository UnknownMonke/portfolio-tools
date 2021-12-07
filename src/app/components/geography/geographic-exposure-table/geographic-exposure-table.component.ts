import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-geographic-exposure-table',
  templateUrl: './geographic-exposure-table.component.html',
  styleUrls: ['./geographic-exposure-table.component.scss']
})
export class GeographicExposureTableComponent implements OnInit {

  @Input() geographicData: any[] = [];
  @Input() geographicTotal: any = {};
  @Input() regionMap: any[] = [];

  geographicColumns: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.geographicColumns = [
      {field: 'name', header: 'Name'},
      {field: 'value', header: 'Amount'}
    ];
    this.regionMap.forEach(region => this.geographicColumns.push(region));
  }
}
