import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechnologyPlatformComponent } from "./technology-platform.component";
import { EnterpriseListComponent } from "../common/enterprise-list/enterprise-list.component";
import { PlatformDetailComponent } from "./platform-detail/platform-detail.component";

const routes: Routes = [
  {path: '', component: TechnologyPlatformComponent, children: [
      {path: 'list/:name', component: EnterpriseListComponent},
      {path: 'detail/:name', component: PlatformDetailComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnologyPlatformRoutingModule { }
