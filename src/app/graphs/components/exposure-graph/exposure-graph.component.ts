import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NgModule, OnInit } from '@angular/core';
import * as HighCharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

/**
 * Composant graphique pour l'affichage des répartitions par secteur / géographie.
 *
 * - Récupère les expositions totals par secteur / géographie depuis le parent.
 * - Utilise Highcharts via la librairie highcharts-angular.
 */
@Component({
  selector: 'app-exposure-graph',
  templateUrl: './exposure-graph.component.html',
  styleUrls: ['./exposure-graph.component.scss']
})
export class ExposureGraphComponent implements OnInit {

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

    // Chart configuration.
    //TODO random color generator for series
    this.chartOptions = {
      chart: {
        plotShadow: false,
        type: 'pie',
        height: 400,
        width: 600,
        backgroundColor: 'var(--body)'
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
          borderColor: 'var(--body)',
          borderWidth: 2,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
              textOutline: 'none' // Bordure des arcs de cercle.

            },
            color: 'var(--surface-900)',
            formatter: function() { // N'affiche que les données supérieures à 0.
              if(this.point.y && this.point.y > 0) {
                return '<b>' + this.point.name + '</b>: ' + this.point.y + '%';
              } else {
                return null;
              }
            }
          }
        },
        series: {
          enableMouseTracking: false // Disable hover and point select.
        }
      },
      series: [{
        type: 'pie',
        data: seriesData
      }]
    };
  }

  // Retourne un pourcentage depuis le float, toFixed retourne une string à x décimales qui doit être reconvertie en number.
  private convertData(data: number): number {
    return Number((data*100).toFixed(2));
  }
}

@NgModule({
  declarations: [ExposureGraphComponent],
  exports: [ExposureGraphComponent],
  imports: [HighchartsChartModule]
})
export class ExposureGraphModule {}
