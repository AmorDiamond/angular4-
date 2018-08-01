import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResearchGuideComponent } from './research-guide.component';
import { DetailPageComponent } from "./detail-page/detail-page.component";

const routes: Routes = [
  {path: '', component: ResearchGuideComponent},
  {path: 'detail', component: DetailPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResearchGuideRoutingModule { }
