import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';


@Injectable()
export class IndustryMenuService {
  constructor(private http: HttpClient) { }
  private enterpriseFenbuUrl = '/v1/IndustrydepController/findcounts';
  private enterpriseScaleUrl = '/v1/IndustrydepController/findcounts';
  private enterpriseJiegouUrl = '/v1/IndustrydepController/findindustry';

  getDataByParams(findParams, url, type?): Observable<any> {
    let paramsString = '';
    const requestUrl = this[url];
    const requestType = type ? type : 'get';
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http[requestType](requestUrl, { params });
  }
}
