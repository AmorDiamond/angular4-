import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

export interface CompanyDetailResponse {
  data: {
    eQIStandardSettingPojo?: any[],
    eQIHiTechCertificationPojo?: any[];
    eQICertificationPojo?: any[];
    eQIFamousProductPojo?: any[];
    eIIAnnouncementsPojos?: any[];
    eIIEquityPledgedPojos?: any[];
    eIIChattelMortgagePojos?: any[];
    eIIRecruitPojos?: any[];
    pagination: {
      lastRowKey: string
    }
  };
  responseCode: string;
  errorMsg: string;
  timestemp: any;
}

export interface RequestParams {
  companyName?: string;
  enterpriseName?: string;
  currentPage?: number;
  pageSize?: number;
  lastRowKey?: string;
  type?: string;
  url?: string;
}

export interface AttentionParams {
  rowkey?: string;
  type?: string;
}

@Injectable()
export class CompanyDetailService {

  private URLS = {
    // 行业资质证书
    Certification: '/v1/eQICertificationPojo/findListByCompanyName',
    // 高新技术信息
    // HiTechCertification: '/v1/eQIHiTechCertificationPojo/findListByCompanyName',
    HiTechCertification: '/v1/eQIHiTechCertificationPojo/',
    // 标准制定
    StandardSetting: '/v1/eQIStandardSettingPojo/findListByCompanyName',
    // 名优产品
    FamousProduct: '/v1/eQIFamousProductPojo/getEQICertificationPojoByCompany',
    // 舆论列表
    PublicOpinion: '/v1/EIIAnnouncements/findPublicOpinionPage',
    // 招聘信息
    EIIRecruit: '/v1/EIIRecruit/findEIIRecruitPage',
    // 股权信息
    EquityPledged: '/v1/EIIEquityPledged/findEquityPledgedPage',
    // 动产抵押
    ChattelMortgage: '/v1/EIIChattelMortgage/findEquityPledgedPage',
    // 关注
    attention: '/v1/epBaseInfoPojo/attentionCompany',
    // 取消关注
    unsubscribe: '/v1/epBaseInfoPojo/unsubscribeCompany',
  };

  constructor(private http: HttpClient) { }

  findListByCompanyName(data: RequestParams): Observable<CompanyDetailResponse> {

    const params = new HttpParams()
      .set('companyName', data.companyName ? data.companyName : '')
      .set('enterpriseName', data.enterpriseName ? data.enterpriseName : '')
      .set('lastRowKey', data.lastRowKey ? data.lastRowKey : '')
      .set('pageSize', data.pageSize ? data.pageSize.toString() : '');

    return this.http.get<CompanyDetailResponse>(this.URLS[data.type], { params });
  }

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
  getHiTechCertification(rowkey): Observable<any> {
    return this.http.get(`${this.URLS.HiTechCertification + rowkey}`);
  }

  findListByCompanyNameByUrl(data: RequestParams): Observable<CompanyDetailResponse> {

    const params = new HttpParams()
      .set('companyName', data.companyName ? data.companyName : '')
      .set('enterpriseName', data.enterpriseName ? data.enterpriseName : '')
      .set('lastRowKey', data.lastRowKey ? data.lastRowKey : '')
      .set('pageSize', data.pageSize ? data.pageSize.toString() : '');

    return this.http.get<CompanyDetailResponse>(data.url, { params });
  }

  attentionOrUnsubscribe(data: AttentionParams) {
    const params = new HttpParams()
      .set('rowkey', data.rowkey);
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.patch(this.URLS[data.type], '', {params: params, headers: headers});
  }

}
