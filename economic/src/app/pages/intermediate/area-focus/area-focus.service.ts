import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

declare var echarts: any;

@Injectable()
export class AreaFocusService {

  // /v1/mediumArea/industryHeatMap  各功能区的产业热力图
  private urlOne = 'assets/jsonData/middle/industryHeatMap.json';

  // 各功能区的营收，税收，利润,政府支持情况    /v1/mediumArea/businessPanel
  private urlThree = 'assets/jsonData/middle/businessPanel2017.json';

  // 各功能区的人均主营收入、人均税收、人均利润情况    /v1/mediumArea/perCapitaBusinessPanel
  private urlFour = 'assets/jsonData/middle/perCapitaBusinessPanel2017.json';

  // 各功能区的企业和职工占比情况'
  private urlFive = 'assets/jsonData/middle/enterpriseProportion2017.json';

  // /v1/mediumArea/threeYearsCompanyAndStaff 近三年企业数量和职工人数
  private detaileUrlOne = '/v1/mediumArea/threeYearsCompanyAndStaff';

  // /v1/mediumArea/areaStaffLevel    职工学历层次分布及职工岗位类型
  private detaileUrlTwo = '/v1/mediumArea/areaStaffLevel';

  ///v1/mediumArea/threeYearsPatent   近三年专利申请、授权、拥有情况
  private detaileUrlFour = '/v1/mediumArea/threeYearsPatent';

  // /v1/mediumArea/threeYearsPropertyRight   近三年其他知识产权拥有情况
  private detaileUrlFive = '/v1/mediumArea/threeYearsPropertyRight';


  // /v1/mediumArea/inputSituation  近几年政府支持情况、固定投资、研发经费
  private ecoDetailUrl = '/v1/mediumArea/inputSituation';

  //近几年工业总产值、资产总计、营业收入、利润、税收、利润率（利润/营收）
  // /v1/mediumArea/informationOutput  近几年工业总差值、资产总计、营业收入、利润、税收、利润率不同营业收入类型的占比
  private ecoDetailUrlTwo = '/v1/mediumArea/informationOutput';


  // /v1/mediumArea/differentoOperatingIncomeLevels   不同营业收入阶梯分布
  private ecoDetailUrlThree = '/v1/mediumArea/differentoOperatingIncomeLevels';

  // /v1/mediumArea/governmentSubsidiesAndTaxes   近几年政府支持与税收的占比
  private ecoDetailUrlFour = '/v1/mediumArea/governmentSubsidiesAndTaxes';

  // /v1/mediumArea/fixedInvestmentAndIncomeProfit   近几年固定投资与营业收入和利润的比较
  private ecoDetailUrlFive = '/v1/mediumArea/fixedInvestmentAndIncomeProfit';

  // /v1/mediumArea/perCapitaBusinessByAllYear    近几年人均主营收入、人均税收、人均利润情况
  private ecoDetailUrlSix = '/v1/mediumArea/perCapitaBusinessByAllYear';


  // /v1/mediumArea/informationOutputDetails   电子信息产出情况 - 主营收入、技术收入、产品销售收入、商品销售收入、其他营业收入
  private ecoDetailUrlSeven = '/v1/mediumArea/informationOutputDetails';


  // /v1/mediumArea/relocationOfEnterprises   高新区近几年企业迁出情况
  private otherUrlOne = '/v1/mediumArea/relocationOfEnterprises';

  // /v1/mediumArea/comprehensiveEnergyConsumption   高新区近几年单位综合能耗的经济总产值
  private otherUrlTwo = '/v1/mediumArea/comprehensiveEnergyConsumption';

  // /v1/mediumArea/environmentalTrends  高新区近几年环保排污走势情况
  private otherUrlThree = '/v1/mediumArea/environmentalTrends';

  // /v1/mediumArea/unitEnvironmentalTrends   高新区近几年单位环保排污的经济总产值
  private otherUrlFour = '/v1/mediumArea/unitEnvironmentalTrends';


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
      params = { params: new HttpParams({ fromString: paramsString }) };
    }
    if (requestType === 'patch') {
      params = findParams;
    }
    if (requestType === 'post') {
      if (postType && postType === 'object') {
        params = findParams;
      } else {
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
}
