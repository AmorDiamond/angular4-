import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { StoreModule } from '@ngrx/store';
import { amapReducer } from './core/amap-ngrx/amap.reducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContainerReducer } from './core/container-ngrx/contsiner.reducer';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LayoutService } from './pages/layout/layout.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HasPromissionDirective } from './core/has-promission-directive/has-promission-directive';
import { SharedModule } from './shared/shared.module';
import { LoadingInterceptor } from './core/loading-interceptor/loading-interceptor';
import { LoadingReducer } from './core/loading-ngrx/loading.reducer';
import { ToastyModule } from 'ng2-toasty';
import { ToastModalService } from './shared/toast-modal/toast-modal.service';
import { PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    HasPromissionDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    // PerfectScrollbarModule,
    SharedModule,
    ToastyModule.forRoot(),
    ModalModule.forRoot(),
    StoreModule.provideStore(
      { amap: amapReducer, container: ContainerReducer, loading: LoadingReducer }
    )
  ],
  providers: [
    [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }],
    ToastModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }