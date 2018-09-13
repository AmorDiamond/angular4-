import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ManageSystemRoutingModule } from './manage-system-routing.module';
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
import { PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ToastyModule } from 'ng2-toasty';
import { ToastModalService } from '../../shared/toast-modal/toast-modal.service';
import { LogsManageComponent } from './logs-manage/logs-manage.component';
import { FormManagersComponent } from './form-managers/form-managers.component';

@NgModule({
  imports: [
    CommonModule,
    ManageSystemRoutingModule,
    FormsModule,
    SharedModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot()
  ],
  declarations: [
    ExcelImportComponent,
    RolesComponent,
    ManageSystemComponent,
    RoleManageComponent,
    FunctionManageComponent,
    RolesListComponent,
    FunctionListComponent,
    UsersComponent,
    UserListComponent,
    UserManageComponent,
    EditRoelsComponent,
    LogsManageComponent,
    FormManagersComponent
  ],
  providers: [ToastModalService]
})
export class ManageSystemModule { }
