import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private http: HttpClient
  ) { }
  // 角色列表
  private rolesListUrl = '/v1/roles/findByConditions';
  // 禁用角色
  private disableRoleUrl = '/v1/roles/disable';
  // 启用角色
  private enableRoleUrl = '/v1/roles/enable';
  // 添加角色/修改角色
  private addRoleUrl = '/v1/roles/';
  // 获取角色基本信息
  private roleBaseInfoUrl = '/v1/roles/getById';
  // 查询指定的角色已绑定的功能信息
  private roleHasCompetenceUrl = '/v1/competence/findByRoleId';
  // 查询所有的功能列表
  private allCompetence = '/v1/competence/findAllNormal';
  // 给角色绑定权限
  private bindCompetencesUrl = '/v1/roles/bindRoleForCompetences';
  // 给角色解除权限
  private unbindCompetencesUrl = '/v1/roles/unbindRoleForCompetences';
  // 获取功能列表
  private competenceListUrl = '/v1/competence/findByConditions';
  // 禁用/启用功能
  private disableOrUndisableCompetenceUrl = '/v1/competence/disableOrUndisable';
  // 修改功能/新增功能
  private editOrAddcompetence = '/v1/competence/';

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
      if (postType === 'object') {
        params = findParams;
      }
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
  /*修改角色信息patch方法*/
  editRoleInfo (findParams, http) {
    const url = this[http];
    const params = findParams;
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
  /*解绑和绑定角色权限*/
  postRequestByForkJoin(options): Observable<any> {
    const forkJoinArr = [];
    const requestTimes = options;
    if (requestTimes.length > 0) {
      for (let i = 0; i < requestTimes.length; i++) {
        const requestParams = requestTimes[i].params;
        // params = new HttpParams().set('companyName', findParams.companyName).set('content', findParams.content);
        const params = new HttpParams().set('roleId', requestParams.roleId).set('competenceIds', requestParams.competenceIds);
        const post = this.http.post(`${this[requestTimes[i].url]}`, params);
        forkJoinArr.push(post);
      }
    }
    return forkJoin(forkJoinArr);
  }
}
