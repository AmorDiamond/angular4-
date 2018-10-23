import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

declare var echarts: any;

@Injectable()
export class TradeBoardService {
  private subject = new BehaviorSubject<any>(0);
  /*产业看板---行业看板首页*/
  private tradeBoardViewUrl = 'assets/jsonData/middle/getIndustryView.json';
  /*先进制造*/
  private tradeManufacturingViewUrl = 'assets/jsonData/middle/getManufacturingView.json';
  /*行业看板---主导服务业*/
  private tradeServiceIndustryViewUrl = 'assets/jsonData/middle/getServiceIndustryView.json';
  constructor(private http: HttpClient) { }

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
      params = findParams;
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
}
