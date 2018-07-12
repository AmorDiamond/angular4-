import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterpriseFenbuComponent } from './enterprise-fenbu/enterprise-fenbu.component';
import { EconomicScaleComponent } from './economic-scale/economic-scale.component';
import { EnterpriseJiegouComponent } from './enterprise-jiegou/enterprise-jiegou.component';
import { LeadIndustryComponent } from './lead-industry/lead-industry.component';

const routes: Routes = [
    {path: '', redirectTo: 'fenbu', pathMatch: 'full'},
    {path: 'fenbu', component: EnterpriseFenbuComponent},
    {path: 'scale', component: EconomicScaleComponent},
    {path: 'jiegou', component: EnterpriseJiegouComponent},
    {path: 'leadIndustry', component: LeadIndustryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryMenuRoutingModule { }
