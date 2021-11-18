// Core
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { GeographicExposureComponent } from './components/geographic-exposure/geographic-exposure.component';
import { LastPageDirective } from './directives/last-page.directive';
import { GeographicGraphComponent } from './components/geographic-graph/geographic-graph.component';
import { GeographyComponent } from './components/geography/geography.component';
import { SectorMappingComponent } from './components/sector-mapping/sector-mapping.component';
import { SectorExposureComponent } from './components/sector-exposure/sector-exposure.component';
import { SectorGraphComponent } from './components/sector-graph/sector-graph.component';
import { SectorComponent } from './components/sector/sector.component';
import { EquityDetailComponent } from './components/equity-detail/equity-detail.component';

// Services
import { GeographyMappingComponent } from './components/geography-mapping/geography-mapping.component';

@NgModule({
  // Import des composants de l'application
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    PortfolioComponent,
    GeographicExposureComponent,
    LastPageDirective,
    GeographicGraphComponent,
    GeographyComponent,
    SectorMappingComponent,
    SectorExposureComponent,
    SectorGraphComponent,
    SectorComponent,
    EquityDetailComponent,
    GeographyMappingComponent
  ],
  // Import des composants source
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    TableModule,
    ChartModule,
    MenuModule,
    TooltipModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  // Import des services source
  providers: [
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.

// HttpClientInMemoryWebApiModule.forRoot(
//   InMemoryDataService, { dataEncapsulation: false }
// )
