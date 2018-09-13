import { Component, OnInit } from '@angular/core';
import { CompanyBasicService } from '../company-basic.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';

@Component({
  selector: 'app-tax-registration',
  templateUrl: './tax-registration.component.html',
  styles: []
})
export class TaxRegistrationComponent implements OnInit {

  companyTaxationList = [];
  constructor(
    private companyBasicService: CompanyBasicService, private routerInfo: ActivatedRoute, private microcomicService: MicrocosmicService
  ) { }
  keyWord: any;
  CompanyTaxationTips = '加载中...';
  companyTaxationParams = {
    companyName: '',
    pageSize: 15,
    lastRowKey: ''
  };
  ngOnInit() {
    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.companyTaxationParams.companyName = this.keyWord;
    this.getCompanyTaxation();
  }

  /*获取税务登记信息*/
  getCompanyTaxation() {

    this.companyBasicService.findListByUrl(this.companyTaxationParams, 'companyTaxationUrl').subscribe(res => {
      console.log('税务登记', res)
      if (res.responseCode === '_200') {
        if (res.data.epTaxationPojo.length < 1) {
          this.CompanyTaxationTips = '暂无信息！';
        }
        this.companyTaxationList = [...this.companyTaxationList, ...res.data.epTaxationPojo];
        this.companyTaxationParams.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }

}
