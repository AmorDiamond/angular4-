import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncubationParkRoutingModule } from './incubation-park-routing.module';
import { ShareModule } from "../../share/share.module";
import { DetailComponent } from './detail/detail.component';
import { IncubationParkComponent } from './incubation-park.component';

@NgModule({
  imports: [
    CommonModule,
    IncubationParkRoutingModule,
    ShareModule
  ],
  declarations: [DetailComponent, IncubationParkComponent]
})
export class IncubationParkModule { }
