import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';


@Injectable()
export class IndustryMenuService {
  constructor(private http: HttpClient) { }
  /*企业分布*/
  private enterpriseFenbuUrl = '/v1/IndustrydepController/findBusinessDistribution';
  /*经济规模*/
  private enterpriseScaleUrl = '/v1/IndustrydepController/findEconomic';
  /*企业结构-企业数量*/
  private enterpriseJiegouUrl = '/v1/IndustrydepController/findCompanycountmap';
  /*企业结构-企业流失量*/
  private enterpriseJiegouLoseRateUrl = '/v1/IndustrydepController/findLossRateMap';
  /*主导服务业100*/
  private enterpriseLeadIndustry100Url = '/v1/IndustrydepController/findServiceIndustryTop';
  /*先进制造业*/
  private enterpriseAdvancedManufacturingUrl = '/v1/IndustrydepController/findIncomemap';

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
}
