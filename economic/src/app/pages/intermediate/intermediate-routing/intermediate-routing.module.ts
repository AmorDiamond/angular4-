import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntermediateComponent } from '../intermediate.component';
import { IndexAbstractComponent } from '../index-abstract/index-abstract.component';
// import { IndustryBoardComponent } from '../industry-board/industry-board.component';
import { BusinessTrainingComponent } from '../business-training/business-training.component';
import { IndustryMapComponent } from '../industry-map/industry-map.component';
import { GradientTrainComponent } from '../business-training/gradient-train/gradient-train.component';
import { MajorTrainComponent } from '../business-training/major-train/major-train.component';
import { NewIndustryBoardComponent } from '../new-industry-board/new-industry-board.component';
import { MenuLayoutComponent } from '../new-industry-board/menu-layout/menu-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: IntermediateComponent,
    children: [
      {path: 'indexAbstract', component: IndexAbstractComponent},
      /*{path: 'industryBoard', component: IndustryBoardComponent,
          children: [
              {path: '', loadChildren: '../industry-board/industry-menu/industry-menu.module#IndustryMenuModule'},
              {path: 'streetMenu', loadChildren: '../industry-board/street-menu/street-menu.module#StreetMenuModule'},
              {path: 'parkMenu', loadChildren: '../industry-board/park-menu/park-menu.module#ParkMenuModule'},
              {path: 'landMenu', loadChildren: '../industry-board/land-menu/land-menu.module#LandMenuModule'},
              {path: 'buildMenu', loadChildren: '../industry-board/floor-menu/floor-menu.module#FloorMenuModule'}
          ]},*/
      {path: 'industryBoard',  loadChildren: '../new-industry-board/new-industry-board.module#NewIndustryBoardModule'},
      {path: 'areaFocus',  loadChildren: '../area-focus/area-focus.module#AreaFocusModule'},
      {path: 'tradeBoard',  loadChildren: '../new-trade-board/new-trade-board.module#NewTradeBoardModule'},
      {path: 'businessTrain', component: BusinessTrainingComponent, children: [
          {path: '', redirectTo: 'GradientTrain', pathMatch: 'full'},
          {path: 'GradientTrain', component: GradientTrainComponent},
          {path: 'majorTrain', component: MajorTrainComponent}
        ]},
      {path: 'industryMap', component: IndustryMapComponent, children: [
          {path: '', loadChildren: '../industry-map/industry-map.module#IndustryMapModule'}
        ]},
      {path: '', redirectTo: 'industryBoard', pathMatch: 'full'}
    ]
  },
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
export class IntermediateRoutingModule { }
