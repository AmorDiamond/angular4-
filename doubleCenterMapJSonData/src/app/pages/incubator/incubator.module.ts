import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncubatorRoutingModule } from './incubator-routing.module';
import { IncubatorComponent } from './incubator.component';
import { ShareModule } from "../../share/share.module";
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    IncubatorRoutingModule,
    ShareModule
  ],
  declarations: [IncubatorComponent, DetailComponent]
})
export class IncubatorModule { }
