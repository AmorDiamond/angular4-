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
  private companyContactPeopleUrl = '/v1/eIIRelationPojo/findListByCompanyName';
  /*纠错企业联系人姓名、职位、联系方式*/
  private changeContactPeopleAllUrl = '/v1/errorInfo/findnameAndphone';
  /*纠错企业通讯地址和联系方式*/
  private changeAdressAndContactUrl = '/v1/errorInfo/findepTelAndAdress';
  /*获取企业自定义标签*/
  private companyCustomLabelUrl = '/v1/iabels/findByName';
  /*添加企业自定义标签*/
  private addCompanyCustomLabelUrl = '/v1/iabels/add';
  /*删除企业自定义标签*/
  private deleteCompanyCustomLabelUrl = '/v1/iabels/del';
  // 名优产品
  private FamousProduct = '/v1/eQIFamousProductPojo/getEQICertificationPojoByCompany';
  /*根据公司名称,获取企业问题*/
  private companyProblemesUrl = '/v1/businessProblemLedger/findListByCompanyName';
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
  addCompanyCustomLabel(company, userid): Observable<any> {
    return this.http.get(`${this.addCompanyCustomLabelUrl}?companyName=${company}&userId=${userid}`);
  }
  changeCompanyConactPeopleUrl(findParams, http, type?): Observable<any> {
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
    if (requestType === 'post') {
      let formData: FormData = new FormData();
      for (let item in findParams) {
        if (item) {
          formData.append(`${item}`, findParams[item]);
        }
      }
      // params = new HttpParams().set('companyName', findParams.companyName).set('content', findParams.content);
      params = formData;
    }
    /*if(type === 'delete') {
      params = {params: new HttpParams().set('iabelID', findParams.iabelID)};
      console.log(1212, params)
    }*/
    return this.http[type](url, params);
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
  findListHasNullByUrl(findParams, type): Observable<any> {
    let paramsString = '';
    const url = this[type];
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += `${key}=${findParams[key]}&`;
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http.get(url, { params });
  }
  findListByTypeAndUrl(findParams, http, type): Observable<any> {
    let paramsString = '';
    const url = this[http];
    let params;
    if (type === 'get' || type === 'delete') {
      for (const key in findParams) {
        if (findParams.hasOwnProperty(key)) {
          paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
        }
      }
      params = {params: new HttpParams({ fromString: paramsString })};
    }
    if (type === 'post') {
      params = new HttpParams().set('companyName', findParams.companyName).set('content', findParams.content);
    }
    /*if(type === 'delete') {
      params = {params: new HttpParams().set('iabelID', findParams.iabelID)};
      console.log(1212, params)
    }*/
    return this.http[type](url, params);
  }
  /*通过多个请求获取数据*/
  getRequestByForkJoin(options: Array<any>): Observable<any> {
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
        let post = this.http.get(`${this[http]}`, {params});
        forkJoinArr.push(post);
      }
    }
    return Observable.forkJoin(forkJoinArr);
  }

}
