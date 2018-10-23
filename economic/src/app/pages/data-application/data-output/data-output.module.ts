import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DataOutputRoutingModule } from './data-output-routing.module';
import { DataOutputComponent } from './data-output.component';
import { TreeModule } from 'primeng/tree';
import { OutputPageComponent } from './output-page/output-page.component';

@NgModule({
  imports: [
    CommonModule,
    DataOutputRoutingModule,
    SharedModule,
    TreeModule,
  ],
  declarations: [DataOutputComponent, OutputPageComponent]
})
export class DataOutputModule { }
