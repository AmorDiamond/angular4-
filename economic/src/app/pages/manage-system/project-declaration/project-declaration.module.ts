import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { UploadComponent } from './upload/upload.component';
import { NgUploaderModule } from 'ngx-uploader';
import { RoutingModule } from './routing/routing.module';
import { ToastyModule } from 'ng2-toasty';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    NgUploaderModule,
    ToastyModule
  ],
  declarations: [ListComponent, UploadComponent]
})
export class ProjectDeclarationModule {}