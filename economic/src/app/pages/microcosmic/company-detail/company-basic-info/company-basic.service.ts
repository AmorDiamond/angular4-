import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
// import { Subject } from 'rxjs/Subject';

@Injectable()
export class CompanyBasicService {
  companyRowkey: any;
  private companyDetailUrl = '/v1/epBaseInfoPojo/';
  private companyMainStaffUrl = '/v1/epMainStaffPojo/findAll';
  private companyChangeInfoUrl = '/v1/epChangeInfo/findListByCompanyNameec';
  private companyTaxationUrl = '/v1/epTaxationPojo/findListByCompanyName';
  private companyProfileUrl = '/v1/epBaseInfoPojo/findNameAllEpBaseInfo';
  private companySocialSecurityUrl = '/v1/InsuranceInformationPojo';
  /*获取企业联系人姓名、电话、职位*/
  private companyContactPeopleUrl = '/v1/eIIRelationPojo/findGobernmentContactsByCompanyName';
  constructor(private http: HttpClient) {}

  getCompanyDetail(rowkey): Observable<any> {
      return this.http.get(`${this.companyDetailUrl + rowkey}`)
          .map(res => (res));
  }
  getCompanyMainStaff(company): Observable<any> {
      return this.http.get(`${this.companyMainStaffUrl + '?enterpriseName=' + company}`)
          .map(res => (res));
  }
  getCompanyChangeInfo(company): Observable<any> {
      return this.http.get(`${this.companyChangeInfoUrl + '?enterpriseName=' + company}`)
          .map(res => (res));
  }
  getCompanyTaxation(company): Observable<any> {
      return this.http.get(`${this.companyTaxationUrl + '?companyName=' + company}`)
          .map(res => (res));
  }
  getCompanyProfile(company): Observable<any> {
      return this.http.get(`${this.companyProfileUrl + '?enterpriseName=' + company}`);
  }
  getCompanySocialSecurity(company): Observable<any> {
    return this.http.get(`${this.companySocialSecurityUrl}?companyName=${company}`);
  }
  findListByUrl(findParams, type): Observable<any> {
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
