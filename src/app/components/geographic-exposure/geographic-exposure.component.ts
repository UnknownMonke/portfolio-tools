import { Component, OnInit } from '@angular/core';
import { Geographies } from 'src/app/dto/geographies';
import { GEOGRAPHY } from 'src/app/dto/mock-geography';

@Component({
  selector: 'app-geographic-exposure',
  templateUrl: './geographic-exposure.component.html',
  styleUrls: ['./geographic-exposure.component.scss']
})
export class GeographicExposureComponent implements OnInit {

  geographicData: any[] = [];
  geographicColumns: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.geographicData = this.loadGeography();
    
    console.log(this.geographicData);

    this.geographicColumns = [
      { field: 'name', header: 'Name'},
      { field: 'usa', header: 'USA'},
      { field: 'can', header: 'Canada'},
      { field: 'euw', header: 'EU West'},
      { field: 'nor', header: 'Nordic'},
      { field: 'eue', header: 'EU East'},
      { field: 'jap', header: 'Japan'},
      { field: 'chi', header: 'China'}
    ]
  }

  loadGeography(): any[] {
    return GEOGRAPHY;
  }

}
