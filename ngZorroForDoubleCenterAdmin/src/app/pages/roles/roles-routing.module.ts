import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleManageComponent } from './role-manage/role-manage.component';
import { FunctionListComponent } from './function-list/function-list.component';
// import { FunctionManageComponent } from './function-manage/function-manage.component';

const routes: Routes = [
  {path: '', redirectTo: 'roleList', pathMatch: 'full'},
  {path: 'roleList', component: RoleListComponent},
  {path: 'roleManage/:id', component: RoleManageComponent},
  {path: 'functionList', component: FunctionListComponent},
  // {path: 'functionManage/:id', component: FunctionManageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
