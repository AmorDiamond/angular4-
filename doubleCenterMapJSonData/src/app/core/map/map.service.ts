import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
declare var AMap: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private http: HttpClient,
  ) {}
  // private getParkRangeUrl = '/v1/platform/landBlockController/findByName';
  rangePositions = {
    westPoints: [],
    southPoints: [],
    eastPoints: [],
    biologicalCityPoints: [],
  };
  parkEnterpriseData: any = {};

  setRangePositions (westPoints=[], southPoints=[], eastPoints=[], biologicalCityPoints=[]) {
    this.rangePositions.westPoints = westPoints;
    this.rangePositions.southPoints = southPoints;
    this.rangePositions.eastPoints = eastPoints;
    this.rangePositions.biologicalCityPoints = biologicalCityPoints;
  }
  getRangePositions () {
    return this.rangePositions;
  }
  setParkEnterprise (res) {
    res.forEach(item => {
      this.parkEnterpriseData[item[0]] = item[1];
    })
  }
  getParkEnterprise () {
    return this.parkEnterpriseData;
  }
  /*通过多个请求获取数据*/
  /*getRequestByForkJoin(options): Observable<any> {
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
        const post = this.http.get(`${this[requestTimes[i].url]}`, { params: PARAMS });
        forkJoinArr.push(post);
      }
    }
    return forkJoin(forkJoinArr);
  }*/
}
