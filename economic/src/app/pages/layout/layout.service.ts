import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import 'rxjs/add/operator/share';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

export interface SearchParams {
  keyWord?: string;
  enterpriseType?: string;
  page?: number;
  size?: number;
}

export interface SearchResponse {
  data: {
    companys: any;
    enterpriseTypes: any;
    keyWord: string;
    pageParam: {
      currentpage: number;
      pagesize: number;
      total: number;
      totalPage: number;
    };
  };
  errorMsg: string;
  responseCode: string;
  timestemp: number;
}

@Injectable()
export class LayoutService {
  private inputStream: QueueingSubject<string>;
  public messages: Observable<string>;
  public connectionStatus: Observable<number>;

  private subject = new BehaviorSubject<any>(0);
  typesList = [];
  enterpriseTypesNumber: any;

  // webSocket地址
  private addr = 'ws://127.0.0.1:1194';

  private searchUrl = '/v1/epBaseInfoPojo/listCompanysPage';

  constructor(private http: HttpClient, private router: Router) { }

  public connect() {
    if (this.messages) {
      return;
    }


    // Using share() causes a single websocket to be created when the first
    // observer subscribes. This socket is shared with subsequent observers
    // and closed when the observer count falls to zero.
    const ws = websocketConnect(
      this.addr,
      this.inputStream = new QueueingSubject<string>()
    );
    this.messages = ws.messages.share();

    this.connectionStatus = ws.connectionStatus.share();
  }

  public send(message: string): void {
    // If the websocket is not connected then the QueueingSubject will ensure
    // that messages are queued and delivered when the websocket reconnects.
    // A regular Subject can be used to discard messages sent when the websocket
    // is disconnected.
    this.inputStream.next(message);
  }

  search(SearchParams) {
    let paramsString = '';
    for (const key in SearchParams) {
      if (SearchParams.hasOwnProperty(key)) {
        paramsString += SearchParams[key] ? `${key}=${SearchParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    this.http.get<SearchResponse>(this.searchUrl, { params })
      .subscribe(res => {
        if (res.responseCode === '_200') {
          console.log(1111, res)
          if (this.typesList.length < 1) {
              const Types = res.data.enterpriseTypes;
              this.enterpriseTypesNumber = res.data.enterpriseTypes;
              for (const key in Types) {
                  if (Types.hasOwnProperty(key)) {
                      this.typesList.push(key);
                  }
              }
          }
          this.subject.next(res);
          this.router.navigate(['/mic/companyList', res.data.keyWord]);
        } else {
          console.log(res.errorMsg);
        }

      }, err => {
        console.log(err);
      });
  }

  getSubject() {
    return this.subject.asObservable();
  }
  getTypeList() {
    return {list: this.typesList, num: this.enterpriseTypesNumber};
  }

}
