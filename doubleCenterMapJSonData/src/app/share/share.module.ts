import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDirective } from "./scroll/scroll.directive";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EnterpriseListComponent } from "../pages/common/enterprise-list/enterprise-list.component";
import { EnterpriseDetailComponent } from "../pages/common/enterprise-detail/enterprise-detail.component";
import { PaginationComponent } from './pagination/pagination.component';
import { FormsModule }   from '@angular/forms';
import { LoadingComponent } from './loading/loading.component';
import { FullLoadingComponent } from './full-loading/full-loading.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    HttpClientModule,
    ScrollDirective,
    EnterpriseListComponent,
    EnterpriseDetailComponent,
    PaginationComponent,
    FormsModule,
    LoadingComponent,
    FullLoadingComponent
  ],
  declarations: [ScrollDirective, EnterpriseListComponent, EnterpriseDetailComponent, PaginationComponent, LoadingComponent, FullLoadingComponent]
})
export class ShareModule { }
