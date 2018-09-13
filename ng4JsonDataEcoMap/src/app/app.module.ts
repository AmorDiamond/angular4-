import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MapModule } from './map/map.module';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { amapReducer } from './core/store-ngrx/amap.reducer';
import { ContainerReducer } from './core/container-ngrx/contsiner.reducer';
import { amapReducer2 } from './core/map-obj-ngrx/amap.reducer';
import { LandServiceService } from './land/land-service.service';
import { ShareModule } from './share/share.module';
import { loadingLayerReducer } from './core/loading-layer-ngrx/loading-layer.reducer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MapModule,
    HttpClientModule,
    ShareModule,
    StoreModule.forRoot({ amap: amapReducer, container: ContainerReducer, gaodeMap: amapReducer2, loadingLayer: loadingLayerReducer })
  ],
  providers: [LandServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
