import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MechanismManageComponent } from './mechanism-manage.component';

const routes: Routes = [
  {path: '', component: MechanismManageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MechanismManageRoutingModule { }
