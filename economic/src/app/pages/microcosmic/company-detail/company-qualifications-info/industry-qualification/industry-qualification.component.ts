import { Component, OnInit } from '@angular/core';
import { CompanyDetailService, RequestParams } from '../../company-detail.service';

@Component({
  selector: 'app-industry-qualification',
  templateUrl: './industry-qualification.component.html',
  styles: []
})
export class IndustryQualificationComponent implements OnInit {

  // 资质证书
  Certifications = [];
  getCertificationParamas: RequestParams = { companyName: 'test1', pageSize: 3, lastRowKey: '', type: 'Certification' };
  constructor(
    private companyDetailService: CompanyDetailService
  ) { }

  ngOnInit() {
    this.getCertification();
  }

  // 行业资质证书
  getCertification() {
    this.companyDetailService.findListByCompanyName(this.getCertificationParamas)
      .subscribe(res => {
        if (res.responseCode === '_200') {
          console.log(res.data.pagination.lastRowKey);
          this.getCertificationParamas.lastRowKey = res.data.pagination.lastRowKey;
          this.Certifications = [...this.Certifications, ...res.data.eQICertificationPojo];
        }
      });
  }

}
