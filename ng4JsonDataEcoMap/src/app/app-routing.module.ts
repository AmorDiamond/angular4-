import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'land', pathMatch: 'full'},
  {path: 'land', loadChildren: './land/land.module#LandModule'},
  {path: 'industry', loadChildren: './industry/industry.module#IndustryModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
