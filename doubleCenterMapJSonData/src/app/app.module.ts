import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './pages/app-router/app-routing.module';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { mapReducer } from "./core/map-store/map.reducer";
import { LoadingReducer } from "./core/loading-store/loading.reducer";
import { AppComponent } from './app.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { LayoutNavComponent } from './pages/layout/layout-nav/layout-nav.component';
import { MapComponent } from './core/map/map.component';
import { ShareModule } from "./share/share.module";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from "./core/http-interceptor/http-interceptor";
import { StartupService } from "./core/startup/startup.service";

export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}
const APPINIT_PROVIDES = [ // startup加载完才bootstrap渲染挂载
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LayoutNavComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({map: mapReducer, loading: LoadingReducer}),
    ShareModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    ...APPINIT_PROVIDES
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
