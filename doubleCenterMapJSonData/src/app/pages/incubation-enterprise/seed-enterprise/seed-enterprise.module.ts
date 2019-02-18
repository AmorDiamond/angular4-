import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeedEnterpriseRoutingModule } from './seed-enterprise-routing.module';
import { ShareModule } from "../../../share/share.module";
import { SeedEnterpriseComponent } from "./seed-enterprise.component";

@NgModule({
  imports: [
    CommonModule,
    SeedEnterpriseRoutingModule,
    ShareModule
  ],
  declarations: [SeedEnterpriseComponent]
})
export class SeedEnterpriseModule { }
