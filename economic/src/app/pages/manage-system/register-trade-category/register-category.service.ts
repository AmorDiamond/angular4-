import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import 'rxjs/add/operator/share';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

@Injectable()
export class RegisterCategoryService {

  private subject = new BehaviorSubject<any>(0);

  // private ldapTreeUrl = '/manager/v1/ldapTree/findRoot';
  private ldapTreeUrl = '/manager/v1/mapTree/getJsTree';
  private industryTypesUrl = '/manager/v1/epBaseInfoPojo/findIndustryType';
  constructor(private http: HttpClient, private router: Router) { }

  getNodes(findParams, url): Observable<any> {
    // return this.http.get(this.url).toPromise().then(res => <TreeNode[]> res.json().data);
    // return this.http.get(this.url).map(res => <TreeNode[]> res.json().data);

    console.log(findParams);
    const requestUrl = url;
    let paramsString = '';
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += `${key}=${findParams[key]}&`;
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http.get(this[requestUrl], { params });
  }
}
