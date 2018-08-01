import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { MechanismManageRoutingModule } from './mechanism-manage-routing.module';
import { MechanismManageComponent } from './mechanism-manage.component';

@NgModule({
  imports: [
    CommonModule,
    MechanismManageRoutingModule,
    TreeModule
  ],
  declarations: [MechanismManageComponent]
})
export class MechanismManageModule { }
