import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndustryQualificationComponent } from './industry-qualification/industry-qualification.component';
import { RoutingModule } from './routing/routing.module';
import { SeniorCompanyComponent } from './senior-company/senior-company.component';
import { StandardComponent } from './standard/standard.component';
import { FamousProductComponent } from './famous-product/famous-product.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RoutingModule
  ],
  declarations: [IndustryQualificationComponent, SeniorCompanyComponent, StandardComponent, FamousProductComponent]
})
export class CompanyQualificationsInfoModule { }
