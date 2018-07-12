import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from '../list/list.component';
import { UploadComponent } from '../upload/upload.component';

export const routes: Routes = [
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'upload',
    component: UploadComponent
  },
  {
    path: '**',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  imports: [routing],
  exports: [RouterModule],
  declarations: []
})
export class RoutingModule {}
