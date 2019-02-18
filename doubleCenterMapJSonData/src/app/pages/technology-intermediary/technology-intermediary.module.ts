import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechnologyIntermediaryRoutingModule } from './technology-intermediary-routing.module';
import { TechnologyIntermediaryComponent } from './technology-intermediary.component';
import { ShareModule } from "../../share/share.module";
import { DetailComponent } from "./detail/detail.component";

@NgModule({
  imports: [
    CommonModule,
    TechnologyIntermediaryRoutingModule,
    ShareModule
  ],
  declarations: [TechnologyIntermediaryComponent, DetailComponent]
})
export class TechnologyIntermediaryModule { }
