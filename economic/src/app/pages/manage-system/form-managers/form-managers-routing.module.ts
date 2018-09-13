import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormTorchComponent } from './form-torch/form-torch.component';
import { FormTaxDataComponent } from './form-tax-data/form-tax-data.component';
import { FormStansByComponent } from './form-stans-by/form-stans-by.component';
import { FormPraiseComponent } from './form-praise/form-praise.component';
import { FormBuildingEnterpriseComponent } from './form-building-enterprise/form-building-enterprise.component';


import { EnvironmentalProtectionComponent } from './environmental-protection/environmental-protection.component';
import { MoveOutComponent } from './move-out/move-out.component';
import { EnergyConsumptionComponent } from './energy-consumption/energy-consumption.component';
import { FamousExcellentComponent } from './famous-excellent/famous-excellent.component';
import { OtherQualificationsComponent } from './other-qualifications/other-qualifications.component';
import { UpperScaleComponent } from './upper-scale/upper-scale.component';

import { MacroEconomyComponent } from './macro-economy/macro-economy.component';
import { PillarIndustryComponent } from './pillar-industry/pillar-industry.component';
import { FixedInvestmentComponent } from './fixed-investment/fixed-investment.component';
import { PublicBudgetComponent } from './public-budget/public-budget.component';

import { PublicExpenditureComponent } from './public-expenditure/public-expenditure.component';


import { UploadFileComponent } from './upload-file/upload-file.component';
import { PeopleIncomeComponent } from './people-income/people-income.component';

const routes: Routes = [
  { path: '', redirectTo: 'torch', pathMatch: 'full' },
  { path: 'torch', component: FormTorchComponent },
  { path: 'taxData', component: FormTaxDataComponent },
  { path: 'stansBy', component: FormStansByComponent },
  { path: 'praise', component: FormPraiseComponent },
  { path: 'buildingEnterprise', component: FormBuildingEnterpriseComponent },
  { path: 'environmentalProtection', component: EnvironmentalProtectionComponent },
  { path: 'moveOut', component: MoveOutComponent },
  { path: 'energyConsumption', component: EnergyConsumptionComponent },
  { path: 'famousExcellent', component: FamousExcellentComponent },
  { path: 'otherQualifications', component: OtherQualificationsComponent },
  { path: 'upperScale', component: UpperScaleComponent },
  { path: 'macroEconomy', component: MacroEconomyComponent },
  { path: 'pillarIndustry', component: PillarIndustryComponent },
  { path: 'fixedInvestment', component: FixedInvestmentComponent },
  { path: 'publicBudget', component: PublicBudgetComponent },
  { path: 'publicExpenditure', component: PublicExpenditureComponent },
  { path: 'peopleIncome', component: PeopleIncomeComponent },
  { path: 'UploadFile', component: UploadFileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormManagersRoutingModule { }
