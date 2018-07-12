import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterpriseFenbuComponent } from './enterprise-fenbu/enterprise-fenbu.component';
import { EconomicScaleComponent } from './economic-scale/economic-scale.component';
import { EnterpriseJiegouComponent } from './enterprise-jiegou/enterprise-jiegou.component';
import { LeadIndustryJiegouComponent } from './lead-industry-jiegou/lead-industry-jiegou.component';
import { LeadIndustryFenbuComponent } from './lead-industry-fenbu/lead-industry-fenbu.component';
import { NewIndustryFenbuComponent } from './new-industry-fenbu/new-industry-fenbu.component';
import { CustomizeIndustryFenbuComponent } from './customize-industry-fenbu/customize-industry-fenbu.component';

export const routes: Routes = [
  {path: '', redirectTo: 'enterpriseFenbu', pathMatch: 'full'},
  {path: 'enterpriseFenbu', component: EnterpriseFenbuComponent},
  {path: 'economicScale', component: EconomicScaleComponent},
  {path: 'enterpriseJiegou', component: EnterpriseJiegouComponent},
  {path: 'leadIndustryJiegou', component: LeadIndustryJiegouComponent},
  {path: 'leadIndustryFenbu', component: LeadIndustryFenbuComponent},
  {path: 'newIndustry', component: NewIndustryFenbuComponent},
  {path: 'customizeIndustry', component: CustomizeIndustryFenbuComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}
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
export class IndustryMapRoutingModule { }
