import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../../shared/shared.module";
import { DataOutputRoutingModule } from './data-output-routing.module';
import { DataOutputComponent } from './data-output.component';

@NgModule({
  imports: [
    CommonModule,
    DataOutputRoutingModule,
    SharedModule
  ],
  declarations: [DataOutputComponent]
})
export class DataOutputModule { }
