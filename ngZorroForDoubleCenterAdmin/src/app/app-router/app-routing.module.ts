import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../pages/layout/layout.component';
import { ListComponent } from '../pages/user/list/list.component';
import { LoginComponent } from '../pages/passport/login/login.component';

const routes: Routes = [
  {path: '', component: LayoutComponent , children: [
      {path: 'user', component: ListComponent},
      {path: 'roles', loadChildren: '../pages/roles/roles.module#RolesModule'},
      {path: 'formManage', loadChildren: '../pages/form-manage/form-manage.module#FormManageModule'},
    ]},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
