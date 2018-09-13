import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgUploaderModule } from 'ngx-uploader';

import { FormManagersRoutingModule } from './form-managers-routing.module';
import { FormTorchComponent } from './form-torch/form-torch.component';
import { FormTaxDataComponent } from './form-tax-data/form-tax-data.component';
import { FormStansByComponent } from './form-stans-by/form-stans-by.component';
import { FormPraiseComponent } from './form-praise/form-praise.component';
import { FormBuildingEnterpriseComponent } from './form-building-enterprise/form-building-enterprise.component';
import { PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';

import {SharedModule} from './../../../shared/shared.module'
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
import { FormManagersService } from './form-managers.service';

@NgModule({
  imports: [
    CommonModule,
    FormManagersRoutingModule,
    NgUploaderModule,
    SharedModule,
    PaginationModule
  ],
  providers: [FormManagersService],
  declarations: [FormTorchComponent, FormTaxDataComponent, FormStansByComponent, FormPraiseComponent, FormBuildingEnterpriseComponent, EnvironmentalProtectionComponent,   MoveOutComponent,   EnergyConsumptionComponent,   FamousExcellentComponent,   OtherQualificationsComponent, UpperScaleComponent, MacroEconomyComponent, PillarIndustryComponent, FixedInvestmentComponent, PublicBudgetComponent, PublicExpenditureComponent, UploadFileComponent, PeopleIncomeComponent]
})
export class FormManagersModule { }
