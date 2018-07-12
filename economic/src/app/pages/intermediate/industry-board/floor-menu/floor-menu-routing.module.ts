import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuildInformationComponent } from './build-information/build-information.component';
import { RegistMoneyComponent } from './regist-money/regist-money.component';
import { EnterpriseTypeComponent } from './enterprise-type/enterprise-type.component';

const routes: Routes = [
  {path: 'builds', component: BuildInformationComponent},
  {path: 'registMoney', component: RegistMoneyComponent},
  {path: 'companyType', component: EnterpriseTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloorMenuRoutingModule { }
