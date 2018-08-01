import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QualityRecommendComponent } from './quality-recommend.component';

const routes: Routes = [
  {path: '', component: QualityRecommendComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityRecommendRoutingModule { }
