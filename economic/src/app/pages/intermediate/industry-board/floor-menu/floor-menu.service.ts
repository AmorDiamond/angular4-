import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';


@Injectable()
export class FloorMenuService{
  constructor(private http: HttpClient) { }
  /*根据年份和楼宇名称查询楼宇的企业当年的注册资本和当年的企业数量*/
  private floorMenuUrl = '/v1/IndustrydepController/findfloor';

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
