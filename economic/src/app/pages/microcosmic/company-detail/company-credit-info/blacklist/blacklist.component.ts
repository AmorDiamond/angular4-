import { Component, OnInit } from '@angular/core';
import { CompanyCreditService, CompanyCreditResponse } from '../company-credit.service';
import { MicrocosmicService } from '../../../microcosmic.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styles: []
})
export class BlacklistComponent implements OnInit {

  // 行政处罚信息参数
  AdministrativePenaltyParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  eCIAdministrativePenaltyPojos = [];
  // 司法判决
  JudicialDecisionParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  eCIJudicialDecisionPojos = [];
  // 司法执行
  JudicialExecutionParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  eCIJudicialExecutionPojos = [];
  // 失信被执行人
  DebtorInfoParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  DebtorInfos = [];
  // 被执行人
  DebtorParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  Debtors = [];
  // 企业经营异常
  AbnormalBusinessParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  AbnormalBusiness = [];
  // 开庭公告
  ProclamationParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  Proclamations = [];
  // 裁判文书
  RefereeDocumentsParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  RefereeDocuments = [];
  // 法院公告
  CourtNoticeParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  CourtNotice = [];
  // 税务违法
  ECITaxIllegalParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  ECITaxIllegal = [];
  // 行政监督检
  EIIApAssetsParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  EIIApAssets = [];

  constructor(
    private companyCreditService: CompanyCreditService,
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService
  ) { }
  keyWord: any;
  AdministrativePenaltyTips = '加载中...';
  JudicialDecisionTips = '加载中...';
  JudicialExecutionTips = '加载中...';
  DebtorInfoTips = '加载中...';
  RefereeDocumentsTips = '加载中...';
  CourtNoticeTips = '加载中...';
  EIIApAssetsTips = '加载中...';
  ngOnInit() {
    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.AdministrativePenaltyParams.enterpriseName = this.keyWord;
    this.JudicialDecisionParams.enterpriseName = this.keyWord;
    this.JudicialExecutionParams.enterpriseName = this.keyWord;
    this.DebtorInfoParams.enterpriseName = this.keyWord;
    this.DebtorParams.enterpriseName = this.keyWord;
    this.AbnormalBusinessParams.enterpriseName = this.keyWord;
    this.ProclamationParams.enterpriseName = this.keyWord;
    this.RefereeDocumentsParams.enterpriseName = this.keyWord;
    this.CourtNoticeParams.enterpriseName = this.keyWord;
    this.ECITaxIllegalParams.enterpriseName = this.keyWord;
    this.EIIApAssetsParams.enterpriseName = this.keyWord;
    this.findAdministrativePenaltyPage();
    this.findJudicialDecisionPage();
    this.findJudicialExecutionPage();
    this.findDebtorInfoPage();
    // this.findDebtorPage();
    // this.findAbnormalBusinessPage();
    this.findCourtNoticePage();
    // this.findECITaxIllegalPage();
    // this.findECIProclamationPage();
    this.findRefereeDocumentsPage();
    this.findEIIApAssets();
  }

  // 行政处罚信息
  findAdministrativePenaltyPage() {
    this.companyCreditService.findListByCompanyName(this.AdministrativePenaltyParams, 'AdministrativePenalty')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          if (res.data.eCIAdministrativePenaltyPojos.length < 1) {
            this.AdministrativePenaltyTips = '暂无信息！';
          }
          console.log('行政处罚信息', res.data.eCIAdministrativePenaltyPojos);
          this.AdministrativePenaltyParams.lastRowKey = res.data.pagination.lastRowKey;
          this.eCIAdministrativePenaltyPojos = [...this.eCIAdministrativePenaltyPojos, ...res.data.eCIAdministrativePenaltyPojos];
        }
      });
  }

  // 司法判决信息
  findJudicialDecisionPage() {
    this.companyCreditService.findListByCompanyName(this.JudicialDecisionParams, 'JudicialDecision')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          if (res.data.eCIJudicialDecisionPojos.length < 1) {
            this.JudicialDecisionTips = '暂无信息！';
          }
          console.log('司法判决信息', res.data.eCIJudicialDecisionPojos);
          this.JudicialDecisionParams.lastRowKey = res.data.pagination.lastRowKey;
          this.eCIJudicialDecisionPojos = [...this.eCIJudicialDecisionPojos, ...res.data.eCIJudicialDecisionPojos];
        }
      });
  }
  // 司法执行信息
  findJudicialExecutionPage() {
    this.companyCreditService.findListByCompanyName(this.JudicialExecutionParams, 'JudicialExecution')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          if (res.data.eCIJudicialDecisionPojos.length < 1) {
            this.JudicialExecutionTips = '暂无信息！';
          }
          console.log('司法执行信息', res.data.eCIJudicialDecisionPojos);
          this.JudicialExecutionParams.lastRowKey = res.data.pagination.lastRowKey;
          this.eCIJudicialExecutionPojos = [...this.eCIJudicialExecutionPojos, ...res.data.eCIJudicialDecisionPojos];
        }
      });
  }

  // 失信被执行人
  findDebtorInfoPage() {
    this.companyCreditService.findListByCompanyName(this.DebtorInfoParams, 'DebtorInfo')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          if (res.data.eCIDebtorInfoPojos.length < 1) {
            this.DebtorInfoTips = '暂无信息！';
          }
          console.log('失信被执行人信息', res.data.eCIDebtorInfoPojos);
          this.DebtorInfoParams.lastRowKey = res.data.pagination.lastRowKey;
          this.DebtorInfos = [...this.DebtorInfos, ...res.data.eCIDebtorInfoPojos];
        }
      });
  }

  // 被执行人
  findDebtorPage() {
    this.companyCreditService.findListByCompanyName(this.DebtorParams, 'Debtor')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          console.log('被执行人信息', res.data.eCIDebtorInfoPojos);
          this.DebtorParams.lastRowKey = res.data.pagination.lastRowKey;
          this.Debtors = [...this.DebtorInfos, ...res.data.eCIDebtorInfoPojos];
        }
      });
  }

  // 企业经营异常
  findAbnormalBusinessPage() {
    this.companyCreditService.findListByCompanyName(this.AbnormalBusinessParams, 'AbnormalBusiness')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          console.log('企业经营异常', res.data.eCIAbnormalBusinessPojos);
          this.AbnormalBusinessParams.lastRowKey = res.data.pagination.lastRowKey;
          this.AbnormalBusiness = [...this.AbnormalBusiness, ...res.data.eCIAbnormalBusinessPojos];
        }
      });
  }

  // 开庭公告
  findECIProclamationPage() {
    this.companyCreditService.findListByCompanyName(this.ProclamationParams, 'Proclamation')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          console.log('开庭公告', res.data.eCIProclamationPojos);
          this.ProclamationParams.lastRowKey = res.data.pagination.lastRowKey;
          this.Proclamations = [...this.Proclamations, ...res.data.eCIProclamationPojos];
        }
      });
  }

  // 裁判文书
  findRefereeDocumentsPage() {
    this.companyCreditService.findListByCompanyName(this.RefereeDocumentsParams, 'RefereeDocuments')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          if (res.data.eCIProclamationPojos.length < 1) {
            this.RefereeDocumentsTips = '暂无信息！';
          }
          console.log('裁判文书', res.data.eCIProclamationPojos);
          this.RefereeDocumentsParams.lastRowKey = res.data.pagination.lastRowKey;
          this.RefereeDocuments = [...this.RefereeDocuments, ...res.data.eCIProclamationPojos];
        }
      });
  }

  // 法院公告
  findCourtNoticePage() {
    this.companyCreditService.findListByCompanyName(this.CourtNoticeParams, 'CourtNotice')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          if (res.data.eCIProclamationPojos.length < 1) {
            this.CourtNoticeTips = '暂无信息！';
          }
          console.log('法院公告', res.data.eCIProclamationPojos);
          this.CourtNoticeParams.lastRowKey = res.data.pagination.lastRowKey;
          this.CourtNotice = [...this.CourtNotice, ...res.data.eCIProclamationPojos];
        }
      });
  }

  // 税务违法
  findECITaxIllegalPage() {
    this.companyCreditService.findListByCompanyName(this.ECITaxIllegalParams, 'ECITaxIllegal')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
          console.log('税务违法', res.data.eCITaxIllegalPojos);
          this.ECITaxIllegalParams.lastRowKey = res.data.pagination.lastRowKey;
          this.ECITaxIllegal = [...this.ECITaxIllegal, ...res.data.eCITaxIllegalPojos];
        }
      });
  }
  // 行政监督检
  findEIIApAssets() {
    this.companyCreditService.findListByCompanyName(this.EIIApAssetsParams, 'EIIApAssets')
      .subscribe((res) => {
        if (res.responseCode === '_200') {
          if (res.data.eIIApAssetsPojo.length < 1) {
            this.EIIApAssetsTips = '暂无信息！';
          }
          console.log('行政监督检', res.data.eIIApAssetsPojo);
          this.EIIApAssetsParams.lastRowKey = res.data.pagination.lastRowKey;
          this.EIIApAssets = [...this.EIIApAssets, ...res.data.eIIApAssetsPojo];
        }
      });
  }
  /*监听滚动到底部*/
  psYReachEnd(options) {}
}
