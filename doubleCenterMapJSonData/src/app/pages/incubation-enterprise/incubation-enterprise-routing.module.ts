import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeedEnterpriseComponent } from './seed-enterprise/seed-enterprise.component';
import { GazelleEnterpriseComponent } from './gazelle-enterprise/gazelle-enterprise.component';
import { UnicornEnterpriseComponent } from './unicorn-enterprise/unicorn-enterprise.component';
import { EnterpriseListComponent } from "../common/enterprise-list/enterprise-list.component";
import { EnterpriseDetailComponent } from "../common/enterprise-detail/enterprise-detail.component";

const routes: Routes = [
  {path: '', redirectTo: 'seedEnterprise', pathMatch: 'full'},
  {path: 'seedEnterprise', component: SeedEnterpriseComponent, children: [
      {path: 'list/:name', component: EnterpriseListComponent},
      {path: 'detail/:name', component: EnterpriseDetailComponent},
    ]
  },
  {path: 'gazelleEnterprise', component: GazelleEnterpriseComponent, children: [
      {path: 'list/:name', component: EnterpriseListComponent},
      {path: 'detail/:name', component: EnterpriseDetailComponent},
    ]
  },
  {path: 'unicornEnterprise', component: UnicornEnterpriseComponent, children: [
      {path: 'list/:name', component: EnterpriseListComponent},
      {path: 'detail/:name', component: EnterpriseDetailComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncubationEnterpriseRoutingModule { }
