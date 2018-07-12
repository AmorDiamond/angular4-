import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  private URLS = {
    // 合同情况
    Contract: '/v1/KETContract/listContractPage',
    // 新闻
    News: '/v1/KETNews/listNewsPage',
    // 规上企业推荐
    SmartRecommendation: '/v1/epBaseInfoPojo/findAllSmartRecommendation',
  };

  constructor(private http: HttpClient) { }

  findList(data: RequestParams): Observable<EventNoticeResponse> {

    const params = new HttpParams()
      .set('lastRowKey', data.lastRowKey ? data.lastRowKey : '')
      .set('pageSize', data.pageSize ? data.pageSize.toString() : '');

    return this.http.get<EventNoticeResponse>(this.URLS[data.type], { params });
  }

}
