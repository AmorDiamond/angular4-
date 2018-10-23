import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';
import { NgUploaderModule } from 'ngx-uploader';
import { TreeModule } from 'primeng/tree';
import { IndustryManageRoutingModule } from './industry-manage-routing.module';
import { EditIndustryComponent } from './edit-industry/edit-industry.component';
import { ListComponent } from './list/list.component';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { IndustryManagersService } from './industry-managers.service';
import { AddTypeComponent } from './add-type/add-type.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgUploaderModule,
    TreeModule,
    NgZorroAntdModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    IndustryManageRoutingModule
  ],
  providers: [IndustryManagersService],
  declarations: [EditIndustryComponent, ListComponent, AddTypeComponent, UploadPageComponent]
})
export class IndustryManageModule { }
