import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../share/share.module';

import { IndustryRoutingModule } from './industry-routing.module';
import { DistributedComponent } from './distributed/distributed.component';
import { WorkshopComponent } from './workshop/workshop.component';
import { EnterpriseComponent } from './enterprise/enterprise.component';
import { DistributedPanelRouteComponent } from './distributed/distributed-panel-route/distributed-panel-route.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    IndustryRoutingModule
  ],
  declarations: [DistributedComponent, WorkshopComponent, EnterpriseComponent, DistributedPanelRouteComponent]
})
export class IndustryModule { }
