import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MacroscopicComponent } from '../macroscopic.component';
import { ForecastComponent } from '../forecast/forecast.component';
import { ForecastResultComponent } from '../forecast/forecast-result/forecast-result.component';

export const routes: Routes = [
  {
    path: '',
    component: MacroscopicComponent,
    children: [
      { path: 'economic', loadChildren: '../mac-economic/mac-economic.module#MacEconomicModule' },
      {
        path: 'forecast',
        component: ForecastComponent,
      },
      {path: 'forecast/result', component: ForecastResultComponent},
      { path: '', redirectTo: 'economic', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class MacroscopicRoutingModule { }
