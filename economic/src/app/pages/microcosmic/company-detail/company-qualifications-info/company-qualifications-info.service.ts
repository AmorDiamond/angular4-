import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface QualificationsInfoResponse {
  data: {
    eQIStandardSettingPojo?: any[],
    eQIHiTechCertificationPojo?: any[];
    eQICertificationPojo?: any[];
    eQIFamousProductPojo?: any[];
    pagination: {
      lastRowKey: string
    }
  };
  responseCode: string;
  errorMsg: string;
  timestemp: any;
}

@Injectable()
export class CompanyQualificationsInfoService {

  private URLS = {
    // 行业资质证书
    Certification: '/v1/eQICertificationPojo/findListByCompanyName',
    // 高新技术信息
    HiTechCertification: '/v1/eQIHiTechCertificationPojo/findListByCompanyName',
    // 标准制定
    StandardSetting: '/v1/eQIStandardSettingPojo/findListByCompanyName',
    // 名优产品
    FamousProduct: '/v1/eQIFamousProductPojo/getEQICertificationPojoByCompany'
  };

  // 行业资质证书
  // private CertificationUrl = '/v1/eQICertificationPojo/findListByCompanyName';
  // 高新技术信息
  // private HiTechCertificationUrl = '/v1/eQIHiTechCertificationPojo/findListByCompanyName';
  // 标准制定
  // private StandardSettingUrl = '/v1/eQIStandardSettingPojo/findListByCompanyName';
  // 名优产品
  // private FamousProductUrl = '/v1/eQIFamousProductPojo/getEQICertificationPojoByCompany';

  constructor(private http: HttpClient) { }

  findListByCompanyName(findParams, type): Observable<any> {
    let paramsString = '';
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http.get<QualificationsInfoResponse>(this.URLS[type], { params });
  }

}
