import { Component, OnInit } from '@angular/core';
import { CompanyCreditService } from '../company-credit.service';
import { MicrocosmicService } from '../../../microcosmic.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-honor',
  templateUrl: './honor.component.html',
  styles: ['']
})
export class HonorComponent implements OnInit {

  private companyName = 'test1';

  governmentHonorList = [];
  administrationHonorList = [];
  commendHonorList = [];
  otherHonorList = [];
  GovernmentHonorTips = '加载中...';
  AdministrationHonorTips = '加载中...';
  CommendHonorTips = '加载中...';
  OtherHonorTips = '加载中...';

  constructor(
    private companyCreditService: CompanyCreditService,
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService
  ) { }
  keyWord: any;
  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);

    this.getGovernmentHonor();
    this.getAdministrationHonor();
    this.getCommendHonor();
    // this.getOtherHonor();
  }

  /*获取政府表彰信息*/
  getGovernmentHonor() {
    this.companyCreditService.getGovernmentHonor(this.companyName).subscribe(res => {
      if (res.data.eCIHonorPojo.length < 1) {
        this.GovernmentHonorTips = '暂无信息！';
      }
      res.data.eCIHonorPojo.forEach((v, i) => {
        this.governmentHonorList.push(v);
      });
    });

  }
  /*获取行政奖励信息*/
  getAdministrationHonor() {
    this.companyCreditService.getAdministrationHonor(this.companyName).subscribe(res => {
      if (res.data.eCIHonorPojo.length < 1) {
        this.AdministrationHonorTips = '暂无信息！';
      }
      res.data.eCIHonorPojo.forEach((v, i) => {
        this.administrationHonorList.push(v);
      });
    });
  }
  /*获取表彰奖励信息*/
  getCommendHonor() {
    this.companyCreditService.getCommendHonor(this.companyName).subscribe(res => {
      if (res.data.eCIHonorPojo.length < 1) {
        this.CommendHonorTips = '暂无信息！';
      }
      res.data.eCIHonorPojo.forEach((v, i) => {
        this.commendHonorList.push(v);
      });
    });
  }
  /*获取其他奖励信息*/
  getOtherHonor() {
    this.companyCreditService.getCommendHonor(this.companyName).subscribe(res => {
      if (res.data.eCIHonorPojo.length < 1) {
        this.OtherHonorTips = '暂无信息！';
      }
      res.data.eCIHonorPojo.forEach((v, i) => {
        this.otherHonorList.push(v);
      });
    });
  }

}
