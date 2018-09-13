import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class FormManagersService {

  private subject = new BehaviorSubject<any>(0);
  private researchSelectedList = [];
  constructor(
    private routerInfo: ActivatedRoute,
    private http: HttpClient,
  ) {}
  /*根据年份和地区查询人均收入情况*/
  private peopleIncomeUrl = '/manager/v1/macroPublicAvgincome/findAvgincomeByYear';
  /*根据公司名称,获取资质认证信息*/
  private otherQualificationsUrl = '/manager/v1/eQICertificationPojo/findListByCompanyName';
  private formExcelTempData = {
    localtion: '//data.cdht.gov.cn/download/template_excel/',
    formTorch: '成都高新区火炬统计(表样).xlsx',
    formBuilding: '成都高新区楼宇入驻企业信息汇总(表样).xlsx',
    famousExcellent: '成都高新区名优产品目录(表样).xlsx',
    otherQualifications: '成都高新区其他资格认证(表样).xlsx',
    environmentalProtection: '成都高新区企业环保排污数据(表样).xlsx',
    moveOut: '成都高新区企业迁出名单(表样).xlsx',
    taxData: '成都高新区企业实缴税收信息(表样).xlsx',
    energyConsumption: '成都高新区企业综合能耗数据(表样).xlsx',
    upperScale: '成都高新区上规入库企业信息(表样).xlsx',
    formPraise: '成都高新区政府表彰信息(表样).xlsx',
    formStansBy: '成都高新区政府支持情况(表样).xlsx',
    macroEconomy: '宏观经济GDP数据(表样).xlsx',
    publicBudget: '宏观经济公共性预算信息(表样).xlsx',
    publicExponent: '宏观经济公共性支出信息(表样).xlsx',
    fixedInvestment: '宏观经济固定投资信息(表样).xlsx',
    peopleIncome: '宏观经济人均收入信息(表样).xlsx',
    pillarIndustry: '宏观经济支柱产业信息(表样).xlsx'
  };
  getSubject() {
    return this.subject.asObservable();
  }
  changeSubject() {
    this.subject.next({});
  }
  /*获取表单模板下载数据*/
  getFormExcelTemplateDownloadData() {
    return this.formExcelTempData;
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
