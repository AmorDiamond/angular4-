import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { EnterpriseListComponent } from "../common/enterprise-list/enterprise-list.component";

const routes: Routes = [
  {path: '', component: LayoutComponent, children: [
      {path: 'home', loadChildren: '../home/home.module#HomeModule'},
      {path: 'technology', loadChildren: '../technology-enterprise/technology-enterprise.module#TechnologyEnterpriseModule'},
      {path: 'doubleVenture', loadChildren: '../double-venture/double-venture.module#DoubleVentureModule'},
      // {path: 'incubationEnterprise', loadChildren: '../incubation-enterprise/incubation-enterprise.module#IncubationEnterpriseModule'},
      {path: 'seedEnterprise', loadChildren: '../incubation-enterprise/seed-enterprise/seed-enterprise.module#SeedEnterpriseModule'},
      {path: 'gazelleEnterprise', loadChildren: '../incubation-enterprise/gazelle-enterprise/gazelle-enterprise.module#GazelleEnterpriseModule'},
      {path: 'unicornEnterprise', loadChildren: '../incubation-enterprise/unicorn-enterprise/unicorn-enterprise.module#UnicornEnterpriseModule'},
      {path: 'incubator', loadChildren: '../incubator/incubator.module#IncubatorModule'},
      {path: 'incubationPark', loadChildren: '../incubation-park/incubation-park.module#IncubationParkModule'},
      {path: 'intermediary', loadChildren: '../technology-intermediary/technology-intermediary.module#TechnologyIntermediaryModule'},
      {path: 'technologyPlatform', loadChildren: '../technology-platform/technology-platform.module#TechnologyPlatformModule'},
      {path: 'search', loadChildren: '../search/search.module#SearchModule'},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
    ]
  },
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
