import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class IndustryMapFenbuService {
  private subjectParkIndustry = new BehaviorSubject<any>(0);
  private subjectLeadIndustry = new BehaviorSubject<any>(0);
  private subjectNewIndustry = new BehaviorSubject<any>(0);
  private subjectCustomizeIndustry = new BehaviorSubject<any>(0);
  /*根据年份和功能区名称查询功能区的企业当年的注册资本和当年的企业数量，职工总数*/
  private industryMapFunctionAreaMenuUrl = '/v1/IndustrydepController/findIndustryType';
  /*主导产业重点企业、全球100强*/
  private industryMapLeadIndustryMenuUrl = '/v1/IndustrydepController/findLeadingIndustryDistribution';
  /*主导产业经济规模*/
  private industryMapLeadIndustryEcoUrl = '/v1/eIIApAssets/findClassificationOutputValue';
  /*功能区企业分布*/
  private industryMapFenbuUrl = '/v1/IndustrydepController/findFunctionalAreaEnterpriseDistribution';
  /*功能区注册资金*/
  private industryMapRegistMoneyUrl = '/v1/IndustrydepController/findFunctionalAreafunds';
  /*功能区职工总数*/
  private industryMapWorkerTotalUrl = '/v1/IndustrydepController/findFunctionalAreaNumber';
  constructor(private http: HttpClient) { }

  changeSelectParkIndustry(options) {
    this.subjectParkIndustry.next({options});
  }
  getSelectParkIndustry(): Observable<any> {
    return this.subjectParkIndustry.asObservable();
  }
  changeSelectLeadIndustry(options) {
    this.subjectLeadIndustry.next({options});
  }
  getSelectLeadIndustry(): Observable<any> {
    return this.subjectLeadIndustry.asObservable();
  }
  changeSelectNewIndustry(options) {
    this.subjectNewIndustry.next({options});
  }
  getSelectNewIndustry(): Observable<any> {
    return this.subjectNewIndustry.asObservable();
  }
  changeSelectCustomizeIndustry(options) {
    this.subjectCustomizeIndustry.next({options});
  }
  getSelectCustomizeIndustry(): Observable<any> {
    return this.subjectCustomizeIndustry.asObservable();
  }
  getDataByParams(findParams, url, type?): Observable<any> {
    let paramsString = '';
    const requestUrl = this[url];
    const requestType = type ? type : 'get';
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http[requestType](requestUrl, { params });
  }
  /*通过多个请求获取数据*/
  getRequestByForkJoin(options: Array<any>): Observable<any> {
    const data = options;
    const forkJoinArr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let paramsString = '';
        const findParams = data[i].findParams;
        const requestUrl = data[i].url;
        for (const key in findParams) {
          if (findParams.hasOwnProperty(key)) {
            paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
          }
        }
        const params = new HttpParams({ fromString: paramsString });
        let post = this.http.get(`${this[requestUrl]}`, {params});
        forkJoinArr.push(post);
      }
    }
    return Observable.forkJoin(forkJoinArr);
  }
}
