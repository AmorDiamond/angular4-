import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyEconomicInfoService } from '../company-economic-info.service';

@Component({
  selector: 'app-annual-report',
  templateUrl: './annual-report.component.html',
  styleUrls: ['./annual-report.component.css']
})
export class AnnualReportComponent implements OnInit {

  constructor(
    private microcomicService: MicrocosmicService,
    private companyEconomicInfoService: CompanyEconomicInfoService
  ) { }
  companyName: any;
  /*股东出资信息类(年报)*/
  ShareholderFundingParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: ''};
  ShareholderFunding = [];
  /*股权信息类(年报)*/
  EquityInformationParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: ''};
  EquityInformation = [];
  /*对外投资信息(年报)*/
  ForeignInvestmentParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: ''};
  ForeignInvestment = [];
  /*保证担保信息(年报)*/
  GuaranteeGuaranteeParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: ''};
  GuaranteeGuarantee = [];
  ShareholderFundingTips = '加载中...';
  EquityInformationTips = '加载中...';
  ForeignInvestmentTips = '加载中...';
  GuaranteeGuaranteeTips = '加载中...';
  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    this.ShareholderFundingParams.enterpriseName = this.companyName;
    this.EquityInformationParams.enterpriseName = this.companyName;
    this.ForeignInvestmentParams.enterpriseName = this.companyName;
    this.GuaranteeGuaranteeParams.enterpriseName = this.companyName;
    /*股东出资信息*/
    this.getAnnualReportParamsPage();
    /*股权信息*/
    this.getEquityInformationParamsPage();
    /*对外投资*/
    this.getForeignInvestmentParamsPage();
    /*保证担保*/
    this.getGuaranteeGuaranteeParamsPage();
  }
  // 股东出资信息类
  getAnnualReportParamsPage() {
    this.companyEconomicInfoService.findListByUrl(this.ShareholderFundingParams, 'shareholderFundingUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        console.log('股东出资', res)
        if (res.data.eIIApShareholderPojo.length < 1) {
          this.ShareholderFundingTips = '暂无信息！';
        }
        this.ShareholderFunding = [...this.ShareholderFunding, ...res.data.eIIApShareholderPojo];
        this.ShareholderFundingParams.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }
  // 股权信息类
  getEquityInformationParamsPage() {
    this.companyEconomicInfoService.findListByUrl(this.EquityInformationParams, 'equityInformationUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        console.log('股权信息', res)
        if (res.data.eIIApStockChangePojo.length < 1) {
          this.EquityInformationTips = '暂无信息！';
        }
        this.EquityInformation = [...this.EquityInformation, ...res.data.eIIApStockChangePojo];
        this.EquityInformationParams.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }
  // 对外投资
  getForeignInvestmentParamsPage() {
    this.companyEconomicInfoService.findListByUrl(this.ForeignInvestmentParams, 'foreignInvestmentUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        console.log('对外投资', res)
        if (res.data.eAEvaluationPojos.length < 1) {
          this.ForeignInvestmentTips = '暂无信息！';
        }
        this.ForeignInvestment = [...this.ForeignInvestment, ...res.data.eAEvaluationPojos];
        this.ForeignInvestmentParams.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }
  // 保证担保
  getGuaranteeGuaranteeParamsPage() {
    this.companyEconomicInfoService.findListByUrl(this.ForeignInvestmentParams, 'guaranteeGuaranteeUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        console.log('保证担保', res)
        if (res.data.eAEvaluationPojos.length < 1) {
          this.GuaranteeGuaranteeTips = '暂无信息！';
        }
        this.GuaranteeGuarantee = [...this.GuaranteeGuarantee, ...res.data.eAEvaluationPojos];
        this.GuaranteeGuaranteeParams.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }

}
