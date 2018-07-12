import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { ParkMenuRoutingModule } from './park-menu-routing.module';
import { RegistMoneyComponent } from './regist-money/regist-money.component';
import { EnterpriseTypeComponent } from './enterprise-type/enterprise-type.component';

@NgModule({
  imports: [
    CommonModule,
    ParkMenuRoutingModule,
    SharedModule
  ],
  declarations: [RegistMoneyComponent, EnterpriseTypeComponent]
})
export class ParkMenuModule { }
