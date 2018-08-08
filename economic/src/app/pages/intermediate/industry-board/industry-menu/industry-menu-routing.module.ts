import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterpriseFenbuComponent } from './enterprise-fenbu/enterprise-fenbu.component';
import { EconomicScaleComponent } from './economic-scale/economic-scale.component';
import { EnterpriseJiegouComponent } from './enterprise-jiegou/enterprise-jiegou.component';
import { LeadIndustryComponent } from './lead-industry/lead-industry.component';
import { AdvancedManufacturingComponent } from './advanced-manufacturing/advanced-manufacturing.component';
import { MilitaryCivilianIntegrationComponent } from './military-civilian-integration/military-civilian-integration.component';
import { IndustryMenuComponent } from './industry-menu.component';

const routes: Routes = [
    {path: '', component: IndustryMenuComponent, children: [
        {path: '', redirectTo: 'fenbu', pathMatch: 'full'},
        {path: 'fenbu', component: EnterpriseFenbuComponent},
        {path: 'scale', component: EconomicScaleComponent},
        {path: 'jiegou', component: EnterpriseJiegouComponent},
        {path: 'leadIndustry', component: LeadIndustryComponent},
        {path: 'advancedManufacture', component: AdvancedManufacturingComponent},
        {path: 'militaryCivilian', component: MilitaryCivilianIntegrationComponent},
      ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryMenuRoutingModule { }
