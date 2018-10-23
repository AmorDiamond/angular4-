import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { UploadPageComponent } from './upload-page/upload-page.component';
import { EditIndustryComponent } from './edit-industry/edit-industry.component';
import { ListComponent } from './list/list.component';
import { AddTypeComponent } from './add-type/add-type.component';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: ListComponent},
  {path: 'editIndustry/:id', component: EditIndustryComponent},
  // {path: 'uploadIndustry', component: UploadPageComponent},
  {path: 'addType', component: AddTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryManageRoutingModule { }
