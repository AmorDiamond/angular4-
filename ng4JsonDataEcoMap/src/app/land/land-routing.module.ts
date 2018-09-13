import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UseComponent } from './use/use.component';
import { InefficientComponent } from './inefficient/inefficient.component';
import { PanelRouteComponent } from './use/panel-route/panel-route.component';
import { NatureProportionRouteComponent } from './use/nature-proportion-route/nature-proportion-route.component';
import { InefficientPanelRouteComponent } from './inefficient/inefficient-panel-route/inefficient-panel-route.component';

const routes: Routes = [
  {path: '', redirectTo: 'use', pathMatch: 'full'},
  {path: 'use', component: UseComponent, children: [
      {path: 'info/:id', component: PanelRouteComponent},
      {path: 'naTurePropor', component: NatureProportionRouteComponent},
    ]},
  {path: 'inefficient', component: InefficientComponent, children: [
      {path: 'info/:id', component: InefficientPanelRouteComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandRoutingModule { }
