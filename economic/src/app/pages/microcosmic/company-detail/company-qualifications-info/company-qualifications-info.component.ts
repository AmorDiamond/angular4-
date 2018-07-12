import { Component, OnInit, OnDestroy } from '@angular/core';
import { MicrocosmicService } from '../../microcosmic.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/retry';
import { CompanyDetailService, CompanyDetailResponse, RequestParams } from '../company-detail.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-company-qualifications-info',
  templateUrl: './company-qualifications-info.component.html',
  styleUrls: ['./company-qualifications-info.component.css']
})
export class CompanyQualificationsInfoComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  companyName = '';

  // 资质证书
  Certifications = [];
  // 高新技术
  HiTechCertifications = [];
  // 标准制定
  StandardSettings = [];
  // 名优产品
  FamousProduct = [];

  getCertificationParamas: RequestParams = { companyName: 'test1', pageSize: 3, lastRowKey: '', type: 'Certification' };
  getHiTechCertificationParamas = { rowkey: 'test1', pageSize: 3, lastRowKey: '', type: 'HiTechCertification' };
  getStandardSettingParamas: RequestParams = { companyName: 'test1', pageSize: 3, lastRowKey: '', type: 'StandardSetting' };
  getFamousProductParamas: RequestParams = { companyName: 'test1', pageSize: 3, lastRowKey: '', type: 'FamousProduct' };
  constructor(
    private companyDetailService: CompanyDetailService,
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService
  ) {
    /*this.subscription = this.microcomicService.getCompanyName()
      .subscribe(res => {
        this.companyName = res.companyName;
      });*/


  }
  keyWord: any;
  CertificationTips = '加载中...';
  HiTechCertificationTips = '加载中...';
  StandardSettingTips = '加载中...';
  FamousProductTips = '加载中...';
  ngOnInit() {
    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.getCertificationParamas.companyName = this.keyWord;
    this.getHiTechCertificationParamas.rowkey = this.keyWord;
    this.getStandardSettingParamas.companyName = this.keyWord;
    this.getFamousProductParamas.companyName = this.keyWord;
    this.getCertification();
    this.getHiTechCertification();
    // this.getStandardSetting();
    this.getFamousProduct();
  }

  // 行业资质证书
  getCertification() {
    this.companyDetailService.findListByCompanyName(this.getCertificationParamas)
      .subscribe(res => {
        if (res.responseCode === '_200') {
          console.log(res.data.pagination.lastRowKey);
          if (res.data.eQICertificationPojo.length < 1) {
            this.CertificationTips = '暂无信息！';
          }
          this.getCertificationParamas.lastRowKey = res.data.pagination.lastRowKey;
          this.Certifications = [...this.Certifications, ...res.data.eQICertificationPojo];
        }
      });
  }

  // 高新技术信息
  getHiTechCertification() {
    /*this.companyDetailService.findListByCompanyName(this.getHiTechCertificationParamas)
      .subscribe(res => {
        console.log('查询到的高新技术信息=============>', res);
        this.getHiTechCertificationParamas.lastRowKey = res.data.pagination.lastRowKey;
        this.HiTechCertifications = [...this.HiTechCertifications, ...res.data.eQIHiTechCertificationPojo];
      });*/
    this.companyDetailService.getHiTechCertification(this.keyWord).subscribe(res => {
      console.log('查询到的高新技术信息=============>', res);
      if (res.responseCode === '_200') {
        if (!res.data) {
          this.HiTechCertificationTips = '暂无信息！';
        }
        // this.getHiTechCertificationParamas.lastRowKey = res.data.pagination.lastRowKey;
        // this.HiTechCertifications = [...this.HiTechCertifications, ...res.data.eQIHiTechCertificationPojo];
        this.HiTechCertifications = [...this.HiTechCertifications, ...res.data ? res.data : []];
      }
    });
  }

  // 标准制定
  getStandardSetting() {
    this.companyDetailService.findListByCompanyName(this.getStandardSettingParamas)
      .subscribe(res => {
        console.log('查询到的标准制定信息=============>', res);
        if (res.responseCode === '_200') {
          if (res.data.eQIStandardSettingPojo.length < 1) {
            this.StandardSettingTips = '暂无信息！';
          }
          this.getStandardSettingParamas.lastRowKey = res.data.pagination.lastRowKey;
          this.StandardSettings = [...this.StandardSettings, ...res.data.eQIStandardSettingPojo];
        }
      });
  }

  // 名优产品
  getFamousProduct() {
    this.companyDetailService.findListByCompanyName(this.getFamousProductParamas)
      .subscribe(res => {
        console.log('查询到的名优产品信息=============>', res);
        if (res.responseCode === '_200') {
          if (res.data.eQIFamousProductPojo.length < 1) {
            this.FamousProductTips = '暂无信息！';
          }
          this.getFamousProductParamas.lastRowKey = res.data.pagination.lastRowKey;
          this.FamousProduct = [...this.FamousProduct, ...res.data.eQIFamousProductPojo];
        }
      });
  }

  psYReachEnd(traget: string) {
    this[traget]();
    console.log('滚动到底部了==========>执行', traget);
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

}
