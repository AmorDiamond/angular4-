import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { CompanyEconomicInfoRoutingModule } from './company-economic-info-routing.module';
import { OperatingIncomeComponent } from './operating-income/operating-income.component';
import { IncumbentPeopleComponent } from './incumbent-people/incumbent-people.component';
import { GovernmentFundsComponent } from './government-funds/government-funds.component';
import { AnnualReportComponent } from './annual-report/annual-report.component';
import { JobOffersComponent } from './job-offers/job-offers.component';
import { CompanyEconomicInfoService } from './company-economic-info.service';
import { TechnologyInnovationComponent } from './technology-innovation/technology-innovation.component';

@NgModule({
  imports: [
    CommonModule,
    CompanyEconomicInfoRoutingModule,
    SharedModule
  ],
  declarations: [OperatingIncomeComponent, IncumbentPeopleComponent, GovernmentFundsComponent, AnnualReportComponent, JobOffersComponent, TechnologyInnovationComponent],
  providers: [CompanyEconomicInfoService]
})
export class CompanyEconomicInfoModule { }
