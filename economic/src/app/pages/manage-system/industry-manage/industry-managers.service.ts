import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class IndustryManagersService {

  private subject = new BehaviorSubject<any>(0);
  private researchSelectedList = [];
  constructor(
    private routerInfo: ActivatedRoute,
    private http: HttpClient,
  ) {}
  /*获取行业类型tree*/
  private ldapTreeUrl = '/manager/v1/mapTree/getJsTree';
  /*导入企业产业类型*/
  // private importExcelIndustry = '/manager/v1/epBaseInfoPojo/importExcelChangeType';
  /*产业类型列表*/
  private getIndustryTypeList = '/manager/v1/epBaseInfoPojo/findIndustryType';
  /*添加产业类型*/
  private addIndustryTypeUrl = '/manager/v1/mapTree/createIndustryClassType';
  /*修改产业类型*/
  private editIndustryTypeUrl = '/manager/v1/mapTree/bindingIndustry';
  /*获取具体产业类型详情*/
  private getIndustryTypeInfoUrl = '/manager/v1/mapTree/getIndustryClassTypeById';
  getSubject() {
    return this.subject.asObservable();
  }
  changeSubject() {
    this.subject.next({});
  }
  /*获取url参数*/
  getUrlParams(option) {
    return this.routerInfo.snapshot.queryParams[option];
  }

  findListByUrl(findParams, url): Observable<any> {
    let paramsString = '';
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http.get(url, { params });
  }
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
      // params = findParams;
      params = new HttpParams().set('name', findParams.name).set('industryTypeIds', findParams.industryTypeIds).set('industryClassTypeId', findParams.industryClassTypeId);
    }
    if (requestType === 'post') {
      if (postType && postType === 'object') {
        params = findParams;
      }else {
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
    console.log(params)
    return this.http[requestType](url, params);
  }
  /*修改产业类型信息*/
  editIndustryBindTypes(findParams, url): Observable<any> {
    const requestUrl = this[url];
    const params = new HttpParams().set('industryClassTypeId', findParams.industryClassTypeId).set('industryTypeIds', findParams.industryTypeIds);
    return this.http.patch(requestUrl, params);
  }
  /*通过多个请求获取数据*/
  getRequestByForkJoin(options: Array<any>, type?): Observable<any> {
    const data = options;
    const forkJoinArr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let paramsString = '';
        const findParams = data[i].findParams;
        const http = data[i].http;
        for (const key in findParams) {
          if (findParams.hasOwnProperty(key)) {
            paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
          }
        }
        const params = new HttpParams({ fromString: paramsString });
        const post = this.http.get(this[http], {params});
        forkJoinArr.push(post);
      }
    }
    return Observable.forkJoin(forkJoinArr);
  }

}
