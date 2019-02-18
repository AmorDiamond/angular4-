import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list/list.component";
import { EnterpriseDetailComponent } from "../common/enterprise-detail/enterprise-detail.component";

const routes: Routes = [
  {path: '', children: [
      {path: 'list/:name', component: ListComponent},
      {path: 'detail/:name', component: EnterpriseDetailComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
