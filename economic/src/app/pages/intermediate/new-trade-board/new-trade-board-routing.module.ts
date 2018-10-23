import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewTradeBoardComponent } from './new-trade-board.component';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { AdvancedManufactureComponent } from './advanced-manufacture/advanced-manufacture.component';
import { LeadServiceComponent } from './lead-service/lead-service.component';

const routes: Routes = [
  {path: '', component: NewTradeBoardComponent},
  {path: 'tradeInfo', component: MenuLayoutComponent, children: [
      {path: '', redirectTo: 'advancedManufacture', pathMatch: 'full'},
      {path: 'advancedManufacture', component: AdvancedManufactureComponent},
      {path: 'leadService', component: LeadServiceComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewTradeBoardRoutingModule { }
