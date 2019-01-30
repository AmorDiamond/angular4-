import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }
  private findUsersList = '/v1/user/getByCondition';
  private disableOrUsableUrl = '/v1/user/disableOrUndisable';
  private editPasswordUrl = '/v1/user/updatePassword';
  private updateUserUrl = '/v1/user/update';
  private createUserUrl = '/v1/user/create';
  // 获取用户拥有的角色
  private findRolesUrl = '/v1/roles/findRolesById';
  // 给用户绑定角色
  private bindRolesUrl = '/v1/roles/bindRolesForLdapNode';
  // 给用户解绑角色
  private unbindRolesUrl = '/v1/roles/unbindRolesForLdapNode';
  // 获取所有角色列表（给admin账号使用）
  private getAllRolesUrl = '/v1/roles/all';

  /*网络请求方法*/
  requestByParams(findParams, http, type?, postType?): Observable<any> {
    let paramsString = '';
    const url = this[http];
    const requestType = type ? type : 'get';
    let params;
    if (requestType === 'get' || requestType === 'delete') {
      for (const key in findParams) {
        if (findParams.hasOwnProperty(key)) {
          paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
        }
      }
      params = {params: new HttpParams({ fromString: paramsString })};
    }
    if (requestType === 'patch') {
      /*params = new HttpParams();
      params.set('id', findParams.id);
      params.set('flag', findParams.flag);*/
      params = new HttpParams().set('id', findParams.id).set('flag', findParams.flag);
    }
    if (requestType === 'post') {
      if (postType && postType === 'object') {
        params = findParams;
      } else {
        const formData: FormData = new FormData();
        for (const item in findParams) {
          if (item) {
            formData.append(`${item}`, findParams[item]);
          }
        }
        // params = new HttpParams().set('companyName', findParams.companyName).set('content', findParams.content);
        params = formData;
      }
    }
    return this.http[requestType](url, params);
  }
  /*网络请求方法*/
  patchRequestByParams(findParams, http): Observable<any> {
    const url = this[http];
    let params;
    if (http === 'disableOrUsableUrl') {
      /*params = new HttpParams();
      params.set('id', findParams.id);
      params.set('flag', findParams.flag);*/
      params = new HttpParams().set('id', findParams.id).set('flag', findParams.flag);
    }
    if (http === 'updateUserUrl') {
      params = findParams;
      // params = new HttpParams().set('account', findParams.account).set('userName', findParams.userName).set('password', findParams.password);
    }
    return this.http.patch(url, params);
  }

  /*通过多个请求获取数据*/
  getRequestByForkJoin(options): Observable<any> {
    const forkJoinArr = [];
    const requestTimes = options;
    if (requestTimes.length > 0) {
      for (let i = 0; i < requestTimes.length; i++) {
        const params = requestTimes[i].findParams;
        let paramsString = ``;
        for (const key in params) {
          if (params.hasOwnProperty(key) && params[key]) {
            paramsString += params[key] ? `${key}=${params[key]}&` : '';
          }
        }
        const PARAMS = new HttpParams({ fromString: paramsString });
        const post = this.http.get(`${this[requestTimes[i].url]}`, { params: PARAMS });
        forkJoinArr.push(post);
      }
    }
    return forkJoin(forkJoinArr);
  }
  /*解绑和绑定用户角色*/
  postRequestByForkJoin(options): Observable<any> {
    const forkJoinArr = [];
    const requestTimes = options;
    if (requestTimes.length > 0) {
      for (let i = 0; i < requestTimes.length; i++) {
        const requestParams = requestTimes[i].params;
        // params = new HttpParams().set('companyName', findParams.companyName).set('content', findParams.content);
        const params = new HttpParams().set('roleIds', requestParams.roleIds).set('ldapNodeId', requestParams.ldapNodeId);
        const post = this.http.post(`${this[requestTimes[i].url]}`, params);
        forkJoinArr.push(post);
      }
    }
    return forkJoin(forkJoinArr);
  }
}
