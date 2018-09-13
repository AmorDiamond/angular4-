import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-edit-roels',
  templateUrl: './edit-roels.component.html',
  styleUrls: ['./edit-roels.component.css']
})
export class EditRoelsComponent implements OnInit {

  constructor(private router: Router, private routeInfo: ActivatedRoute, private http: HttpClient,
              private toastModalService: ToastModalService) { }
  ldapName: any;
  ldapNodeType: any;
  ldapNodeTypes = [{label: '政府机构', value: 1}, {label: '普通机构', value: 2}];
  userRoles = [];
  editHasRoles = [];
  editUserId: any;
  loginUserId: any;
  bindUserRoleParams = {url: '/manager/v1/roles/bindRolesForLdapNode', method: 'post'};
  unbindUserRoleParams = {url: '/manager/v1/roles/unbindRolesForLdapNode', method: 'post'};
  getUserDetailParams = {url: '/manager/v1/ldapUser/findById', method: 'get'};
  getUserRolesParams = {url: '/manager/v1/roles/findLdapRolesById', method: 'get'};
  getAllRolesParams = {url: '/manager/v1/roles/all', method: 'get'};
  ngOnInit() {
    this.routeInfo.params.subscribe((params: ParamMap) => {
      if (params['id'] !== '-1') {
        this.getUserDetail(params['id']);
        this.editUserId = params['id'];
        this.loginUserId = sessionStorage.getItem('userId');
        this.getUserRoles();
      }
    });
  }
  getUserDetail(userId) {
    const url = this.getUserDetailParams.url;
    this.http.get(url + '?id=' + userId ).subscribe((res: any) => {
      this.ldapName = res.data.account;
      this.ldapNodeType = res.data.type;
    });
  }
  /*获取登录用户拥有的角色*/
  getUserRoles() {
    const url = this.getUserRolesParams.url;
    this.http.get(url + '?id=' + this.loginUserId ).subscribe((res: any) => {
      if (res.responseCode === '_200') {
        const data = res.data;
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === 1 || data[i].id === '1') {
            this.http.get(this.getAllRolesParams.url).subscribe((result: any) => {
              this.getUserHasRoles(result.data);
            });
          }
        }
      }
    });
  }
  /*获取编辑用户已拥有的角色*/
  getUserHasRoles(options) {
    const url = this.getUserRolesParams.url;
    this.http.get(url + '?id=' + this.editUserId ).subscribe((res: any) => {
      options.forEach((v, i) => {
        v.hasChecked = false;
        res.data.forEach((item, index) => {
          if (item.id === v.id) {
            v.hasChecked = true;
            this.editHasRoles.push(v);
          }
        });
        this.userRoles.push(v);
      });
    });
  }
  onSubmit() {
    const bindRoleIds = [];
    const unbindRoleIds = [];
    this.userRoles.forEach((v, i) => {
      if (v.hasChecked) {
        if (this.editHasRoles.length > 0) {
          this.editHasRoles.forEach((item, index) => {
            if (v.id !== item.id) {
              bindRoleIds.push(v.id);
            }
          });
        }else {
          bindRoleIds.push(v.id);
        }
      }else {
        this.editHasRoles.forEach((item, index) => {
          if (v.id === item.id) {
            unbindRoleIds.push(v.id);
          }
        });
      }
    });
    this.bindRoles(bindRoleIds, unbindRoleIds);
  }
  /*绑定和解绑角色*/
  bindRoles(bindIds, unbindIds) {
    const bindurl = this.bindUserRoleParams.url;
    const unbindurl = this.unbindUserRoleParams.url;
    const bindHttp = this.http.post(bindurl, new HttpParams().set('roleIds', bindIds).set('ldapNodeId', this.editUserId), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
    const unbindHttp = this.http.post(unbindurl, new HttpParams().set('roleIds', unbindIds).set('ldapNodeId', this.editUserId), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
    if (bindIds.length > 0 && unbindIds.length > 0) {
      /*有解绑和绑定*/
      Observable.forkJoin([bindHttp, unbindHttp])
        .subscribe(results => {
          /*检测有无请求出错*/
          for (let i = 0; i < results.length; i++) {
            const data: any = results[i];
            if (data.responseCode !== '_200') {

              this.toastModalService.showErrorToast({errorMsg: data.errorMsg});
              return;
            }
          }
          /*所有请求都成功*/

          this.toastModalService.showSuccessToast({tipsMsg: '操作成功！', router: 'admin/users/userList'});
        }, err => {

          this.toastModalService.showErrorToast({errorMsg: err.errorMsg});
        });
    }else if (bindIds.length > 0) {
      /*只有绑定*/
      bindHttp.subscribe((res: any) => {
        if (res.responseCode === '_200') {
          this.toastModalService.showSuccessToast({tipsMsg: '操作成功！', router: 'admin/users/userList'});
        }else {

          this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
        }
      });
    }else {
      /*只有解绑*/
      unbindHttp.subscribe((res: any) => {
        if (res.responseCode === '_200') {

          this.toastModalService.showSuccessToast({tipsMsg: '操作成功！', router: 'admin/users/userList'});
        }else {

          this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
        }
      });
    }
  }

}
