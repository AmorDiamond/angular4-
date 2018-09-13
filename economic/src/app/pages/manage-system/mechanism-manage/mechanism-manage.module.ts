import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { MechanismManageRoutingModule } from './mechanism-manage-routing.module';
import { MechanismManageComponent } from './mechanism-manage.component';
import { MechanismManageService } from './mechanism-manage.service';

@NgModule({
  imports: [
    CommonModule,
    MechanismManageRoutingModule,
    TreeModule
  ],
  providers: [MechanismManageService],
  declarations: [MechanismManageComponent]
})
export class MechanismManageModule { }
