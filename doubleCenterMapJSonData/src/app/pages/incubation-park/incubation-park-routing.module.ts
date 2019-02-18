import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent} from "./detail/detail.component";
import { EnterpriseListComponent } from "../common/enterprise-list/enterprise-list.component";
import { IncubationParkComponent } from './incubation-park.component';

const routes: Routes = [
  {path: '', component: IncubationParkComponent, children: [
      {path: 'list/:name', component: EnterpriseListComponent},
      {path: 'detail/:name', component: DetailComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncubationParkRoutingModule { }
