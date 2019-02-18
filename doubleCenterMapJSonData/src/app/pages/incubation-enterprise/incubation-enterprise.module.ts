import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncubationEnterpriseRoutingModule } from './incubation-enterprise-routing.module';
// import { SeedEnterpriseComponent } from './seed-enterprise/seed-enterprise.component';
// import { GazelleEnterpriseComponent } from './gazelle-enterprise/gazelle-enterprise.component';
// import { UnicornEnterpriseComponent } from './unicorn-enterprise/unicorn-enterprise.component';
import { ShareModule } from "../../share/share.module";

@NgModule({
  imports: [
    CommonModule,
    IncubationEnterpriseRoutingModule,
    ShareModule
  ],
  declarations: []
})
export class IncubationEnterpriseModule { }
