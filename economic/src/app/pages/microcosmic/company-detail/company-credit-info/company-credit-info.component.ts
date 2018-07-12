import { Component, OnInit } from '@angular/core';
import { CompanyCreditService, CompanyCreditResponse } from './company-credit.service';
import { Observable } from 'rxjs/Observable';
import { LoadingService } from '../../../../shared/loading/loading.service';

@Component({
  selector: 'app-company-credit-info',
  templateUrl: './company-credit-info.component.html',
  styleUrls: ['./company-credit-info.component.css'],
  providers: [CompanyCreditService]
})
export class CompanyCreditInfoComponent implements OnInit {
  companyName: any;
  governmentHonorList = [];
  administrationHonorList = [];
  commendHonorList = [];
  otherHonorList = [];

  // 行政处罚信息参数
  AdministrativePenaltyParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  eCIAdministrativePenaltyPojos = [];
  // 司法判决
  JudicialDecisionParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  eCIJudicialDecisionPojos = [];
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
  constructor(
    private companyCreditService: CompanyCreditService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.companyName = 'test1';
    /*获取政府表彰信息*/
    this.companyCreditService.getGovernmentHonor(this.companyName).subscribe(res => {
      res.data.eCIHonorPojo.forEach((v, i) => {
        this.governmentHonorList.push(v);
      });
    });
    /*获取行政奖励信息*/
    this.companyCreditService.getAdministrationHonor(this.companyName).subscribe(res => {
      res.data.eCIHonorPojo.forEach((v, i) => {
        this.administrationHonorList.push(v);
      });
    });
    /*获取表彰奖励信息*/
    this.companyCreditService.getCommendHonor(this.companyName).subscribe(res => {
      res.data.eCIHonorPojo.forEach((v, i) => {
        this.commendHonorList.push(v);
      });
    });
    /*获取其他奖励信息*/
    this.companyCreditService.getCommendHonor(this.companyName).subscribe(res => {
      res.data.eCIHonorPojo.forEach((v, i) => {
        this.otherHonorList.push(v);
      });
    });

    // this.findAdministrativePenaltyPage();
    // this.findJudicialDecisionPage();
    // this.findDebtorInfoPage();
    // this.findDebtorPage();
    // this.findAbnormalBusinessPage();
    // this.findCourtNoticePage();
    // this.findECITaxIllegalPage();
    // this.findECIProclamationPage();
    // this.findRefereeDocumentsPage();

    // tslint:disable-next-line:max-line-length
    const findAdministrativePenaltyPage = this.companyCreditService.findListByCompanyName(this.AdministrativePenaltyParams, 'AdministrativePenalty');
    const findJudicialDecisionPage = this.companyCreditService.findListByCompanyName(this.JudicialDecisionParams, 'JudicialDecision');
    const findDebtorInfoPage = this.companyCreditService.findListByCompanyName(this.DebtorInfoParams, 'DebtorInfo');
    const findDebtorPage = this.companyCreditService.findListByCompanyName(this.DebtorParams, 'Debtor');
    const findAbnormalBusinessPage = this.companyCreditService.findListByCompanyName(this.AbnormalBusinessParams, 'AbnormalBusiness');
    const findECIProclamationPage = this.companyCreditService.findListByCompanyName(this.ProclamationParams, 'Proclamation');
    const findRefereeDocumentsPage = this.companyCreditService.findListByCompanyName(this.RefereeDocumentsParams, 'RefereeDocuments');
    const findCourtNoticePage = this.companyCreditService.findListByCompanyName(this.CourtNoticeParams, 'CourtNotice');
    const findECITaxIllegalPage = this.companyCreditService.findListByCompanyName(this.ECITaxIllegalParams, 'ECITaxIllegal');

    Observable.forkJoin([findAdministrativePenaltyPage,
      findJudicialDecisionPage,
      findDebtorInfoPage,
      findDebtorPage,
      findAbnormalBusinessPage,
      findECIProclamationPage,
      findRefereeDocumentsPage,
      findCourtNoticePage,
      findECITaxIllegalPage,
    ])
      .subscribe(results => {
        console.log('多个请求', results);
        this.loadingService.loadingStop();
      }, err => {
        alert('数据请求出错！');
        this.loadingService.loadingStop();
      });
  }

  // 行政处罚信息
  findAdministrativePenaltyPage() {
    this.companyCreditService.findListByCompanyName(this.AdministrativePenaltyParams, 'AdministrativePenalty')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
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
          console.log('司法判决信息', res.data.eCIJudicialDecisionPojos);
          this.JudicialDecisionParams.lastRowKey = res.data.pagination.lastRowKey;
          this.eCIJudicialDecisionPojos = [...this.eCIJudicialDecisionPojos, ...res.data.eCIJudicialDecisionPojos];
        }
      });
  }

  // 失信被执行人
  findDebtorInfoPage() {
    this.companyCreditService.findListByCompanyName(this.DebtorInfoParams, 'DebtorInfo')
      .subscribe((res: CompanyCreditResponse) => {
        if (res.responseCode === '_200') {
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
  psYReachEnd(target: string) {
    this[target]();
  }

}
