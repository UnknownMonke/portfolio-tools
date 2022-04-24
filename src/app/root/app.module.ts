// Core.
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG.
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from "primeng/button";
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TreeTableModule } from 'primeng/treetable';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { PasswordModule } from 'primeng/password';

// Components.
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from '../core/components/dashboard/dashboard.component';
import { HeaderComponent } from '../core/components/header/header.component';
import { FooterComponent } from '../core/components/footer/footer.component';
import { PortfolioComponent } from '../portfolio/component/portfolio.component';
import { GeographicExposureComponent } from '../geography/components/geographic-exposure/geographic-exposure.component';
import { GeographicExposureTableComponent } from '../geography/components/geographic-exposure-table/geographic-exposure-table.component';
import { GeographyMappingComponent } from '../geography/components/geography-mapping/geography-mapping.component';
import { SectorExposureComponent } from '../sector/components/sector-exposure/sector-exposure.component';
import { SectorExposureTableComponent } from '../sector/components/sector-exposure-table/sector-exposure-table.component';
import { SectorMappingComponent } from '../sector/components/sector-mapping/sector-mapping.component';
import { ExposureGraphComponent } from '../graphs/components/exposure-graph/exposure-graph.component';
import { EquityDetailComponent } from '../equity/components/equity-detail/equity-detail.component';
import { GeographyEditComponent } from '../equity/components/geography-edit/geography-edit.component';
import { SectorEditComponent } from '../equity/components/sector-edit/sector-edit.component';
import { LoginComponent } from '../auth/components/login/login.component';
import { PageNotFoundComponent } from '../handling/components/page-not-found/page-not-found.component';

// Directives.
import { LastPageDirective } from '../core/directives/last-page.directive';
import { NextPageDirective } from '../core/directives/next-page.directive';

// Services.
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { GlobalErrorHandler } from '../handling/services/error/error-handler.service';
import { HttpCustomInterceptor } from '../handling/services/interceptor/http-custom-interceptor.service';

// Others.
import { HighchartsChartModule } from 'highcharts-angular';
import { MappingModalComponent } from '../mapping/mapping-modal/mapping-modal.component';

/**
 * Root module of the Angular Application.
 *
 * ---
 *
 * Constructs everything from here.
 *
 * '@NgModule' takes a metadata object that describes how to compile a component template and how to create an injector at runtime.
 * It identifies the module own components, directives, and pipes, making some of them public, through the exports property, so that external components can use them.
 *
 * '@NgModule' can also add service providers to the application dependency injectors.
 */
@NgModule({
  // Declares application components (only components, directives and pipes).
  declarations: [
    LastPageDirective,
    NextPageDirective,
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
    ExposureGraphComponent,
    LoginComponent,
    PageNotFoundComponent,
    MappingModalComponent
  ],
  // Imports external components (Angular/ PrimeNG).
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
    TieredMenuModule,
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
    CardModule,
    AvatarModule,
    PasswordModule,
    HighchartsChartModule
  ],
  // Imports services.
  providers: [
    ConfirmationService,
    MessageService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpCustomInterceptor, multi: true }
  ],
  // Defines components that are directly bootstrapped into the main HTML file (usually contains only the root component).
  bootstrap: [AppComponent]
})
export class AppModule {}

/**
 * The HttpClientInMemoryWebApiModule module intercepts HTTP requests and returns simulated server responses.
 * Remove it when a real server is ready to receive requests.
 */
// HttpClientInMemoryWebApiModule.forRoot(
//   InMemoryDataService, { dataEncapsulation: false }
// )
