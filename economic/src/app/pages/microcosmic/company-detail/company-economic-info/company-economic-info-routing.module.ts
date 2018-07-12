import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperatingIncomeComponent } from './operating-income/operating-income.component';
import { IncumbentPeopleComponent } from './incumbent-people/incumbent-people.component';
import { GovernmentFundsComponent } from './government-funds/government-funds.component';
import { AnnualReportComponent } from './annual-report/annual-report.component';
import { JobOffersComponent } from './job-offers/job-offers.component';
import { TechnologyInnovationComponent } from './technology-innovation/technology-innovation.component';

const routes: Routes = [
    {path: '', redirectTo: 'operatingIncome', pathMatch: 'full'},
    {path: 'operatingIncome', component: OperatingIncomeComponent},
    {path: 'incumbentPeople', component: IncumbentPeopleComponent},
    {path: 'technologyInnovation', component: TechnologyInnovationComponent},
    {path: 'governmentFunds', component: GovernmentFundsComponent},
    {path: 'annualReport', component: AnnualReportComponent},
    {path: 'jobOffers', component: JobOffersComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyEconomicInfoRoutingModule { }
