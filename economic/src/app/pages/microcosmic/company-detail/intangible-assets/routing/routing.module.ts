import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrademarkComponent } from '../trademark/trademark.component';
import { PatentComponent } from '../patent/patent.component';
import { CopyrightComponent } from '../copyright/copyright.component';
import { IcpComponent } from '../icp/icp.component';
import { DomainNameComponent } from '../domain-name/domain-name.component';

export const routes: Routes = [
  {
    path: 'trademark',
    component: TrademarkComponent
  },
  {
    path: 'patent',
    component: PatentComponent
  },
  {
    path: 'copyright',
    component: CopyrightComponent
  },
  {
    path: 'icp',
    component: IcpComponent
  },
  {
    path: 'domain-name',
    component: DomainNameComponent
  },
  {
    path: '**',
    redirectTo: 'trademark',
    pathMatch: 'full'
  }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  imports: [
    routing
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
