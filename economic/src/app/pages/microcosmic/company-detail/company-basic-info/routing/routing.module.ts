import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessRegistrationComponent } from '../business-registration/business-registration.component';
import { BusinessChangeComponent } from '../business-change/business-change.component';
import { TaxRegistrationComponent } from '../tax-registration/tax-registration.component';
import { SocialSecurityComponent } from '../social-security/social-security.component';
import { CompanyProfileComponent } from '../company-profile/company-profile.component';
import { BusinessProblemLedgerComponent } from '../business-problem-ledger/business-problem-ledger.component';

export const routes: Routes = [
  {
    path: 'company-profile',
    component: CompanyProfileComponent
  },
  {
    path: 'business-registration',
    component: BusinessRegistrationComponent
  },
  {
    path: 'business-problem-ledger',
    component: BusinessProblemLedgerComponent
  },
  {
    path: 'business-change',
    component: BusinessChangeComponent
  },
  {
    path: 'tax-tegistration',
    component: TaxRegistrationComponent
  },
  {
    path: 'social-security',
    component: SocialSecurityComponent
  },
  {
    path: '**',
    redirectTo: 'company-profile',
    pathMatch: 'full'
  }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  imports: [
    routing
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
