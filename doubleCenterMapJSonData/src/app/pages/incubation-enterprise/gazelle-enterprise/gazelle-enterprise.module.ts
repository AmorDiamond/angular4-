import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GazelleEnterpriseRoutingModule } from './gazelle-enterprise-routing.module';
import { ShareModule } from "../../../share/share.module";
import { GazelleEnterpriseComponent } from "./gazelle-enterprise.component";

@NgModule({
  imports: [
    CommonModule,
    GazelleEnterpriseRoutingModule,
    ShareModule
  ],
  declarations: [GazelleEnterpriseComponent]
})
export class GazelleEnterpriseModule { }
