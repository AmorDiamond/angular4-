import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import 'rxjs/add/operator/share';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute } from '@angular/router';

export interface SearchParams {
  keyWord?: string;
  industryType?: string;
  page?: number;
  size?: number;
}

export interface SearchResponse {
  data: {
    companys: any;
    industryType: any;
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
  private accessControlData: any = [];
  private accessControlSubject = new BehaviorSubject<any>(this.accessControlData);
  SearchStatus = {
    isSearchActive: false
  };
  private searchStatusSubject = new BehaviorSubject<any>(this.SearchStatus);
  typesList = [];
  enterpriseTypesNumber: any;

  // webSocket地址
  private addr = 'ws://127.0.0.1:1194';

  private searchUrl = '/v1/epBaseInfoPojo/listCompanysPage';

  constructor(private http: HttpClient, private router: Router, private routerInfo: ActivatedRoute) {
    const loginRole = sessionStorage.getItem('userRole');
    const accessControlDataUrl = '../../../assets/accessControlData.json';
    /*判断是否超级管理员登录*/
    if (loginRole === 'ADMIN') {
      this.http.get(accessControlDataUrl).subscribe(result => {
        this.accessControlData = result;
        const len = this.accessControlData.length;
        /*给超级管理员处理所有权限*/
        for (let i = 0; i < len; i++) {
          const hasAccess = true;
          this.accessControlData[i].hasAccess = hasAccess;
        }
        this.changeAccessControlSubject();
      });
    }else {
      this.http.get('/v1/competence/findByCurrentUser').subscribe((res: any) => {
        console.log('获取所有权限', res);
        if (res.responseCode === '_200') {
          this.http.get(accessControlDataUrl).subscribe(result => {
            this.accessControlData = result;
            const requstData = [];
            res.data.forEach(item => {
              // requstData.push(item.id);
              requstData.push(item.resource + '&' + item.methods);
            });
            const len = this.accessControlData.length;
            for (let i = 0; i < len; i++) {
              let hasAccess = true;
              /*const idsLen = this.accessControlData[i].ids.length;
              for (let j = 0; j < idsLen; j++) {
                if (requstData.indexOf(this.accessControlData[i].ids[j]) < 0) {
                  hasAccess = false;
                }
              }*/
              const resourcesLen = this.accessControlData[i].resources.length;
              for (let j = 0; j < resourcesLen; j++) {
                if (requstData.indexOf(this.accessControlData[i].resources[j]) < 0) {
                  hasAccess = false;
                }
              }
              this.accessControlData[i].hasAccess = hasAccess;
            }
            console.log('处理后的权限数据', this.accessControlData);
            this.changeAccessControlSubject();
          });
        }
      });
    }
  }

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
              const Types = res.data.industryType;
              this.enterpriseTypesNumber = res.data.industryType;
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
  /*改变保存的权限控制数据*/
  changeAccessControlSubject() {
    this.accessControlSubject.next(this.accessControlData);
  }
  /*监听搜索的状态*/
  getAccessControlSubject() {
    return this.accessControlSubject.asObservable();
  }
  /*改变搜索的状态*/
  changeSearchStatusSubject(flag) {
    this.SearchStatus.isSearchActive = flag;
    this.searchStatusSubject.next(this.SearchStatus);
  }
  /*监听搜索的状态*/
  getSearchStatusSubject() {
    return this.searchStatusSubject.asObservable();
  }
  /*获取url参数*/
  getUrlParams(option) {
    return this.routerInfo.snapshot.queryParams[option];
  }

}
