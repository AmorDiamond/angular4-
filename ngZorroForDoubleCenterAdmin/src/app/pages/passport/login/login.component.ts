import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  username = 'admin';
  password = '123456';
  isLoading = false;
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    this.username = this.validateForm.value.username;
    this.password = this.validateForm.value.password;
    if (!this.username && !this.password) {
      this.message.error('请输入账号和密码！');
    } else if (!this.username) {
      this.message.error('请输入登录账号！');
    } else if (!this.password) {
      this.message.error('请输入登录密码！');
    } else {
      this.login();
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [ this.username, [ Validators.required ] ],
      password: [ this.password, [ Validators.required ] ],
      remember: [ true ]
    });
  }
  login () {
    this.isLoading = true;
    const url = '/login';
    const params = new HttpParams().set('username', this.username).set('password', this.password);
    /*this.http.post(url, params, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      // params: new HttpParams().set('username', data.username).set('password', data.password),
    }).subscribe((res: any) => {*/
    this.http.post(url, params).subscribe((res: any) => {
      if (res.responseCode === '_200') {
        sessionStorage.setItem('userId', res.data.id);
        sessionStorage.setItem('login', 'true');
        this.router.navigate(['/user']);
      } else {
        this.message.error(res.errorMsg);
      }
      this.isLoading = false;
    });
  }
}
