import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactLookupComponent } from './contact-lookup.component';
import { DetailPageComponent } from './detail-page/detail-page.component';

const routes: Routes = [
  {path: '', component: ContactLookupComponent},
  {path: 'detail', component: DetailPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactLookupRoutingModule { }
