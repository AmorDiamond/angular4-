import { Component, OnInit } from '@angular/core';
import { CompanyAssetsService } from '../company-assets.service';

@Component({
  selector: 'app-domain-name',
  templateUrl: './domain-name.component.html',
  styles: []
})
export class DomainNameComponent implements OnInit {

  domainList = [];
  domainListPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  constructor(
    private companyAssetsService: CompanyAssetsService
  ) { }

  ngOnInit() {
    this.getDomainList();
  }

  getDomainList() {
    this.companyAssetsService.getDataList(this.domainListPramas, 'companyDomainListUrl').subscribe(res => {
      console.log('域名', res.data);
      this.domainList = res.data.iAIcpPojos;
      console.log(this.domainList);
      this.domainListPramas.lastRowKey = res.data.pagination.lastRowKey;
    });
  }

}
