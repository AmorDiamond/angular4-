import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MacEconomicRoutingModule } from './mac-economic-routing/mac-economic-routing.module';
import { MacEconomicBudgetComponent } from './mac-economic-budget/mac-economic-budget.component';
import { MacEconomicExpendComponent } from './mac-economic-expend/mac-economic-expend.component';
import { MacEconomicGdpComponent } from './mac-economic-gdp/mac-economic-gdp.component';
import { MacEconomicIncomeComponent } from './mac-economic-income/mac-economic-income.component';
import { MacEconomicInvestComponent } from './mac-economic-invest/mac-economic-invest.component';
import { MacEconomicPillarComponent } from './mac-economic-pillar/mac-economic-pillar.component';
import { MacEconomicComponent } from './mac-economic.component';
import { MacEconomicGdpService } from './mac-economic-gdp/mac-economic-gdp.service';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MacEconomicPillarService } from './mac-economic-pillar/mac-economic-pillar.service';
import { MacEconomicInvestService } from './mac-economic-invest/mac-economic-invest.service';
import { MacEconomicBudgetService } from './mac-economic-budget/mac-economic-budget.service';
import { MacEconomicExpendService } from './mac-economic-expend/mac-economic-expend.service';
import { MacEconomicIncomeService } from './mac-economic-income/mac-economic-income.service';

@NgModule({
  imports: [
    SharedModule,
    MacEconomicRoutingModule,
    // PerfectScrollbarModule,
  ],
  declarations: [
    MacEconomicComponent,
    MacEconomicBudgetComponent,
    MacEconomicExpendComponent,
    MacEconomicGdpComponent,
    MacEconomicIncomeComponent,
    MacEconomicInvestComponent,
    MacEconomicPillarComponent,
  ],
  providers: [
    MacEconomicGdpService,
    MacEconomicPillarService,
    MacEconomicInvestService,
    MacEconomicBudgetService,
    MacEconomicExpendService,
    MacEconomicIncomeService
  ]
})
export class MacEconomicModule { }
