import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class DataApplicationService {

  private subject = new BehaviorSubject<any>(0);
  private researchSelectedList = [];
  constructor(
    private routerInfo: ActivatedRoute,
    private http: HttpClient,
  ) {}
  private searchUrl = '/v1/epBaseInfoPojo/listCompanysPage';
  /*修改调研企业地址*/
  private editAddressUrl = '/v1/researchPlan/updateCompanyAddress';
  /*获取最优路线*/
  private bestRouteUrl = '/v1/researchPlan/callMapAPI';
  /*下载调研路线信息*/
  private downLoadBestRouteUrl = '/v1/researchPlan/add';
  /*添加联系人信息*/
  private addContactPeopleUrl = '/v1/eIIRelationlistController/create';
  /*修改联系人信息*/
  private editContactPeopleUrl = '/v1/eIIRelationlistController/update';
  /*发送信息*/
  private sendMessageUrl = '/v1/eIIRelationlistController/sendMessage';
  /*导出系统数据*/
  private downLoadSystemDataUrl = '/v1/dataApplication/download';
  /*获取所有产业类型*/
  private allIndustryTypesUrl = '/manager/v1/epBaseInfoPojo/findIndustryType';
  /*通过各种类型搜索企业列表*/
  private getCompanysByTypesUrl = '/manager/v1/epBaseInfoPojo/searchCompanyByParam';

  getSubject() {
    return this.subject.asObservable();
  }
  changeSubject() {
    this.subject.next({});
  }
  /*改变已选择的企业列表*/
  changeSelectedList(options) {
    this.researchSelectedList = options;
  }
  /*获取已选择的企业列表*/
  getSelectedList() {
    return this.researchSelectedList;
  }
  /*获取url参数*/
  getUrlParams(option) {
    return this.routerInfo.snapshot.queryParams[option];
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
  sendMessage(findParams, http): Observable<any> {
    const url = this[http];
    const params = findParams;
    return this.http.post(url + '?content=' + params.content, params.pojo);
    // return this.http.post(url, params);
  }
  /*下载excel请求*/
  downLoadFile(findParams, http, type?) {
    const url = this[http];
    const requestType = type ? type : 'get';
    let params;
    /*if (requestType === 'post') {
      const formData: FormData = new FormData();
      for (const item in findParams) {
        if (item) {
          formData.append(`${item}`, findParams[item]);
        }
      }
      // params = new HttpParams().set('companyName', findParams.companyName).set('content', findParams.content);
      params = formData;
    }*/
    params = findParams;
    console.log(params)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http[requestType](url, params);
  }

  // Blob请求
  requestBlob(url: any, data?: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, data, {observe: 'response', responseType: 'arraybuffer'});
    // return this.http.post(url, data);
  }
  // Blob文件转换下载
  downFile(result, fileName, fileType?) {
    const data = result.body;
    const blob = new Blob([data], {type: fileType || data.type});
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    a.setAttribute('href', objectUrl);
    a.setAttribute('download', fileName);
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  // 导出
  export(data: any, fileName: string, fileType?: any) {
    const url = '/v1/researchPlan/add';
    this.requestBlob(url +
      '?title=' + data.wordMap.title
      + '&year=' + data.wordMap.year
      + '&month=' + data.wordMap.month
      + '&day=' + data.wordMap.day
      + '&startTime=' + data.wordMap.startTime
      + '&endTime=' + data.wordMap.endTime, data.list).subscribe(result => {
      console.log(result)
      this.downFile(result, fileName, fileType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
  }
  // 导出zip
  exportZip(data: any, fileName: string, fileType?: any) {
    const url = '/v1/dataApplication/download';
    this.requestBlobZip(url, data).subscribe(result => {
      this.downFile(result, fileName, fileType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
  }
  // Blob请求导出系统数据
  requestBlobZip(url: any, data?: any): Observable<any> {
    return this.http.get(url, {params: data, observe: 'response', responseType: 'arraybuffer'});
  }

}
