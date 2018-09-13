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
  changeInfoParams = {
    enterpriseName: '',
    pageSize: 15,
    lastRowKey: ''
  };
  keyWord: any;
  CompanyChangeInfoTips = '加载中...';
  ngOnInit() {

    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    this.changeInfoParams.enterpriseName = this.companyName;
    this.getCompanyChangeInfo();
  }

  /*获取工商变更信息*/
  getCompanyChangeInfo() {
    this.companyBasicService.findListByUrl(this.changeInfoParams, 'companyChangeInfoUrl').subscribe(res => {
      console.log('工商变更', res)
      if (res.responseCode === '_200') {
        if (res.data.epChangeInfo.length < 1) {
          this.CompanyChangeInfoTips = '暂无信息！';
        }
        const list = res.data.epChangeInfo;
        list.sort(this.compareFn('changeDate', 'asc'));
        this.companyChangeList = [...this.companyChangeList, ...list];
        this.changeInfoParams.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }
  /*格式化排序*/
  compareFn(prop, type?) {
    return function (obj1, obj2) {
      let val1 = obj1[prop];
      let val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (type === 'asc') {
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      }else{
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      }
    };
  }

}
