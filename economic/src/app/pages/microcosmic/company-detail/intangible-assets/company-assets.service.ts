import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CompanyAssetsService {
  companyRowkey: any;
  /*查询相关商标列表*/
  private companyTrademarkListUrl = '/v1/IATrademarkAndPatent/findTrademarkPage';
  // private companyTrademarkListUrl = '/v1/IATrademarkAndPatent/findByRowKey/';
  /*查询相关专利列表*/
  private companyPatentListUrl = '/v1/IATrademarkAndPatent/findPatentPage';
  /*查询相关作品著作权列表*/
  private companyWorksCopyrightUrl = '/v1/IAcopyright/findWorksCopyrightPage';
  /*查询相关软件著作权列表*/
  private companySoftwareCopyrightUrl = '/v1/IAcopyright/findSoftwareCopyrightPage';
  /*查询相关ICP备案列表*/
  private companyIcpListUrl = '/v1/IAIcp/findICPPage';
  /*查询相关域名列表*/
  private companyDomainListUrl = '/v1/IAIcp/findDomainPage';
  constructor(private http: HttpClient) {}

  /*getTrademarkList(company): Observable<any> {
      return this.http.get(`${this.companyTrademarkListUrl + '?enterpriseName=' + company}`);
  }
  getPatentList(company): Observable<any> {
      return this.http.get(`${this.companyPatentListUrl + '?enterpriseName=' + company}`);
  }
  getWorksCopyright(company): Observable<any> {
      return this.http.get(`${this.companyWorksCopyrightUrl + '?enterpriseName=' + company}`);
  }
  getSoftwareCopyright(company): Observable<any> {
      return this.http.get(`${this.companySoftwareCopyrightUrl + '?enterpriseName=' + company}`);
  }
  getIcpList(company): Observable<any> {
      return this.http.get(`${this.companyIcpListUrl + '?enterpriseName=' + company}`);
  }
  getDomainList(company): Observable<any> {
      return this.http.get(`${this.companyDomainListUrl + '?enterpriseName=' + company}`);
  }*/
  getDataList(options, type): Observable<any> {
    console.log(options)
    const url = this[type];
    return this.http.get(`${url}?enterpriseName=${options.companyName}&lastRowKey=${options.lastRowKey}`);
  }
  getDataListByPath(options, type): Observable<any> {
    console.log(options)
    const url = this[type];
    return this.http.get(`${url}${options.rowKey}`);
  }
  findListByCompanyName(findParams, type): Observable<any> {
    const url = this[type];
    let paramsString = '';
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http.get(url, { params });
  }

}
