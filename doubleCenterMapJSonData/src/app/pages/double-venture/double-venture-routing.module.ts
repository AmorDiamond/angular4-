import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoubleVentureComponent } from './double-venture.component';
import { EnterpriseListComponent } from "../common/enterprise-list/enterprise-list.component";
import { EnterpriseDetailComponent } from "../common/enterprise-detail/enterprise-detail.component";

const routes: Routes = [
  {path: '', component: DoubleVentureComponent, children: [
      {path: 'list/:name', component: EnterpriseListComponent},
      {path: 'detail/:name', component: EnterpriseDetailComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoubleVentureRoutingModule { }
