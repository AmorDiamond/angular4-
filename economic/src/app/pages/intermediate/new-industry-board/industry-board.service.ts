import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

declare var echarts: any;

@Injectable()
export class IndustryBoardService {
  private subject = new BehaviorSubject<any>(0);
  /*获取产业看板的关系图*/
  private relationChartUrl = 'assets/jsonData/middle/getIndustryMap.json';
  /*获取产业的企业概况*/
  private companyOverviewUrl = 'assets/jsonData/middle/getCompanyProfile.json';
  /*概况科技创新*/
  private technologicalInnovationUrl = 'assets/jsonData/middle/getTechnologyProfile.json';
  /*获取从业人数*/
  private workPeopleUrl = 'assets/jsonData/middle/getPersonnelProfile.json';
  /*获取人员构成*/
  private peopleConstituteUrl = 'assets/jsonData/middle/getPositionProfile.json';
  /*获取概况经济现状*/
  private economicOverviewUrl = 'assets/jsonData/middle/getEconomicProfile.json';
  /*获取产业规模数据*/
  private typeScaleProfileUrl = 'assets/jsonData/middle/getScaleProfile.json';
  /*获取产业经济数据*/
  private typeEconomicUrl = 'assets/jsonData/middle/getEconomicOverview.json';
  /*获取产业经济(通过年份查看每年营业收入占比)*/
  private typeEconomicIncomeUrl = '/v1/mediumViewController/getIncomeProfileByYear';
  /*产业看板---产业概况 --功能区(各功能区人均主营收入,人均税收,人均利润情况)*/
  private typeFunctionPeopleIncomeTaxProfitUrl = 'assets/jsonData/middle/getAverageProduction';
  /*产业看板---产业概况 --功能区(资产总计,营业收入,利润,税收)*/
  private typeFunctionAssetsIncomeTaxProfitUrl = 'assets/jsonData/middle/getAssetIncome';
  /*产业看板---产业概况 --功能区(政府支持,固定投资,研发经费)*/
  private typeFunctionGovernmentalSupportUrl = 'assets/jsonData/middle/getExpenditureProfile';
  /*产业看板---产业概况 --功能区(职工学历层次,职工岗位类型占比)*/
  private typeFunctionWorkerCompositionUrl = 'assets/jsonData/middle/getRegionalDistribution';
  /*产业看板---产业概况 --功能区(政府支持与税收的占比情况)*/
  private typeFunctionGovernmentalSupportTaxPayUrl = 'assets/jsonData/middle/getRegionalGovernmentRevenue';
  /*产业看板---产业概况 --功能区(各功能区企业数量,职工人数)*/
  private typeFunctionCompanyTotalWorkerNumberUrl = 'assets/jsonData/middle/getRegionalNumber';
  /*产业看板---产业概况 --功能区(营业收入阶梯分布情况)*/
  private typeFunctionOperatingIncomeLadderUrl = 'assets/jsonData/middle/getRevenueLadder';
  /*产业看板---产业概况 --其他(企业流失率)*/
  private typeOtherLossRate = 'assets/jsonData/middle/getLossRate.json';
  /*产业看板---产业概况 --其他(单位综合能耗的经济总产值)*/
  private typeOtherEnergyProductionUrl = 'assets/jsonData/middle/getEnergyProductionValue.json';
  /*产业看板---产业概况 --其他(环保排污能力)*/
  private typeOtherSewageCapacityUrl = 'assets/jsonData/middle/getSewageCapacity.json';
  /*产业看板---产业概况 --其他(单位环保排污与总产值比值)*/
  private typeOtherUnitSewageUrl = 'assets/jsonData/middle/getUnitSewage.json';
  constructor(private http: HttpClient) { }

  /*网络请求方法*/
  requestByParams(findParams, http, type?, postType?): Observable<any> {
    let paramsString = '';
    const url = this[http];
    const requestType = type ? type : 'get';
    let params;
    if (requestType === 'get' || requestType === 'delete') {
      for (const key in findParams) {
        if (findParams.hasOwnProperty(key)) {
          paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
        }
      }
      params = {params: new HttpParams({ fromString: paramsString })};
    }
    if (requestType === 'patch') {
      params = findParams;
    }
    if (requestType === 'post') {
      if (postType && postType === 'object') {
        params = findParams;
      }else {
        const formData: FormData = new FormData();
        for (const item in findParams) {
          if (item) {
            formData.append(`${item}`, findParams[item]);
          }
        }
        // params = new HttpParams().set('companyName', findParams.companyName).set('content', findParams.content);
        params = formData;
      }
    }
    console.log(params)
    return this.http[requestType](url, params);
  }
  /*处理json数据根据时间获取*/
  requestJsonByYear(findParams, http, type?, postType?) {
    const area = findParams.regional ? findParams.regional : '';
    const url = this[http] + area + findParams.year + '.json';
    const requestType = type ? type : 'get';
    let params;
    return this.http[requestType](url, params);
  }
}
