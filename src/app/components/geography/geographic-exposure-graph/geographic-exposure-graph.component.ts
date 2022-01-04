import { Component, Input, OnInit } from '@angular/core';
import * as HighCharts from 'highcharts';

//TODO random color generator
@Component({
  selector: 'app-geographic-exposure-graph',
  templateUrl: './geographic-exposure-graph.component.html',
  styleUrls: ['./geographic-exposure-graph.component.scss']
})
export class GeographicExposureGraphComponent implements OnInit {

  @Input() graphData: any = {};

  Highcharts: typeof HighCharts = HighCharts;
  chartOptions: HighCharts.Options = {};

  constructor() {}

  ngOnInit(): void {

    const seriesData: any[] = Array.from(this.graphData.entries())
      .map( (element: any) => {
        return {
          name: element[0],
          y: this.convertData(element[1])
        }
      });

    // Chart configuration
    this.chartOptions = {
      chart: {
        plotShadow: false,
        type: 'pie',
        height: 400,
        width: 600
      },
      title: {
        text: undefined
      },
      tooltip: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      pane: {
        size: '100%',
        innerSize: '90%'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '12px'
            },
            formatter: function() { // N'affiche que  les données supérieures à 0
              if(this.point.y && this.point.y > 0) {
                return '<b>' + this.point.name + '</b>: ' + this.point.y + '%';
              } else {
                return null;
              }
            }
          }
        },
        series: {
          enableMouseTracking: false // Disable hover and point select
        }
      },
      series: [{
        type: 'pie',
        data: seriesData
      }]
    };
  }

  // Retourne un pourcentage depuis le float.
  // toFixed retourne une string à x décimales qui doit être reconvertie en number
  private convertData(data: number): number {
    return Number((data*100).toFixed(2));
  }
}
