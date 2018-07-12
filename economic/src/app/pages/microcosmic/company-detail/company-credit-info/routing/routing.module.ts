import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HonorComponent } from '../honor/honor.component';
import { BlacklistComponent } from '../blacklist/blacklist.component';
import { PerformancePaymentComponent } from '../performance-payment/performance-payment.component';
import { IndustryRatingComponent } from '../industry-rating/industry-rating.component';

export const routes: Routes = [
  {
    path: 'honor',
    component: HonorComponent
  },
  {
    path: 'blacklist',
    component: BlacklistComponent
  },
  {
    path: 'performance-payment',
    component: PerformancePaymentComponent
  },
  {
    path: 'industry-rating',
    component: IndustryRatingComponent
  },
  {
    path: '**',
    redirectTo: 'honor',
    pathMatch: 'full'
  }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  imports: [
    routing
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
