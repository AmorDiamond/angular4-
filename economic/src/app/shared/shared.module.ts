import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { PaginationModule } from './pagination/pagination.module';
import { ScrollbarComponent } from './scrollbar.component';
import { LoadingModule } from './loading/loading.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    PaginationModule,
    LoadingModule
  ],
  exports: [
    CommonModule,
    NgxEchartsModule,
    PaginationModule,
    LoadingModule,
    ScrollbarComponent,
    FormsModule
  ],
  declarations: [ScrollbarComponent]
})
export class SharedModule { }
