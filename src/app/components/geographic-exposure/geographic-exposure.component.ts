import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-geographic-exposure',
  templateUrl: './geographic-exposure.component.html',
  styleUrls: ['./geographic-exposure.component.scss']
})
export class GeographicExposureComponent implements OnInit {

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
