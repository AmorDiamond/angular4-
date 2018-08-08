import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndustryMapRoutingModule } from './industry-map-routing.module';
import { EnterpriseFenbuComponent } from '../industry-map/enterprise-fenbu/enterprise-fenbu.component';
import { EconomicScaleComponent } from '../industry-map/economic-scale/economic-scale.component';
import { EnterpriseJiegouComponent } from './enterprise-jiegou/enterprise-jiegou.component';
import { LeadIndustryJiegouComponent } from './lead-industry-jiegou/lead-industry-jiegou.component';
import { LeadIndustryFenbuComponent } from './lead-industry-fenbu/lead-industry-fenbu.component';
import { NewIndustryFenbuComponent } from './new-industry-fenbu/new-industry-fenbu.component';
import { CustomizeIndustryFenbuComponent } from './customize-industry-fenbu/customize-industry-fenbu.component';
import { SharedModule } from '../../../shared/shared.module';
import { RegisterMoneyComponent } from './register-money/register-money.component';
import { WorkerTotalComponent } from './worker-total/worker-total.component';

@NgModule({
  imports: [
    CommonModule,
    IndustryMapRoutingModule,
    SharedModule
  ],
  declarations: [
    EnterpriseFenbuComponent,
    EconomicScaleComponent,
    EnterpriseJiegouComponent,
    LeadIndustryJiegouComponent,
    LeadIndustryFenbuComponent,
    NewIndustryFenbuComponent,
    CustomizeIndustryFenbuComponent,
    RegisterMoneyComponent,
    WorkerTotalComponent
  ]
})
export class IndustryMapModule { }
