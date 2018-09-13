import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { EditIndustryComponent } from './edit-industry/edit-industry.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: ListComponent},
  {path: 'editIndustry/:name', component: EditIndustryComponent},
  {path: 'uploadIndustry', component: UploadPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryManageRoutingModule { }
