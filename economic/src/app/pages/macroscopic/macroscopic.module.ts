import { NgModule } from '@angular/core';
import { MacroscopicComponent } from './macroscopic.component';
import { SharedModule } from '../../shared/shared.module';
import { MacroscopicRoutingModule } from './macroscopic-routing/macroscopic-routing.module';
import { ForecastComponent } from './forecast/forecast.component';
import { ForecastResultComponent } from './forecast/forecast-result/forecast-result.component';
import { ForecastResultService } from './forecast/forecast-result/forecast-result.service';

@NgModule({
  imports: [
    SharedModule,
    MacroscopicRoutingModule
  ],
  declarations: [
    MacroscopicComponent,
    ForecastComponent,
    ForecastResultComponent,
  ],
  providers: [
    ForecastResultService
  ]
})
export class MacroscopicModule { }
