import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DataOutputRoutingModule } from './data-output-routing.module';
import { DataOutputComponent } from './data-output.component';
import { PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    DataOutputRoutingModule,
    SharedModule,
    PaginationModule.forRoot(),
  ],
  declarations: [DataOutputComponent]
})
export class DataOutputModule { }
