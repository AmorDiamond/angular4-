import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { UploadComponent } from './upload/upload.component';
import { NgUploaderModule } from 'ngx-uploader';
import { RoutingModule } from './routing/routing.module';
import { ToastyModule } from 'ng2-toasty';
import { ProjectDeclarationComponent } from './project-declaration.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    NgUploaderModule,
    SharedModule,
    ToastyModule
  ],
  declarations: [ListComponent, UploadComponent, ProjectDeclarationComponent]
})
export class ProjectDeclarationModule {}
