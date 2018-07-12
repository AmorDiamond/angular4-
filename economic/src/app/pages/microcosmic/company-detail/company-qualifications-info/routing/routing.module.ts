import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndustryQualificationComponent } from '../industry-qualification/industry-qualification.component';
import { SeniorCompanyComponent } from '../senior-company/senior-company.component';
import { StandardComponent } from '../standard/standard.component';
import { FamousProductComponent } from '../famous-product/famous-product.component';

export const routes: Routes = [
  {
    path: 'industry-qualification',
    component: IndustryQualificationComponent
  },
  {
    path: 'senior-company',
    component: SeniorCompanyComponent
  },
  {
    path: 'standard',
    component: StandardComponent
  },
  {
    path: 'famous-product',
    component: FamousProductComponent
  },
  {
    path: '**',
    redirectTo: 'industry-qualification',
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
