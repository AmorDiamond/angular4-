import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistributedComponent } from './distributed/distributed.component';
import { WorkshopComponent } from './workshop/workshop.component';
import { EnterpriseComponent } from './enterprise/enterprise.component';
import { DistributedPanelRouteComponent } from './distributed/distributed-panel-route/distributed-panel-route.component';

const routes: Routes = [
  {path: '', redirectTo: 'distributed', pathMatch: 'full'},
  {path: 'distributed', component: DistributedComponent, children: [{
    path: 'info/:name', component: DistributedPanelRouteComponent
    }]},
  {path: 'workshop', component: WorkshopComponent},
  {path: 'enterprise', component: EnterpriseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryRoutingModule { }
