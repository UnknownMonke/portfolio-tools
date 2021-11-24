import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeographyComponent } from './components/geography/geography-wrapper/geography.component';
import { GeographyMappingComponent } from './components/geography/geography-mapping/geography-mapping.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { EquityDetailComponent } from './components/equity-detail/equity-detail.component';
import { SectorMappingComponent } from './components/sector/sector-mapping/sector-mapping.component';


//navigation interne via l'API, un composant par point d'entrée
//TODO localisation
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Portfolio Visualization Tools'
    }
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    data: {
      title: 'Portfolio'
    }
  },
  {
    path: 'equity/:id',
    component: EquityDetailComponent,
    data: {
      title: 'Detail'
    }
  },
  {
    path: 'geography',
    component: GeographyComponent,
    data: {
      title: 'Geographic Exposure'
    }
  },
  {
    path: 'edit/geography',
    component: GeographyMappingComponent,
    data: {
      title: 'Geographic Mapping'
    }
  },
  {
    path: 'edit/sector',
    component: SectorMappingComponent,
    data: {
      title: 'Sector Mapping'
    }
  },
  {
    path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
