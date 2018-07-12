import { Component, OnInit } from '@angular/core';
import { CompanyAssetsService } from '../company-assets.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';

@Component({
  selector: 'app-icp',
  templateUrl: './icp.component.html',
  styles: []
})
export class IcpComponent implements OnInit {

  icpList = [];
  icpListPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };

  constructor(
    private companyAssetsService: CompanyAssetsService,
  private routerInfo: ActivatedRoute,
  private microcomicService: MicrocosmicService
  ) { }
  keyWord: any;
  IcpListTips = '加载中...';
  ngOnInit() {
    this.keyWord = this.routerInfo.snapshot.queryParams['name'];

    this.microcomicService.setCompanyName(this.keyWord);
    this.icpListPramas.companyName = this.keyWord;
    this.getIcpList();
  }

  getIcpList() {
    this.companyAssetsService.getDataList(this.icpListPramas, 'companyIcpListUrl').subscribe(res => {
      console.log('ICP', res.data);
      if (res.responseCode === '_200') {
        if (res.data.iAIcpPojos.length < 1) {
          this.IcpListTips = '暂无信息！';
        }
        this.icpList = [...this.icpList, ...res.data.iAIcpPojos];
        this.icpListPramas.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }
}
