import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeographicExposureComponent } from './components/geography/geographic-exposure/geographic-exposure.component';
import { GeographyMappingComponent } from './components/geography/geography-mapping/geography-mapping.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { EquityDetailComponent } from './components/equity/equity-detail/equity-detail.component';
import { SectorMappingComponent } from './components/sector/sector-mapping/sector-mapping.component';
import { SectorExposureComponent } from './components/sector/sector-exposure/sector-exposure.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './services/auth/auth.guard';

//TODO localisation
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Portfolio Visualization Tools' // Attribut custom pour afficher dans le header.
    },
    canActivate: [AuthGuard] // Gestion droits utilisateur.
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    data: {
      title: 'Portfolio'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'equity/:id',
    component: EquityDetailComponent,
    data: {
      title: 'Equity Detail'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'geography',
    component: GeographicExposureComponent,
    data: {
      title: 'Geographic Exposure'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'sector',
    component: SectorExposureComponent,
    data: {
      title: 'Sector Exposure'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/geography',
    component: GeographyMappingComponent,
    data: {
      title: 'Geographic Mapping'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/sector',
    component: SectorMappingComponent,
    data: {
      title: 'Sector Mapping'
    },
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

/**
 * Composant gestion de la navigation interne, un composant par point d'entrée.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
