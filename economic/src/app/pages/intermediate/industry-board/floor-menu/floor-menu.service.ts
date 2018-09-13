import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';


@Injectable()
export class FloorMenuService{
  constructor(private http: HttpClient) { }
  /*查看楼宇企业注册资本信息*/
  private floorRegisterMoneyUrl = '/v1/IndustrydepController/findRegistCapitalGroupByFloor';
  /*查看楼宇企业注册类型信息*/
  private floorEnterpriseTypeUrl = '/v1/IndustrydepController/findEnterpriseTypeGroupByFloor';

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
