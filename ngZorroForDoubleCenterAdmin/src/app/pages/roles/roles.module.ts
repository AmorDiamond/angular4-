import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleManageComponent } from './role-manage/role-manage.component';
import { FunctionListComponent } from './function-list/function-list.component';
import { FunctionManageComponent } from './function-manage/function-manage.component';
import { FilterComponent } from './role-list/components/filter/filter.component';
import { ShareModule } from '../../share/share.module';

@NgModule({
  declarations: [RoleListComponent, RoleManageComponent, FunctionListComponent, FunctionManageComponent, FilterComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    ShareModule
  ],
  entryComponents: [FunctionManageComponent]
})
export class RolesModule { }
