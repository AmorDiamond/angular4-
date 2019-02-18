import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterpriseListComponent } from "../common/enterprise-list/enterprise-list.component";
import { EnterpriseDetailComponent } from "../common/enterprise-detail/enterprise-detail.component";
import { TechnologyEnterpriseComponent } from './technology-enterprise.component';

const routes: Routes = [
  {path: '', component: TechnologyEnterpriseComponent, children: [
      {path: 'list/:name', component: EnterpriseListComponent},
      {path: 'detail/:name', component: EnterpriseDetailComponent},
      {path: '**', component: EnterpriseListComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnologyEnterpriseRoutingModule { }
