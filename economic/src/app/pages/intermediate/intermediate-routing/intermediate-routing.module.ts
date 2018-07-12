import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntermediateComponent } from '../intermediate.component';
import { IndexAbstractComponent } from '../index-abstract/index-abstract.component';
import { IndustryBoardComponent } from '../industry-board/industry-board.component';
import { BusinessTrainingComponent } from '../business-training/business-training.component';
import { IndustryMapComponent } from '../industry-map/industry-map.component';
import { GradientTrainComponent } from '../business-training/gradient-train/gradient-train.component';
import { MajorTrainComponent } from '../business-training/major-train/major-train.component';

export const routes: Routes = [
  {
    path: '',
    component: IntermediateComponent,
    children: [
      {path: 'indexAbstract', component: IndexAbstractComponent},
      {path: 'industryBoard', component: IndustryBoardComponent,
          children: [
              {path: '', loadChildren: '../industry-board/industry-menu/industry-menu.module#IndustryMenuModule'},
              {path: 'parkMenu', loadChildren: '../industry-board/park-menu/park-menu.module#ParkMenuModule'},
              {path: 'landMenu', loadChildren: '../industry-board/land-menu/land-menu.module#LandMenuModule'},
              {path: 'buildMenu', loadChildren: '../industry-board/floor-menu/floor-menu.module#FloorMenuModule'}
          ]},
      {path: 'businessTrain', component: BusinessTrainingComponent, children: [
          {path: '', redirectTo: 'GradientTrain', pathMatch: 'full'},
          {path: 'GradientTrain', component: GradientTrainComponent},
          {path: 'majorTrain', component: MajorTrainComponent}
        ]},
      {path: 'industryMap', component: IndustryMapComponent, children: [
          {path: '', loadChildren: '../industry-map/industry-map.module#IndustryMapModule'}
        ]},
      {path: '', redirectTo: 'indexAbstract', pathMatch: 'full'}
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
