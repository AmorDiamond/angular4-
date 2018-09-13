import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExcelImportComponent } from './excel-import/excel-import.component';
import { RolesComponent } from './roles/roles.component';
import { ManageSystemComponent } from './manage-system.component';
import { RoleManageComponent } from './roles/role-manage/role-manage.component';
import { FunctionManageComponent } from './roles/function-manage/function-manage.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { FunctionListComponent } from './roles/function-list/function-list.component';
import { UsersComponent } from './users/users.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserManageComponent } from './users/user-manage/user-manage.component';
import { EditRoelsComponent } from './users/edit-roles/edit-roels.component';
import { LogsManageComponent } from './logs-manage/logs-manage.component';

const routes: Routes = [
  {
    path: '',
    component: ManageSystemComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'import', component: ExcelImportComponent },
      {
        path: 'roles',
        component: RolesComponent,
        children: [
          { path: '', redirectTo: 'rolesList', pathMatch: 'full' },
          { path: 'rolesList', component: RolesListComponent },
          { path: 'roleManage/:id', component: RoleManageComponent },
          { path: 'function', component: FunctionListComponent },
          { path: 'functionManage/:id', component: FunctionManageComponent },
          { path: '**', redirectTo: 'rolesList', pathMatch: 'full' }
        ]
      },
      {
        path: 'users',
        component: UsersComponent,
        children: [
          { path: '', redirectTo: 'usersList', pathMatch: 'full' },
          { path: 'usersList', component: UserListComponent },
          { path: 'userManage/:id', component: UserManageComponent },
          { path: 'editRoles/:id', component: EditRoelsComponent },
          { path: '**', redirectTo: 'usersList', pathMatch: 'full' }
        ]
      },
      {path: 'mechanismManege', loadChildren: './mechanism-manage/mechanism-manage.module#MechanismManageModule'},
      {path: 'category', loadChildren: './register-trade-category/register-trade-category.module#RegisterTradeCategoryModule'},
      {path: 'logsManage', component: LogsManageComponent},
      /*{
        path: 'project-declaration',
        loadChildren:
          './project-declaration/project-declaration.module#ProjectDeclarationModule'
      },
      {
        path: 'eqi-hi-tech-certification',
        loadChildren:
          './eqi-hi-tech-certification/eqi-hi-tech-certification.module#EqiHiTechCertificationModule'
      },
      {
        path: 'scale-library',
        loadChildren: './scale-library/scale-library.module#ScaleLibraryModule'
      },*/
      {path: 'formManager', loadChildren: './form-managers/form-managers.module#FormManagersModule'},
      {path: 'industryManage', loadChildren: './industry-manage/industry-manage.module#IndustryManageModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSystemRoutingModule {}
