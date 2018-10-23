import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataApplicationComponent } from './data-application.component';
import { DetailPageComponent } from './research-guide/detail-page/detail-page.component';
import { ContactDetailPageComponent } from './contact-lookup/detail-page/detail-page.component';
import { RecommendListComponent } from './quality-recommend/recommend-list/recommend-list.component';
import { SearchListComponent } from './data-output/search-list/search-list.component';

const routes: Routes = [
  {path: '', component: DataApplicationComponent, children: [
      {path: '', redirectTo: 'researchGuide', pathMatch: 'full'},
      {path: 'researchGuide', loadChildren: './research-guide/research-guide.module#ResearchGuideModule'},
      {path: 'contactLookup', loadChildren: './contact-lookup/contact-lookup.module#ContactLookupModule'},
      {path: 'dataOutput', loadChildren: './data-output/data-output.module#DataOutputModule'},
      {path: 'qualityRecommend', loadChildren: './quality-recommend/quality-recommend.module#QualityRecommendModule'}
    ]},
  {path: 'researchDetail', component: DetailPageComponent},
  {path: 'contactDetail', component: ContactDetailPageComponent},
  {path: 'recommendList', component: RecommendListComponent},
  {path: 'outputList', component: SearchListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataApplicationRoutingModule { }
