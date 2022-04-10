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
import { PageNotFoundComponent } from './components/handling/page-not-found.component';

//TODO localisation
/**
 * Array that defines the navigation paths for the application.
 *
 * Route order :
 *
 * - The order of routes is important because the Router uses a first-match wins strategy when matching routes,
 *   so more specific routes should be placed above less specific routes.
 *
 * - Lists routes with a static path first, followed by an empty path route, which matches the default route.
 *
 * - The wildcard route comes last because it matches every URL and the Router selects it only if no other route matches first.
 */
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard', // Relative path displayed in the URL.
    component: DashboardComponent, // Related component (single entry).
    data: { // Custom attributes definition.
      title: 'Portfolio Visualization Tools' // Custom attribute to display a different title in the header.
    },
    canActivate: [AuthGuard] // Displays the view according to user rights.
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
  {
    path: 'equity/:id',
    component: EquityDetailComponent,
    data: {
      title: 'Equity Detail'
    },
    canActivate: [AuthGuard]
  },
  // Path may be empty when first accessing the application. Redirects to a default home view (which will redirect to login if no user is logged in).
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // Wildcard Route : matches any other route that doesn't exists in the application and displays a 404 page.
  { path: '**', component: PageNotFoundComponent },
];

/**
 * Component for app navigation.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
