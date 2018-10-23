import { Component, OnInit } from '@angular/core';
import { LoginService, LoginParams } from './login.service';
import { Router } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce } from 'ng-animate';
import { Store } from '@ngrx/store';
import { CHANGE } from '../../core/loading-ngrx/loading.action';
import { LoadingShow } from '../../core/loading-ngrx/loading.model';
import { LayoutService } from '../layout/layout.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService],
  animations: [
    trigger('bounce', [transition('* => *', useAnimation(bounce))])
  ],
})
export class LoginComponent implements OnInit {

  bounce: any;
  username = 'test';
  password = 'test123456';
  constructor(
    private loginService: LoginService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private router: Router,
    private store: Store<LoadingShow>,
    private layoutService: LayoutService,
    private http: HttpClient
  ) {
    this.toastyConfig.theme = 'material';
  }

  ngOnInit() {
  }

  login() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        show: true
      }
    });
    console.log({ username: this.username, password: this.password });
    const params = {
      username: this.username,
      password: this.password
    };
    sessionStorage.setItem('hasLogin', 'YES');
    sessionStorage.setItem('userId', '1');
    sessionStorage.setItem('userRole', 'ADMIN');
    /*退出登录重新处理权限*/
    this.layoutService.getAccessData();
    this.router.navigate(['mic']);
    /*this.loginService.login(params)
      .subscribe((res: any) => {
        console.log(res)
        if (res.responseCode === '_200') {
          sessionStorage.setItem('hasLogin', 'YES');
          sessionStorage.setItem('userId', res.data.id);
          sessionStorage.setItem('userRole', res.data.role[0].name);
          /!*退出登录重新处理权限*!/
          this.layoutService.getAccessData();
          this.store.dispatch({
            type: CHANGE,
            payload: {
              show: false
            }
          });
          /!*登录跳转偏好设置页面*!/
          if (res.data.preferenceType) {
            let defaultPage = res.data.preferenceType;
            sessionStorage.setItem('userDefaultPage', defaultPage);
            let viewPage;
            switch (defaultPage) {
              case 'MICROSCOPIC':
                viewPage = 'mic'; // 微观
                break;
              case 'MESO':
                viewPage = 'int'; // 中观
                break;
              case 'Macro':
                viewPage = 'mac'; // 宏观
                break;
              case 'MANAGEMENT':
                viewPage = 'admin'; // 管理端
                break;
              default:
                viewPage = 'mic';
            }

            this.router.navigate([viewPage]);
            return;
          }
          this.router.navigate(['mic']);
          // this.noty.alert({
          //   text: 'welcome!'
          // });
        } else {
          // this.noty.alert({
          //   text: res.errorMsg
          // });
          this.store.dispatch({
            type: CHANGE,
            payload: {
              show: false
            }
          });
          this.addToast(res.errorMsg);
        }
      }
      /!*, err => {
        this.addToast(err.error.message);
        console.log('LOGIN_ERROR::', err.error.message);
      }*!/
      );*/
  }

  addToast(msg) {
    // Just add default Toast with title only
    // this.toastyService.default('Hi there');
    // Or create the instance of ToastOptions
    const toastOptions: ToastOptions = {
      title: '错误',
      msg: msg,
      showClose: true,
      timeout: 5000,
      // theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }

}
