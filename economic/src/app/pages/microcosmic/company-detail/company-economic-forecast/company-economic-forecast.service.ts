import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class CompanyEconomicForecastService {
  companyRowkey: any;
  /*发展指标预测信息列表.*/
  private companyDevelopForecastUrl = '/v1/FEIProspects/findEnterpriseDeveloping';
  /*规模预测信息列表*/
  private companyScaleForecastUrl = '/v1/FEIProspects/findEnterpriseScale';
  /*营业收入预测信息列表*/
  private companyIncomeForecastUrl = '/v1/FEIProspects/findOperatingIncome';
  constructor(private http: HttpClient) { }

  findListByCompanyName(findParams, type): Observable<any> {
    let paramsString = '';
    const url = this[type];
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http.get(url, { params });
  }

}
