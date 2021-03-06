import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

export interface EventNoticeResponse {
  data: {
    kETContractPojos?: any[],
    company?: any[],
    kETNewsPojos?: any[];
    dsddpojis?: any[];
    pagination?: {
      lastRowKey: string
    }
  };
  responseCode: string;
  errorMsg: string;
  timestemp: any;
}

export interface RequestParams {
  currentPage?: number;
  pageSize?: number;
  lastRowKey?: string;
  type?: string;
  url?: string;
}

@Injectable()
export class EventNoticeService {
  showEventNoticeMenus = {
    track: false
  }
  subjectEventNoticeMenus = new BehaviorSubject<any>(this.showEventNoticeMenus);
  private URLS = {
    // 合同情况
    Contract: '/v1/KETContract/listContractPage',
    // 新闻
    News: '/v1/KETNews/listNewsPage',
    // 规上企业推荐
    SmartRecommendation: 'assets/jsonData/epBaseInfoPojo/findAllSmartRecommendation.json',
  };
  /*获取关注企业列表*/
  private AttentionCompanysUrl = 'assets/jsonData/epBaseInfoPojo/findAttentionCompanys.json';
  /*获取关注企业信用预警事件*/
  private CorporateCreditEventUrl = 'assets/jsonData/epBaseInfoPojo/findCorporateCreditEvent.json';
  /*获取关注的重点企业消息*/
  private KeyEnterpriseUrl = 'assets/jsonData/epBaseInfoPojo/getKeyEnterprise.json';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  findList(data: RequestParams): Observable<EventNoticeResponse> {

    const params = new HttpParams()
      .set('lastRowKey', data.lastRowKey ? data.lastRowKey : '')
      .set('pageSize', data.pageSize ? data.pageSize.toString() : '');

    return this.http.get<EventNoticeResponse>(this.URLS[data.type], { params });
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
  getEventNoticeMenuControll(): Observable<any> {
    return this.subjectEventNoticeMenus.asObservable();
  }
  setEventNoticeMenuControll(options) {
    for (const item in options) {
      if (item) {
        this.showEventNoticeMenus[item] = options[item];
      }
    }
    this.subjectEventNoticeMenus.next(
      // {'EventNoticeMenusStatus': this.showEventNoticeMenus}
      this.showEventNoticeMenus
    );
  }
  /*储存详情返回地址*/
  setBackRouteUrl(name, backUrl) {
    sessionStorage.setItem('backRouteUrl', backUrl);
    this.router.navigate(['/mic/companyDetail/basic/company-profile'], {
      queryParams: {
        name: name
      }
    });
  }

}
