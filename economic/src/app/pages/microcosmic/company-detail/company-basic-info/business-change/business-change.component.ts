import { Component, OnInit } from '@angular/core';
import { CompanyBasicService } from '../company-basic.service';
import { MicrocosmicService } from '../../../microcosmic.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-business-change',
  templateUrl: './business-change.component.html',
  styles: []
})
export class BusinessChangeComponent implements OnInit {

  companyChangeList = [];
  constructor(
    private companyBasicService: CompanyBasicService,
    private microcomicService: MicrocosmicService,
    private routerInfo: ActivatedRoute
  ) { }

  subscription: Subscription;
  companyName: any;
  keyWord: any;
  CompanyChangeInfoTips = '加载中...';
  ngOnInit() {

    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    this.getCompanyChangeInfo();
  }

  /*获取工商变更信息*/
  getCompanyChangeInfo() {

    this.companyBasicService.getCompanyChangeInfo(this.companyName).subscribe(res => {
      console.log('工商变更', res)
      if (res.responseCode === '_200') {
        if (res.data.epChangeInfo.length < 1) {
          this.CompanyChangeInfoTips = '暂无信息！';
        }
        this.companyChangeList = res.data.epChangeInfo;
      }
    });
  }

}
