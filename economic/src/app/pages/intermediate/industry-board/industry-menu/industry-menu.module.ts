import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { IndustryMenuRoutingModule } from './industry-menu-routing.module';
import { EnterpriseFenbuComponent } from './enterprise-fenbu/enterprise-fenbu.component';
import { EconomicScaleComponent } from './economic-scale/economic-scale.component';
import { EnterpriseJiegouComponent } from './enterprise-jiegou/enterprise-jiegou.component';
import { LeadIndustryComponent } from './lead-industry/lead-industry.component';
import { AdvancedManufacturingComponent } from './advanced-manufacturing/advanced-manufacturing.component';
import { MilitaryCivilianIntegrationComponent } from './military-civilian-integration/military-civilian-integration.component';
import { IndustryMenuComponent } from './industry-menu.component';
import { IndustryMenuService } from "./industry-menu.service";

@NgModule({
  imports: [
    CommonModule,
    IndustryMenuRoutingModule,
    SharedModule
  ],
  declarations: [
      EnterpriseFenbuComponent,
      EconomicScaleComponent,
      EnterpriseJiegouComponent,
      LeadIndustryComponent,
      AdvancedManufacturingComponent,
      MilitaryCivilianIntegrationComponent,
      IndustryMenuComponent
  ],
  providers: [IndustryMenuService]
})
export class IndustryMenuModule { }
