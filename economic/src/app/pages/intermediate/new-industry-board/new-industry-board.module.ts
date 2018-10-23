import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewIndustryBoardRoutingModule } from './new-industry-board-routing.module';
import { NewIndustryBoardComponent } from './new-industry-board.component';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { TypeOverviewComponent } from './type-overview/type-overview.component';
import { IndustryBoardService } from './industry-board.service';
import { SharedModule } from '../../../shared/shared.module';
import { TypeScaleComponent } from './type-scale/type-scale.component';
import { TypeEconomicComponent } from './type-economic/type-economic.component';
import { TypeFunctionalAreaComponent } from './type-functional-area/type-functional-area.component';
import { TypeOtherComponent } from './type-other/type-other.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NewIndustryBoardRoutingModule
  ],
  providers: [IndustryBoardService],
  declarations: [NewIndustryBoardComponent, MenuLayoutComponent, TypeOverviewComponent, TypeScaleComponent, TypeEconomicComponent, TypeFunctionalAreaComponent, TypeOtherComponent]
})
export class NewIndustryBoardModule { }
