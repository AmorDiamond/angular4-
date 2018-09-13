import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandRoutingModule } from './land-routing.module';
import { UseComponent } from './use/use.component';
import { InefficientComponent } from './inefficient/inefficient.component';
import { PanelRouteComponent } from './use/panel-route/panel-route.component';
import { ShareModule } from '../share/share.module';
import { NatureProportionRouteComponent } from './use/nature-proportion-route/nature-proportion-route.component';
import { InefficientPanelRouteComponent } from './inefficient/inefficient-panel-route/inefficient-panel-route.component';

@NgModule({
  imports: [
    CommonModule,
    LandRoutingModule,
    ShareModule
  ],
  declarations: [UseComponent, InefficientComponent, PanelRouteComponent, NatureProportionRouteComponent, InefficientPanelRouteComponent]
})
export class LandModule { }
