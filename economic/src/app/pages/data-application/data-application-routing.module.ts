import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataApplicationComponent } from "./data-application.component";

const routes: Routes = [
  {path: '', component: DataApplicationComponent, children: [
      {path: '', redirectTo: 'researchGuide', pathMatch: 'full'},
      {path: 'researchGuide', loadChildren: './research-guide/research-guide.module#ResearchGuideModule'},
      {path: 'contactLookup', loadChildren: './contact-lookup/contact-lookup.module#ContactLookupModule'},
      {path: 'dataOutput', loadChildren: './data-output/data-output.module#DataOutputModule'},
      {path: 'qualityRecommend', loadChildren: './quality-recommend/quality-recommend.module#QualityRecommendModule'}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataApplicationRoutingModule { }
