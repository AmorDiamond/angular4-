import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterMoneyComponent } from './register-money/register-money.component';
import { EnterpriseTypeComponent } from './enterprise-type/enterprise-type.component';
import { StreetMenuComponent } from './street-menu.component';

const routes: Routes = [
  {path: '', component: StreetMenuComponent, children: [
      {path: '', redirectTo: 'registerMoney', pathMatch: 'full'},
      {path: 'registerMoney', component: RegisterMoneyComponent},
      {path: 'enterpriseType', component: EnterpriseTypeComponent},
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreetMenuRoutingModule { }
