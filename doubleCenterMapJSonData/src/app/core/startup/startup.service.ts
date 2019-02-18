import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { MapService } from "../map/map.service";

declare var AMap: any;
@Injectable({
  providedIn: 'root'
})
export class StartupService {

  constructor(
    private http: HttpClient,
    private mapService: MapService
  ) { }
  // 获取园区轮廓坐标
  // private getParkRangeUrl = '/v1/platform/landBlockController/findByName';
  private getParkRangeUrl = 'assets/mock/findByName';

  // 获取园区企业总数
  // private parkCompanyCountUrl = '/v1/platform/landBlockController/findCompanyCount';
  private parkCompanyCountUrl = 'assets/mock/findCompanyCount';
  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      this.getInitData(resolve, reject);

    });
  }
  getInitData (resolve, reject) {
    const list = [
      {findParams: {landName: '高新西区'}, url: 'getParkRangeUrl'},
      {findParams: {landName: '高新南区'}, url: 'getParkRangeUrl'},
      {findParams: {landName: '高新东区'}, url: 'getParkRangeUrl'},
      {findParams: {landName: '天府国际生物城'}, url: 'getParkRangeUrl'},
      {findParams: {}, url: 'parkCompanyCountUrl'}
    ];
    this.getRequestByForkJoin(list).subscribe(res => {
      const hasError = res.some(item=>item.responseCode!=='_200');
      if (hasError) {

      }
      let westPoints = [];
      let southPoints = [];
      let eastPoints = [];
      let biologicalCityPoints = [];
      if (res[0].responseCode === '_200') {
        // 西区
        const data = res[0].data[0];
        westPoints = this.formatPositions(data.points);
      }
      if (res[1].responseCode === '_200') {
        // 南区
        const data = res[1].data[0];
        southPoints = this.formatPositions(data.points);
      }
      if (res[2].responseCode === '_200') {
        // 东区
        const data = res[2].data[0];
        eastPoints = this.formatPositions(data.points);
      }
      if (res[3].responseCode === '_200') {
        // 生物城
        const data = res[3].data[0];
        biologicalCityPoints = this.formatPositions(data.points);
      }
      if (res[4].responseCode === '_200') {
        // 园区企业总量
        const data = res[4].data;
        this.mapService.setParkEnterprise(data);
      }
      this.mapService.setRangePositions(westPoints, southPoints, eastPoints, biologicalCityPoints);
      resolve()
    });
  }

  formatPositions (dataArry) {
    const positions = dataArry.map(item => {
      return new AMap.LngLat(item.lng, item.lat);
    });
    return positions;
  }
  /*通过多个请求获取数据*/
  getRequestByForkJoin(options): Observable<any> {
    const forkJoinArr = [];
    const requestTimes = options;
    if (requestTimes.length > 0) {
      for (let i = 0; i < requestTimes.length; i++) {
        const params = requestTimes[i].findParams;
        let paramsString = ``;
        /*for (const key in params) {
          if (params.hasOwnProperty(key) && params[key]) {
            paramsString += params[key] ? `${key}=${params[key]}&` : '';
          }
        }*/
        for (const key in params) {
          if (params.hasOwnProperty(key) && params[key]) {
            paramsString += params[key] ? `${params[key]}` : '';
          }
        }
        // const PARAMS = new HttpParams({ fromString: paramsString });
        // const post = this.http.get(`${this[requestTimes[i].url]}`, { params: PARAMS });
        const post = this.http.get(`${this[requestTimes[i].url] + paramsString}.json`);
        forkJoinArr.push(post);
      }
    }
    return forkJoin(forkJoinArr);
  }
}
