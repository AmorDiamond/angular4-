import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchGuideRoutingModule } from './research-guide-routing.module';
import { ResearchGuideComponent } from './research-guide.component';
import { SharedModule } from "../../../shared/shared.module";
import { DetailPageComponent } from './detail-page/detail-page.component';

@NgModule({
  imports: [
    CommonModule,
    ResearchGuideRoutingModule,
    SharedModule
  ],
  declarations: [ResearchGuideComponent, DetailPageComponent]
})
export class ResearchGuideModule { }
