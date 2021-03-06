import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataApplicationComponent } from './data-application.component';
import { DataApplicationRoutingModule } from './data-application-routing.module';
import { DetailPageComponent } from './research-guide/detail-page/detail-page.component';
import { ContactDetailPageComponent } from './contact-lookup/detail-page/detail-page.component';
import { RecommendListComponent } from './quality-recommend/recommend-list/recommend-list.component';
import { SharedModule } from '../../shared/shared.module';
import { DataApplicationService } from './data-application.service';
import { SearchListComponent } from './data-output/search-list/search-list.component';
import { PaginationModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    DataApplicationRoutingModule,
    PaginationModule.forRoot(),
    SharedModule
  ],
  declarations: [DataApplicationComponent, DetailPageComponent, ContactDetailPageComponent, RecommendListComponent, SearchListComponent],
  providers: [DataApplicationService]
})
export class DataApplicationModule { }
