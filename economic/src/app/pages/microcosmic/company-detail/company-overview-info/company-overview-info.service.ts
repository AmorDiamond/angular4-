import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class CompanyOverviewInfoService {
    companyRowkey: any;
    /*获取企业评分信息*/
    private companyEvaluationScoreUrl = '/v1/EAEvaluation/findScore';
    /*获取企业评价信息*/
    private companyEvaluationTagUrl = '/v1/EAEvaluation/findEvaluation';
    /*获取企业劣势信息*/
    private companyInferiorityUrl = '/v1/EAEvaluation/findDisadvantaged';
    constructor(private http: HttpClient) { }
    findListByUrl(findParams, type): Observable<any> {
        let paramsString = '';
        const url = this[type];
        for (const key in findParams) {
            if (findParams.hasOwnProperty(key)) {
                paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
            }
        }
        const params = new HttpParams({ fromString: paramsString });
        return this.http.get(url, { params });
    }

}
