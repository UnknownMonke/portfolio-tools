// Core
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from "primeng/button";
import { TableModule } from 'primeng/table';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SidebarModule } from 'primeng/sidebar';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { GeographicExposureComponent } from './components/geography/geographic-exposure/geographic-exposure.component';
import { GeographicExposureTableComponent } from './components/geography/geographic-exposure-table/geographic-exposure-table.component';
import { GeographyMappingComponent } from './components/geography/geography-mapping/geography-mapping.component';
import { SectorExposureComponent } from './components/sector/sector-exposure/sector-exposure.component';
import { SectorExposureTableComponent } from './components/sector/sector-exposure-table/sector-exposure-table.component';
import { SectorMappingComponent } from './components/sector/sector-mapping/sector-mapping.component';
import { ExposureGraphComponent } from './components/graphs/exposure-graph/exposure-graph.component';
import { EquityDetailComponent } from './components/equity/equity-detail/equity-detail.component';
import { GeographyEditComponent } from './components/equity/geography-edit/geography-edit.component';
import { SectorEditComponent } from './components/equity/sector-edit/sector-edit.component';

// Directives
import { LastPageDirective } from './directives/last-page.directive';
import { NextPageDirective } from './directives/next-page.directive';

// Pipes
import { ColumnFilterPipe } from './pipes/column-filter.pipe';

// Services
import { GlobalErrorHandler } from './services/handling/error/error-handler.service';
import { HttpLoadingInterceptor } from './services/handling/interceptor/http-loading-interceptor.service';

// Others
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  // Import des composants de l'application
  declarations: [
    LastPageDirective,
    NextPageDirective,
    ColumnFilterPipe,
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    PortfolioComponent,
    GeographicExposureComponent,
    GeographicExposureTableComponent,
    GeographyMappingComponent,
    SectorExposureComponent,
    SectorExposureTableComponent,
    SectorMappingComponent,
    EquityDetailComponent,
    GeographyEditComponent,
    SectorEditComponent,
    ExposureGraphComponent
  ],
  // Import des composants source
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RippleModule,
    ButtonModule,
    TableModule,
    MenuModule,
    TooltipModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    TreeTableModule,
    ChipModule,
    PanelModule,
    TabViewModule,
    InputNumberModule,
    ToastModule,
    ProgressSpinnerModule,
    DividerModule,
    InputSwitchModule,
    SidebarModule,
    HighchartsChartModule
  ],
  // Import des services source
  providers: [
    ConfirmationService,
    MessageService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true }
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
