import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class MacEconomicExpendService {
  private macExpendUrl = 'assets/jsonData/mac/macroPublicExpendfindByGaoXin';
  private macExpendAreaSpeedUrl = 'assets/jsonData/mac/macroPublicExpendfindByAll';
  constructor(private http: HttpClient) {}

  findListByParams(findParams, url, type?): Observable<any> {
    const httpUrl = this[url];
    const requestType = type ? type : 'get';
    let params;
    let paramsString = ``;
    if(requestType === 'get' || requestType === 'delete') {
      for(let item in findParams) {
        if(item) {
          paramsString += findParams[item] ? `${item}=${findParams[item]}&` : '';
        }
      }
      params = {params: new HttpParams({ fromString: paramsString })};
    }

    return this.http[requestType](httpUrl + findParams.year + '.json', params);
  }

}
