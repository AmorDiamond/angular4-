import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

export interface GetListParams {
  enterpriseName?: string;
  // projectName?: string;
  // currentPage?: number;
  // pageSize?: number;
  // lastRowKey?: string;
}

export interface GetListResponse {
  data: {
    eQIHiTechCertificationPojos?: any[];
    pagination?: {
      currentPage?: number;
      pageSize?: number;
      lastRowKey?: string;
    };
  };
  errorMsg: string;
  responseCode: string;
  timestemp: number;
}

@Injectable()
export class LogsManageService {
  /*获取日志列表*/
  private searchLogsUrl = '/manager/v1/logRecord/search';
  /*获取枚举类型列表*/
  private searchEnumsUrl = '/manager/v1/logRecord/getEnums';

  constructor(private http: HttpClient) {}

  findListByParams(params, url): Observable<any> {
    let paramsString = ``;
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key]) {
        paramsString += params[key] ? `${key}=${params[key]}&` : '';
      }
      /*if (params.hasOwnProperty(key)) {
        paramsString += `${key}=${params[key]}&`;
      }*/
    }
    const PARAMS = new HttpParams({ fromString: paramsString });
    return this.http.get(this[url], { params: PARAMS });
  }

  /*通过多个请求获取数据*/
  getRequestByForkJoin(options): Observable<any> {
    const forkJoinArr = [];
    const requestTimes = options;
    if (requestTimes.length > 0) {
      for (let i = 0; i < requestTimes.length; i++) {
        const params = requestTimes[i].findParams;
        let paramsString = ``;
        for (const key in params) {
          if (params.hasOwnProperty(key) && params[key]) {
            paramsString += params[key] ? `${key}=${params[key]}&` : '';
          }
        }
        const PARAMS = new HttpParams({ fromString: paramsString });
        let post = this.http.get(`${this[requestTimes[i].url]}`, { params: PARAMS });
        forkJoinArr.push(post);
      }
    }
    return Observable.forkJoin(forkJoinArr);
  }
}
