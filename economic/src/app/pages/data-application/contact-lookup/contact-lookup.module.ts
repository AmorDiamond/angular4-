import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../../shared/shared.module";
import { ContactLookupRoutingModule } from './contact-lookup-routing.module';
import { ContactLookupComponent } from './contact-lookup.component';
import { DetailPageComponent } from './detail-page/detail-page.component';

@NgModule({
  imports: [
    CommonModule,
    ContactLookupRoutingModule,
    SharedModule
  ],
  declarations: [ContactLookupComponent, DetailPageComponent]
})
export class ContactLookupModule { }
