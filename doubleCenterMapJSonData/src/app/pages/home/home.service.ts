import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, forkJoin, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient
  ) { }
  // 获取园区企业总数
  private parkCompanyCount = 'assets/mock/findCompanyCount';
  // 获取园区企业位置
  private enterprisePositions = 'assets/mock/hadLandData';
  // 获取园区概况信息
  private getParkOverviewUrl = 'assets/mock/findConutByType';
  heatmapData = {
    west: [],
    south: [],
    east: [],
    biologicalCity: []
  };
  parkEnterpriseData: any;
  heatmapSubject = new BehaviorSubject<any>(0);
  setHeatmapData (west, south, east, biologicalCity) {
    this.heatmapData.west = west;
    this.heatmapData.south = south;
    this.heatmapData.east = east;
    this.heatmapData.biologicalCity = biologicalCity;
    this.heatmapSubject.next(this.heatmapData);
  }
  getHeatmapData (): Observable<any> {
    return this.heatmapSubject.asObservable();
  }
  setParkEnterpriseData (res) {
    this.parkEnterpriseData = res;
  }
  getParkEnterpriseData () {
    return this.parkEnterpriseData;
  }
  httpRequest (url, findParams?, type?) {
    let requestUrl = this[url];
    const requestType = type ? type : 'get';
    let requestParams = ``;
    for (const item in findParams) {
      if (findParams[item]) {
        // requestParams += `${item}=${findParams[item]}&`
        requestParams += `${findParams[item]}`
      }
    }
    const params = new HttpParams({ fromString: requestParams });
    // return this.http[requestType](requestUrl, {params});
    return this.http[requestType](requestUrl + requestParams + '.json');
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
            // paramsString += params[key] ? `${key}=${params[key]}&` : '';
            paramsString += params[key] ? `${params[key]}` : '';
          }
        }
        const PARAMS = new HttpParams({ fromString: paramsString });
        // const post = this.http.get(`${this[requestTimes[i].url]}`, { params: PARAMS });
        const post = this.http.get(`${this[requestTimes[i].url] + paramsString}.json`);
        forkJoinArr.push(post);
      }
    }
    return forkJoin(forkJoinArr);
  }
}
