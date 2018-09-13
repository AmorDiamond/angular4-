import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactLookupComponent } from './contact-lookup.component';
import { ContactListComponent } from './contact-list/contact-list.component';

const routes: Routes = [
  {path: '', component: ContactLookupComponent},
  {path: 'list', component: ContactListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactLookupRoutingModule { }
