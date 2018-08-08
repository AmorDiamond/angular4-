import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreetMenuService } from "./street-menu.service";
import { StreetMenuRoutingModule } from './street-menu-routing.module';
import { RegisterMoneyComponent } from './register-money/register-money.component';
import { EnterpriseTypeComponent } from './enterprise-type/enterprise-type.component';
import { StreetMenuComponent } from './street-menu.component';
import { SharedModule } from "../../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    StreetMenuRoutingModule,
    SharedModule
  ],
  declarations: [RegisterMoneyComponent, EnterpriseTypeComponent, StreetMenuComponent],
  providers: [StreetMenuService]
})
export class StreetMenuModule { }
