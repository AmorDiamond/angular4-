import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { LayoutComponent } from '../pages/layout/layout.component';
import { CanAuthProvide } from '../core/can-auth-povider/can-auth-povider';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: 'mic', loadChildren: '../pages/microcosmic/microcosmic.module#MicrocosmicModule', data: {title: 'Home-Liu'}},
      {path: 'int', loadChildren: '../pages/intermediate/intermediate.module#IntermediateModule'},
      {path: 'mac', loadChildren: '../pages/macroscopic/macroscopic.module#MacroscopicModule'},
      {path: '', redirectTo: 'mic', pathMatch: 'full'}
    ],
    canActivate: [CanAuthProvide]
  },
  {path: 'admin', loadChildren: '../pages/manage-system/manage-system.module#ManageSystemModule', canLoad: [CanAuthProvide]},
  // {path: '**', redirectTo: 'login', pathMatch: 'full'}
  {path: '**', redirectTo: 'mic', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [
    RouterModule
  ],
  providers: [CanAuthProvide]
})
export class AppRoutingModule { }
