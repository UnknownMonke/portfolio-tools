import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { GeographicExposureComponent } from './components/geographic-exposure/geographic-exposure.component';

// navigation interne via l'API, un composant par point d'entrée
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent},
  { path: 'portfolio', component: PortfolioComponent},
  { path: 'geography', component: GeographicExposureComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
