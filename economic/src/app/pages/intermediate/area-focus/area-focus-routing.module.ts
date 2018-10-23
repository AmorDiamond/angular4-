import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AreaFocusComponent } from './area-focus.component';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { AreaOverviewComponent } from './area-overview/area-overview.component';

import { ScaleComponent } from './area-overview/scale/scale.component';
import { EconomyComponent } from './area-overview/economy/economy.component';
import { OtherComponent } from './area-overview/other/other.component';


const routes: Routes = [

  //ok
  // { path: '', component: AreaFocusComponent },
  // {
  //   path: 'typeInfo', component: MenuLayoutComponent, children: [
  //     {
  //       path: '', component: AreaOverviewComponent
  //     }
  //   ]
  // },
  
  
  { path: '', component: AreaFocusComponent },
  {
    path: 'nav', component: MenuLayoutComponent, children: [
      // {
      //   path: '', component: AreaOverviewComponent, children: [
          { path: '', component: AreaOverviewComponent },
          { path: 'scale', component: ScaleComponent },
          { path: 'economy', component: EconomyComponent },
          { path: 'other', component: OtherComponent },
        ]
    //   }
    // ]
  },
  

  // {
  //   path: '', component: AreaFocusComponent, children: [
  //     {
  //       path: 'nav', component: MenuLayoutComponent, children: [
  //         { path: 'scale', component: 'ScaleComponent' },
  //         { path: 'economy', component: 'EconomyComponent' },
  //         { path: 'other', component: 'OtherComponent' },
  //       ]
  //     }
  //   ]
  // },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaFocusRoutingModule { }
