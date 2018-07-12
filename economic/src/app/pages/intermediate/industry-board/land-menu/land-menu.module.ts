import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { LandMenuRoutingModule } from './land-menu-routing.module';
import { LandNatureComponent } from './land-nature/land-nature.component';
import { SingleFloorComponent } from './single-floor/single-floor.component';
import { EcoTopComponent } from './eco-top/eco-top.component';
import { EcoOutputComponent } from './eco-output/eco-output.component';
import { InefficientLandComponent } from './inefficient-land/inefficient-land.component';

@NgModule({
  imports: [
    CommonModule,
    LandMenuRoutingModule,
    SharedModule
  ],
  declarations: [LandNatureComponent, SingleFloorComponent, EcoTopComponent, EcoOutputComponent, InefficientLandComponent]
})
export class LandMenuModule { }
