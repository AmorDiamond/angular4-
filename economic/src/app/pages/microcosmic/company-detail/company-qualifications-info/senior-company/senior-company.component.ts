import { Component, OnInit } from '@angular/core';
import { CompanyDetailService, RequestParams } from '../../company-detail.service';

@Component({
  selector: 'app-senior-company',
  templateUrl: './senior-company.component.html',
  styles: []
})
export class SeniorCompanyComponent implements OnInit {

  // 高新技术
  getHiTechCertificationParamas: RequestParams = { companyName: 'test1', pageSize: 3, lastRowKey: '', type: 'HiTechCertification' };
  HiTechCertifications = [];
  constructor(
    private companyDetailService: CompanyDetailService,
  ) { }

  ngOnInit() {
    this.getHiTechCertification();
  }

  // 高新技术信息
  getHiTechCertification() {
    this.companyDetailService.findListByCompanyName(this.getHiTechCertificationParamas)
      .subscribe(res => {
        console.log('查询到的高新技术信息=============>', res);
        this.getHiTechCertificationParamas.lastRowKey = res.data.pagination.lastRowKey;
        this.HiTechCertifications = [...this.HiTechCertifications, ...res.data.eQIHiTechCertificationPojo];
      });
  }
}
