import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface GetListParams {
  companyName?: string;
  projectName?: string;
  currentPage?: number;
  pageSize?: number;
  lastRowKey?: string;
}

export interface GetListResponse {
  data: {
    kETProjectDeclarationPojo?: any[];
    pagination?: {
      currentPage?: number;
      pageSize?: number;
      lastRowKey?: string;
    };
  };
  errorMsg: string;
  responseCode: string;
  timestemp: number;
}

@Injectable()
export class ProjectDeclarationService {
  private url = '/v1/kETProjectDeclarationPojo/findListByCompanyName';

  constructor(private http: HttpClient) {}

  getList(params: GetListParams): Observable<GetListResponse> {
    let paramsString = '';
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key]) {
        paramsString += params[key] ? `${key}=${params[key]}&` : '';
      }
    }

    const PARAMS = new HttpParams({ fromString: paramsString });
    return this.http.get<GetListResponse>(this.url, { params: PARAMS });
  }
}
