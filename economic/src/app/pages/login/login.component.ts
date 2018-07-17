import { Component, OnInit } from '@angular/core';
import { LoginService, LoginParams } from './login.service';
import { Router } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce } from 'ng-animate';

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
  username = '';
  password = '';
  constructor(
    private loginService: LoginService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private router: Router
  ) {
    this.toastyConfig.theme = 'material';
  }

  ngOnInit() {
  }

  login() {
    console.log({ username: this.username, password: this.password });
    const params = {
      username: this.username,
      password: this.password
    };

    this.loginService.login(params)
      .subscribe((res: any) => {
        if (res.responseCode === '_200') {
          sessionStorage.setItem('hasLogin', 'YES');
          this.router.navigate(['mic']);
          // this.noty.alert({
          //   text: 'welcome!'
          // });
        } else {
          // this.noty.alert({
          //   text: res.errorMsg
          // });
          this.addToast(res.errorMsg);
        }
      }, err => {
        this.addToast(err.error.message);
        console.log('LOGIN_ERROR::', err.error.message);
      });
  }

  addToast(msg) {
    // Just add default Toast with title only
    // this.toastyService.default('Hi there');
    // Or create the instance of ToastOptions
    const toastOptions: ToastOptions = {
      title: '错误',
      msg: msg,
      showClose: true,
      timeout: 10000,
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
