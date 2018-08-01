import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

export interface CompanyCreditResponse {
    data: {
        // 招中标信息
        eCITaxIllegalPojos?: any[];
        pagination: {
            lastRowKey: string
        }
    };
    responseCode: string;
    errorMsg: string;
    timestemp: any;
}

@Injectable()
export class CompanyEconomicInfoService {
    companyRowkey: any;
    /*获取营业收入信息*/
    private companyIncomeStatisticsUrl = '/v1/eIIRevenueAndStaffPojo/findIncomeStatisticsByCompanyName';
    /*新获取营业收入和收入占比信息公用*/
    private companyIncomeStatisticsByYearUrl = '/v1/eIIApAssets/findOperatingIncome';
    /*获取收入占比信息Old*/
    private companyRevenueShareUrl = '/v1/eIIRevenueAndStaffPojo/findRevenueShareByCompanyName';
    /*获取在职人数信息*/
    private companyNumberOfActiveStaffUrl = '/v1/eIIRevenueAndStaffPojo/findNumberOfActiveStaffByCompanyName';
    /*新获取在职人数、学历结构、管理结构、就业情况信息*/
    private companyNumberOfActiveStaffByYearUrl = '/v1/Employees/findServingOfficers';
    /*获取收入同比信息*/
    private companyRevenueYearOnYearUrl = '/v1/eIIRevenueAndStaffPojo/findRevenueYearOnYearByCompanyName';
    /*取园区人数占比信息*/
    private companyParkNumberUrl = '/v1/eIIRevenueAndStaffPojo/findParkNumberByCompanyName';
    /*根据公司名称,获取企业关联方信息*/
    private companyRelationPeopleUrl = '/v1/eIIRelationPojo/findListByCompanyName';
    /*政企对接联系人信息*/
    private companyGobernmentContactsUrl = '/v1/eIIRelationPojo/findGobernmentContactsByCompanyName';
    /*政府项目申报信息*/
    // private companyProjectDeclarationUrl = '/v1/eETProjectDeclarationPojo/findListByCompanyName';
    private companyProjectDeclarationUrl = '/v1/kETProjectDeclarationPojo/findCompanyName';
    /*招中标信息*/
    private WinningBidUrl = '/v1/EIIWinningBid/findWinningBidPage';
    /*公司公告列表信息*/
    private companyNoticesUrl = '/v1/EIIAnnouncements/findAnnouncementPage';
    /*股东出资信息类(年报)*/
    private shareholderFundingUrl = '/v1/cgecultivation/findSharePage';
    /*股权信息类(年报)*/
    private equityInformationUrl = '/v1/eIIApStockChange/findStockPage';
    /*对外投资信息(年报)*/
    private foreignInvestmentUrl = '/v1/cgecultivation/findEIIApInvestment';
    /*保证担保信息(年报)*/
    private guaranteeGuaranteeUrl = '/v1/cgecultivation/findEIIApInvestment';
    /*科技创新 机构数据经费支出信息*/
    private OrganizationExpenditureUrl = '/v1/DomesticDevelopment/findMechanism';
    /*科技创新 知识产权信息*/
    private IntellectualPropertyUrl = '/v1/STAOtherSituation/findKnowHow';
    /*单独获取专利数据接口*/
    private PatentUrl = '/v1/IATrademarkAndPatent/findPatentPage';
    constructor(private http: HttpClient) { }

    getIncomeStatistics(company): Observable<any> {
        return this.http.get(`${this.companyIncomeStatisticsUrl + '?companyName=' + company}`);
    }
    /*通过公司名字和年份获取营收*/
    getIncomeStatisticsByYear(company, year: Array<number>): Observable<any> {
        const forkJoinArr = [];
        if (year.length > 0) {
            for (let i = 0; i < year.length; i++) {
              const post = this.http.get(`${this.companyIncomeStatisticsByYearUrl}?name=${company}&year=${year[i]}`);
              forkJoinArr.push(post);
            }
        }
       return Observable.forkJoin(forkJoinArr);
    }
    getRevenueShare(company, time): Observable<any> {
        console.log(company);
        return this.http.get(`${this.companyIncomeStatisticsByYearUrl}?name=${company}&year=${time}`);
    }
    getNumberOfActiveStaff(company): Observable<any> {
        return this.http.get(`${this.companyNumberOfActiveStaffUrl}?companyName=${company.companyName}&pageSize=${company.pageSize}`);
    }
    getRevenueYearOnYear(company): Observable<any> {
        return this.http.get(`${this.companyRevenueYearOnYearUrl + '?companyName=' + company}`);
    }
    getParkNumber(company): Observable<any> {
        return this.http.get(`${this.companyParkNumberUrl + '?companyName=' + company}`);
    }
    getRelationPeople(company): Observable<any> {
        return this.http.get(`${this.companyRelationPeopleUrl + '?companyName=' + company}`);
    }
    getGobernmentContacts(company): Observable<any> {
        return this.http.get(`${this.companyGobernmentContactsUrl + '?companyName=' + company}`);
    }
    getProjectDeclaration(company): Observable<any> {
        return this.http.get(`${this.companyProjectDeclarationUrl + '?enterpriseName=' + company}`);
    }
    getNotices(company): Observable<any> {
        return this.http.get(`${this.companyNoticesUrl + '?enterpriseName=' + company}`);
    }
    getStock(company): Observable<any> {
        return this.http.get(`${this.shareholderFundingUrl + '?enterpriseName=' + company}`);
    }

    findListByCompanyName(findParams, type): Observable<any> {
        let paramsString = '';
        for (const key in findParams) {
            if (findParams.hasOwnProperty(key)) {
                paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
            }
        }
        const params = new HttpParams({ fromString: paramsString });
        return this.http.get<CompanyCreditResponse>(this.WinningBidUrl, { params });
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

  /*通过多个请求获取数据*/
  getRequestByForkJoin(company, time, https: Array<string>): Observable<any> {
    const forkJoinArr = [];
    if (https.length > 0) {
      for (let i = 0; i < https.length; i++) {
          let post;
          if (https[i] === 'PatentUrl') {
            post = this.http.get(`${this[https[i]]}?enterpriseName=${company}`);
          }else {
            post = this.http.get(`${this[https[i]]}?name=${company}&year=${time}`);
          }
        forkJoinArr.push(post);
      }
    }
    return Observable.forkJoin(forkJoinArr);
  }

}
