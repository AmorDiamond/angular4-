import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-router/app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { LayoutComponent } from './pages/layout/layout.component';
import { ListComponent } from './pages/user/list/list.component';
import { HeadComponent } from './pages/layout/head/head.component';
import { SiderComponent } from './pages/layout/sider/sider.component';
import { FilterComponent } from './pages/user/list/components/filter/filter.component';
import { EditModalComponent } from './pages/user/list/components/edit-modal/edit-modal.component';
import { ShareModule } from './share/share.module';
import { LoginComponent } from './pages/passport/login/login.component';
import { SetrolesModalComponent } from './pages/user/list/components/setroles-modal/setroles-modal.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ListComponent,
    HeadComponent,
    SiderComponent,
    FilterComponent,
    EditModalComponent,
    LoginComponent,
    SetrolesModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ShareModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  entryComponents: [EditModalComponent, SetrolesModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
