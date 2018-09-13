import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { ScrollbarComponent } from './scroll-bar/scrollbar.component';
import { LoadingLayerDirective } from './loading-layer/loading-layer.directive';
import { LoadingLayerComponent } from './loading-layer/loading-layer.component';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    FormsModule
  ],
  exports: [
    NgxEchartsModule,
    FormsModule,
    ScrollbarComponent,
    LoadingLayerComponent
  ],
  declarations: [ScrollbarComponent, LoadingLayerDirective, LoadingLayerComponent]
})
export class ShareModule { }
