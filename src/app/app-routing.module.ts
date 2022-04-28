import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthGuard } from './auth/services/auth.guard';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { EquityDetailComponent } from './equity/components/equity-detail/equity-detail.component';
import { GeographicExposureComponent } from './geography/components/geographic-exposure/geographic-exposure.component';
import { GeoMappingComponent } from './geography/components/mapping/geo-mapping.component';
import { PageNotFoundComponent } from './handling/components/page-not-found/page-not-found.component';
import { PortfolioComponent } from './portfolio/component/portfolio.component';
import { SectorExposureComponent } from './sector/components/sector-exposure/sector-exposure.component';
import { SectorMappingComponent } from './sector/components/mapping/sector-mapping.component';


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
// TODO lazy loading, tous les modules des routes sont préchargés ici !
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
    component: GeoMappingComponent,
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
 *
 * ---
 *
 * IMPORTANT -> LocationStrategy :
 *
 * The client must always load the base HTML no matter what the URL is.
 * //TODO
 *
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
