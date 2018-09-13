import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';
import { NgUploaderModule } from 'ngx-uploader';
import { IndustryManageRoutingModule } from './industry-manage-routing.module';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { EditIndustryComponent } from './edit-industry/edit-industry.component';
import { ListComponent } from './list/list.component';
import { IndustryManagersService } from './industry-managers.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgUploaderModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    IndustryManageRoutingModule
  ],
  providers: [IndustryManagersService],
  declarations: [UploadPageComponent, EditIndustryComponent, ListComponent]
})
export class IndustryManageModule { }
