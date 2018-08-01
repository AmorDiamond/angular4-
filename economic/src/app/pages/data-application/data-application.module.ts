import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataApplicationComponent } from "./data-application.component";

import { DataApplicationRoutingModule } from './data-application-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DataApplicationRoutingModule
  ],
  declarations: [DataApplicationComponent]
})
export class DataApplicationModule { }
