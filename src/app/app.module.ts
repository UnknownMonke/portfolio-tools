// Core
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from "primeng/button";
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TreeTableModule } from 'primeng/treetable';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { GeographicExposureComponent } from './components/geography/geographic-exposure/geographic-exposure.component';
import { GeographicExposureTableComponent } from './components/geography/geographic-exposure-table/geographic-exposure-table.component';
import { GeographicExposureGraphComponent } from './components/geography/geographic-exposure-graph/geographic-exposure-graph.component';
import { GeographyMappingComponent } from './components/geography/geography-mapping/geography-mapping.component';
import { SectorMappingComponent } from './components/sector/sector-mapping/sector-mapping.component';
import { SectorExposureComponent } from './components/sector/sector-exposure/sector-exposure.component';
import { SectorGraphComponent } from './components/sector/sector-graph/sector-graph.component';
import { SectorComponent } from './components/sector/sector-wrapper/sector.component';
import { EquityDetailComponent } from './components/equity/equity-detail/equity-detail.component';
import { GeographyEditComponent } from './components/equity/geography-edit/geography-edit.component';
import { SectorEditComponent } from './components/equity/sector-edit/sector-edit.component';

// Directives
import { LastPageDirective } from './directives/last-page.directive';
import { NextPageDirective } from './directives/next-page.directive';


@NgModule({
  // Import des composants de l'application
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    PortfolioComponent,
    LastPageDirective,
    GeographicExposureComponent,
    GeographicExposureTableComponent,
    GeographicExposureGraphComponent,
    SectorMappingComponent,
    SectorExposureComponent,
    SectorGraphComponent,
    SectorComponent,
    EquityDetailComponent,
    GeographyMappingComponent,
    GeographyEditComponent,
    NextPageDirective,
    SectorEditComponent
  ],
  // Import des composants source
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    ChartModule,
    MenuModule,
    TooltipModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    TreeTableModule,
    ChipModule,
    PanelModule,
    TabViewModule,
    InputNumberModule
  ],
  // Import des services source
  providers: [
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.

// HttpClientInMemoryWebApiModule.forRoot(
//   InMemoryDataService, { dataEncapsulation: false }
// )
