import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoubleVentureRoutingModule } from './double-venture-routing.module';
import { DoubleVentureComponent } from './double-venture.component';
import { ShareModule } from "../../share/share.module";

@NgModule({
  imports: [
    CommonModule,
    DoubleVentureRoutingModule,
    ShareModule
  ],
  declarations: [DoubleVentureComponent]
})
export class DoubleVentureModule { }
