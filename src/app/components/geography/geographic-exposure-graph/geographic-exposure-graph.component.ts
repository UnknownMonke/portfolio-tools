import { Component, Input, OnInit } from '@angular/core';
import Constants from 'src/app/common/constants/constants';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-geographic-graph',
  templateUrl: './geographic-graph.component.html',
  styleUrls: ['./geographic-graph.component.scss']
})
export class GeographicGraphComponent implements OnInit {

  @Input() graphData: any = {};
  @Input() regionMap: any[] = [];

  data: any;
  chartOptions: any;
  plugins: any;

  constructor() {}

  ngOnInit(): void {
    //regions et valeurs dans le même ordre normalement
    this.data = {
      labels: this.regionMap.map(region => region.header),
      datasets: [
        {
          data: Object.values(this.graphData.geography),
          backgroundColor: Constants.geographicRegionColorMapping.map(region => region.color),
          hoverBackgroundColor: Constants.geographicRegionColorMapping.map(region => region.hover)
        }
      ]
    };
    this.chartOptions = {
      plugins: {
        datalabels: {
          display: function(context: any) {
            console.log(context);
            return context !== 0;
          }
        }
      },
      title: {
        display: true,
        text: 'My Title',
        fontSize: 16
      },
      legend: {
          position: 'bottom'
      }
    };
  }
}
