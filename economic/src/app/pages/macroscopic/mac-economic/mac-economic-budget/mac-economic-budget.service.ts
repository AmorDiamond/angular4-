import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class MacEconomicBudgetService {

  private subject = new BehaviorSubject<any>(0);
  private macBudgetUrl = 'assets/jsonData/mac/macroPublicBudgetfindByYear';
  private macBudgetAreaSpeedUrl = 'assets/jsonData/mac/macroPublicBudgetfindAllGroupByArea';
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
