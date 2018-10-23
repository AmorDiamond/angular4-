import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataOutputComponent } from './data-output.component';
import { OutputPageComponent } from './output-page/output-page.component';

const routes: Routes = [
  {path: '', component: DataOutputComponent},
  {path: 'outputPage', component: OutputPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataOutputRoutingModule { }
