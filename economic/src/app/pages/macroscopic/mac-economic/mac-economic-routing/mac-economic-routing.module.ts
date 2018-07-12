import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MacEconomicBudgetComponent } from '../mac-economic-budget/mac-economic-budget.component';
import { MacEconomicExpendComponent } from '../mac-economic-expend/mac-economic-expend.component';
import { MacEconomicGdpComponent } from '../mac-economic-gdp/mac-economic-gdp.component';
import { MacEconomicIncomeComponent } from '../mac-economic-income/mac-economic-income.component';
import { MacEconomicInvestComponent } from '../mac-economic-invest/mac-economic-invest.component';
import { MacEconomicPillarComponent } from '../mac-economic-pillar/mac-economic-pillar.component';
import { MacEconomicComponent } from '../mac-economic.component';

export const routes: Routes = [
  {
    path: '',
    component: MacEconomicComponent,
    children: [
      { path: 'budget', component: MacEconomicBudgetComponent },
      { path: 'expend', component: MacEconomicExpendComponent },
      { path: 'gdp', component: MacEconomicGdpComponent },
      { path: 'income', component: MacEconomicIncomeComponent },
      { path: 'invest', component: MacEconomicInvestComponent },
      { path: 'pillar', component: MacEconomicPillarComponent },
      { path: '', redirectTo: 'gdp', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class MacEconomicRoutingModule { }
