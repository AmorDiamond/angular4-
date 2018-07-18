import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing/routing.module';
import { SharedModule } from "../../../../shared/shared.module";
import { BusinessRegistrationComponent } from './business-registration/business-registration.component';
import { BusinessChangeComponent } from './business-change/business-change.component';
import { CompanyBasicService } from './company-basic.service';
import { TaxRegistrationComponent } from './tax-registration/tax-registration.component';
import { SocialSecurityComponent } from './social-security/social-security.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { BusinessProblemLedgerComponent } from './business-problem-ledger/business-problem-ledger.component';
import { CustomLabelComponent } from './custom-label/custom-label.component';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    SharedModule
  ],
  declarations: [
    BusinessRegistrationComponent,
    BusinessChangeComponent,
    TaxRegistrationComponent,
    SocialSecurityComponent,
    CompanyProfileComponent,
    BusinessProblemLedgerComponent,
    CustomLabelComponent
  ],
  providers: [
    CompanyBasicService
  ]
})
export class CompanyBasicInfoModule { }
