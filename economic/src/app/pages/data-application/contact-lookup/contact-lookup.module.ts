import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ContactLookupRoutingModule } from './contact-lookup-routing.module';
import { ContactLookupComponent } from './contact-lookup.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ContactLookupRoutingModule,
    SharedModule,
    PaginationModule.forRoot(),
  ],
  declarations: [ContactLookupComponent, ContactListComponent]
})
export class ContactLookupModule { }
