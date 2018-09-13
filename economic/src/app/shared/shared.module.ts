import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { PaginationModule } from './pagination/pagination.module';
import { ScrollbarComponent } from './scrollbar.component';
import { LoadingModule } from './loading/loading.module';
import { FormsModule } from '@angular/forms';
import { PopoverModule, BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { TimepickerDirective } from './timepicker/timepicker.directive';
import { AccessControlDirective } from './access-control/access-control.directive';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    PaginationModule,
    LoadingModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot()
  ],
  exports: [
    CommonModule,
    NgxEchartsModule,
    PaginationModule,
    LoadingModule,
    ScrollbarComponent,
    FormsModule,
    PopoverModule,
    TimepickerModule,
    TimepickerDirective,
    AccessControlDirective,
    BsDatepickerModule
  ],
  declarations: [ScrollbarComponent, TimepickerDirective, AccessControlDirective]
})
export class SharedModule { }
