import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaFocusRoutingModule } from './area-focus-routing.module';
import { AreaFocusComponent } from './area-focus.component';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { AreaOverviewComponent } from './area-overview/area-overview.component';

import { SharedModule } from '../../../shared/shared.module';
import { AreaFocusService } from './area-focus.service';
import { ScaleComponent } from './area-overview/scale/scale.component';
import { EconomyComponent } from './area-overview/economy/economy.component';
import { OtherComponent } from './area-overview/other/other.component'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AreaFocusRoutingModule
  ],
  providers: [AreaFocusService],
  declarations: [AreaFocusComponent, MenuLayoutComponent, AreaOverviewComponent, ScaleComponent, EconomyComponent, OtherComponent]
})
export class AreaFocusModule { }
