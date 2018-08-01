import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { PaginationModule } from './pagination/pagination.module';
import { ScrollbarComponent } from './scrollbar.component';
import { LoadingModule } from './loading/loading.module';
import { FormsModule } from '@angular/forms';
import { PopoverModule, BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    PaginationModule,
    LoadingModule,
    BsDatepickerModule.forRoot(),
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
    BsDatepickerModule
  ],
  declarations: [ScrollbarComponent]
})
export class SharedModule { }
