import { Component, OnInit } from '@angular/core';
import { CompanyDetailService, RequestParams } from '../../company-detail.service';

@Component({
  selector: 'app-famous-product',
  templateUrl: './famous-product.component.html',
  styles: []
})
export class FamousProductComponent implements OnInit {
  // 名优产品
  FamousProduct = [];
  getFamousProductParamas: RequestParams = { companyName: 'test1', pageSize: 3, lastRowKey: '', type: 'FamousProduct' };
  constructor(
    private companyDetailService: CompanyDetailService
  ) { }

  ngOnInit() {
    this.getFamousProduct();
  }

  // 名优产品
  getFamousProduct() {
    this.companyDetailService.findListByCompanyName(this.getFamousProductParamas)
      .subscribe(res => {
        console.log('查询到的名优产品信息=============>', res);
        this.getFamousProductParamas.lastRowKey = res.data.pagination.lastRowKey;
        this.FamousProduct = [...this.FamousProduct, ...res.data.eQIFamousProductPojo];
      });
  }

}
