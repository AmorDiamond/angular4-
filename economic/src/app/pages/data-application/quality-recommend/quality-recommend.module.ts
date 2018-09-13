import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { QualityRecommendRoutingModule } from './quality-recommend-routing.module';
import { QualityRecommendComponent } from './quality-recommend.component';

@NgModule({
  imports: [
    CommonModule,
    QualityRecommendRoutingModule,
    SharedModule
  ],
  declarations: [QualityRecommendComponent]
})
export class QualityRecommendModule { }
