import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataOutputComponent } from './data-output.component';

const routes: Routes = [
  {path: '', component: DataOutputComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataOutputRoutingModule { }
