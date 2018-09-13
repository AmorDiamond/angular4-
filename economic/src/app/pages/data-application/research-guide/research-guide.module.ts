import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchGuideRoutingModule } from './research-guide-routing.module';
import { ResearchGuideComponent } from './research-guide.component';
import { SharedModule } from '../../../shared/shared.module';
import { ResearchListComponent } from './research-list/research-list.component';
import { PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ResearchGuideRoutingModule,
    SharedModule,
    PaginationModule.forRoot()
  ],
  declarations: [ResearchGuideComponent, ResearchListComponent]
})
export class ResearchGuideModule { }
