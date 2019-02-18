import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncubatorComponent } from "./incubator.component";
import { EnterpriseListComponent } from "../common/enterprise-list/enterprise-list.component";
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {path: '', component: IncubatorComponent, children: [
      {path: 'list/:name', component: EnterpriseListComponent},
      {path: 'detail/:name', component: DetailComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncubatorRoutingModule { }
