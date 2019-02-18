import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechnologyPlatformRoutingModule } from './technology-platform-routing.module';
import { TechnologyPlatformComponent } from './technology-platform.component';
import { ShareModule } from "../../share/share.module";
import { PlatformDetailComponent } from "./platform-detail/platform-detail.component";

@NgModule({
  imports: [
    CommonModule,
    TechnologyPlatformRoutingModule,
    ShareModule
  ],
  declarations: [TechnologyPlatformComponent, PlatformDetailComponent]
})
export class TechnologyPlatformModule { }
