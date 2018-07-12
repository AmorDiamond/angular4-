import { Component, OnInit } from '@angular/core';
import { RequestParams, CompanyDetailService } from '../../company-detail.service';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styles: []
})
export class StandardComponent implements OnInit {

  // 标准制定
  StandardSettings = [];
  getStandardSettingParamas: RequestParams = { companyName: 'test1', pageSize: 3, lastRowKey: '', type: 'StandardSetting' };
  constructor(
    private companyDetailService: CompanyDetailService,
  ) { }

  ngOnInit() {
    this.getStandardSetting();
  }

  // 标准制定
  getStandardSetting() {
    this.companyDetailService.findListByCompanyName(this.getStandardSettingParamas)
      .subscribe(res => {
        console.log('查询到的标准制定信息=============>', res);
        this.getStandardSettingParamas.lastRowKey = res.data.pagination.lastRowKey;
        this.StandardSettings = [...this.StandardSettings, ...res.data.eQIStandardSettingPojo];
      });
  }
}
