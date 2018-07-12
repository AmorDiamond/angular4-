import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EqiHiTechCertificationComponent } from './eqi-hi-tech-certification.component';
import { ListComponent } from './list/list.component';
import { UploadComponent } from './upload/upload.component';
import { RoutingModule } from './routing/routing.module';
import { FormsModule } from '@angular/forms';
import { NgUploaderModule } from 'ngx-uploader';
import { ToastyModule } from 'ng2-toasty';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    NgUploaderModule,
    ToastyModule
  ],
  declarations: [
    EqiHiTechCertificationComponent,
    ListComponent,
    UploadComponent
  ]
})
export class EqiHiTechCertificationModule {}
