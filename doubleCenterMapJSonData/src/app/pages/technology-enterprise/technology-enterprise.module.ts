import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechnologyEnterpriseRoutingModule } from './technology-enterprise-routing.module';
import { ShareModule } from "../../share/share.module";
import { TechnologyEnterpriseComponent } from './technology-enterprise.component';
// import { EnterpriseListComponent } from "../common/enterprise-list/enterprise-list.component";
// import { EnterpriseDetailComponent } from "../common/enterprise-detail/enterprise-detail.component";

@NgModule({
  imports: [
    CommonModule,
    TechnologyEnterpriseRoutingModule,
    ShareModule
  ],
  declarations: [TechnologyEnterpriseComponent]
})
export class TechnologyEnterpriseModule { }
