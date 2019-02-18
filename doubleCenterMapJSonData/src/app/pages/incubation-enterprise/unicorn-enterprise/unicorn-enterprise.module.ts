import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnicornEnterpriseRoutingModule } from './unicorn-enterprise-routing.module';
import { ShareModule } from "../../../share/share.module";
import { UnicornEnterpriseComponent } from "./unicorn-enterprise.component";

@NgModule({
  imports: [
    CommonModule,
    UnicornEnterpriseRoutingModule,
    ShareModule
  ],
  declarations: [UnicornEnterpriseComponent]
})
export class UnicornEnterpriseModule { }
