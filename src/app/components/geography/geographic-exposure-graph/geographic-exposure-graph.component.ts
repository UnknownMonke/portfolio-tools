import { Component, Input, OnInit } from '@angular/core';
import Constants from 'src/app/common/constants/constants';
import ChartDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-geographic-exposure-graph',
  templateUrl: './geographic-exposure-graph.component.html',
  styleUrls: ['./geographic-exposure-graph.component.scss']
})
export class GeographicExposureGraphComponent implements OnInit {

  @Input() graphData: any = {};
  @Input() regionMap: any[] = [];

  data: any;
  chartOptions: any;
  plugins: any;

  constructor() {}

  ngOnInit(): void {
    console.log(this.graphData);
    console.log(this.regionMap);

    // Régions et valeurs dans le même ordre normalement
    this.data = {
      labels: this.regionMap.map(region => region.header),
      datasets: [
        {
          data: [0, 5.28, 22, 0, 0, 0, 17.6],
          //data: Object.values<number>(this.graphData).map(val => Math.round(val*100))
          backgroundColor: GeographicExposureGraphComponent.geographicRegionColorMapping.map(region => region.color),
          hoverBackgroundColor: GeographicExposureGraphComponent.geographicRegionColorMapping.map(region => region.hover)
        }
      ]
    };
    /*this.chartOptions = {
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
    };*/
  }

  static geographicRegionColorMapping = [
    { name: "USA", color: "#eb5210", hover: "#fa753c" },
    { name: "CANADA", color: "#0f6b0c", hover: "#15b510" },
    { name: "EUWest", color: "#6da0f2", hover: "#aec9f5" },
    { name: "Nordic", color: "#eb463d", hover: "#f0bebb" },
    { name: "EUEast", color: "#eda55c", hover: "#f0caa3" },
    { name: "Japan", color: "#f79e9e", hover: "#f5baba" },
    { name: "China", color: "#fa1b1b", hover: "#ed5555" },
  ];
}
