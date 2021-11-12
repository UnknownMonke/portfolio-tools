import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ButtonModule } from "primeng/button";
import {TableModule} from 'primeng/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { GeographicExposureComponent } from './components/geographic-exposure/geographic-exposure.component';
import { LastPageDirective } from './directives/last-page.directive';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    PortfolioComponent,
    GeographicExposureComponent,
    LastPageDirective
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    TableModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

