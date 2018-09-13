import { Component, OnInit } from '@angular/core';
import { CompanyBasicService } from '../company-basic.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';

@Component({
  selector: 'app-social-security',
  templateUrl: './social-security.component.html',
  styles: [`
    .table-label{
        width: 110px;
    }
  `]
})
export class SocialSecurityComponent implements OnInit {

  companyDetailList: any = [];
  keyWord: any;
  CompanyDetailTips = '加载中...';
  securityParams = {
    companyName: '',
    pageSize: 15,
    lastRowKey: ''
  };
  constructor(
    private companyBasicService: CompanyBasicService, private routerInfo: ActivatedRoute, private microcomicService: MicrocosmicService
  ) { }

  ngOnInit() {
    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.securityParams.companyName = this.keyWord;
    this.getCompanyDetail();
  }

  /*获取社会保障信息*/
  getCompanyDetail() {

    /*this.companyBasicService.getCompanyDetail(this.keyWord).subscribe(res => {
      this.companyDetail = res.data;
    });*/
    this.companyBasicService.findListByUrl(this.securityParams, 'companySocialSecurityUrl').subscribe(res => {
      console.log('社会保障信息', res)
      if (res.responseCode === '_200') {
        if (res.data.informationPojo.length < 1) {
          this.CompanyDetailTips = '暂无信息！';
        }
        this.companyDetailList = [...this.companyDetailList, ...res.data.informationPojo];
        this.securityParams.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }

}
