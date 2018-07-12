import { NgModule } from '@angular/core';
import { IntermediateComponent } from './intermediate.component';
import { SharedModule } from '../../shared/shared.module';
import { IndexAbstractComponent } from './index-abstract/index-abstract.component';
import { IndustryBoardComponent } from './industry-board/industry-board.component';

import {IntermediateRoutingModule} from './intermediate-routing/intermediate-routing.module';
import { BusinessTrainingComponent } from './business-training/business-training.component';
import { IndustryMapComponent } from './industry-map/industry-map.component';
import { GradientTrainComponent } from './business-training/gradient-train/gradient-train.component';
import { MajorTrainComponent } from './business-training/major-train/major-train.component';
// import { IntermediateService } from './intermediate.service';

@NgModule({
  imports: [
    SharedModule,
    IntermediateRoutingModule
  ],
  declarations: [
    IntermediateComponent,
    IndexAbstractComponent,
    IndustryBoardComponent,
    BusinessTrainingComponent,
    IndustryMapComponent,
    GradientTrainComponent,
    MajorTrainComponent
  ]
})
export class IntermediateModule { }
