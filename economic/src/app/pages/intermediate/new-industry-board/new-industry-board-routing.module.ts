import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypeOverviewComponent } from './type-overview/type-overview.component';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { NewIndustryBoardComponent } from './new-industry-board.component';
import { TypeScaleComponent } from './type-scale/type-scale.component';
import { TypeEconomicComponent } from './type-economic/type-economic.component';
import { TypeFunctionalAreaComponent } from './type-functional-area/type-functional-area.component';
import { TypeOtherComponent } from './type-other/type-other.component';

const routes: Routes = [
  {path: '', component: NewIndustryBoardComponent, children: []},
  {path: 'typeInfo', component: MenuLayoutComponent, children: [
      {path: '', component: TypeOverviewComponent},
      {path: 'typeScale', component: TypeScaleComponent},
      {path: 'typeEconomic', component: TypeEconomicComponent},
      {path: 'typeFunctional', component: TypeFunctionalAreaComponent},
      {path: 'typeOther', component: TypeOtherComponent},
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewIndustryBoardRoutingModule { }
