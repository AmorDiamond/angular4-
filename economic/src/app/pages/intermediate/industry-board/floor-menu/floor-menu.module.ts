import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { FloorMenuRoutingModule } from './floor-menu-routing.module';
import { BuildInformationComponent } from './build-information/build-information.component';
import { RegistMoneyComponent } from './regist-money/regist-money.component';
import { EnterpriseTypeComponent } from './enterprise-type/enterprise-type.component';

@NgModule({
  imports: [
    CommonModule,
    FloorMenuRoutingModule,
    SharedModule
  ],
  declarations: [BuildInformationComponent, RegistMoneyComponent, EnterpriseTypeComponent]
})
export class FloorMenuModule { }
