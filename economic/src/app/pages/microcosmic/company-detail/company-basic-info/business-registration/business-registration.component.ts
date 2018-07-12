import { Component, OnInit } from '@angular/core';
import { CompanyBasicService } from '../company-basic.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';

@Component({
  selector: 'app-business-registration',
  templateUrl: './business-registration.component.html',
  styles: ['']
})
export class BusinessRegistrationComponent implements OnInit {

  companyDetail: any;
  constructor(
    private companyBasicService: CompanyBasicService, private routerInfo: ActivatedRoute, private microcomicService: MicrocosmicService
  ) { }
  keyWord: any;
  CompanyDetailTips = '加载中...';
  ngOnInit() {

    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.getCompanyDetail();
  }

  /*获取工商信息*/
  getCompanyDetail() {

    this.companyBasicService.getCompanyDetail(this.keyWord).subscribe(res => {
      if (res.responseCode === '_200') {
        if (!res.data) {
          this.CompanyDetailTips = '暂无信息！';
        }
        this.companyDetail = res.data;
      }
    });
  }

}
