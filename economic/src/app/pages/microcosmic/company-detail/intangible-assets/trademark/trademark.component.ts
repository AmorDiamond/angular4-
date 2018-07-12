import { Component, OnInit } from '@angular/core';
import { CompanyAssetsService } from '../company-assets.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';

@Component({
  selector: 'app-trademark',
  templateUrl: './trademark.component.html',
  styles: []
})
export class TrademarkComponent implements OnInit {

  trademarkList = [];
  trademarkListPramas = { enterpriseName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  constructor(
    private companyAssetsService: CompanyAssetsService,
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService
  ) { }
  keyWord: any;
  TrademarkListTips = '加载中...';
  ngOnInit() {
    /*this.routerInfo.params.subscribe((params: Params) => {
      this.keyWord = params['name'];
      this.microcomicService.setCompanyName(this.keyWord);
      this.trademarkListPramas.companyName = this.keyWord;
      this.getTrademarkList();
    });*/
    this.keyWord = this.routerInfo.snapshot.queryParams['name'];

    this.microcomicService.setCompanyName(this.keyWord);
    this.trademarkListPramas.enterpriseName = this.keyWord;
    this.getTrademarkList();
  }

  getTrademarkList() {
    this.companyAssetsService.getDataList(this.trademarkListPramas, 'companyTrademarkListUrl').subscribe(res => {
      console.log('商标', res);
      // this.trademarkList = res.data.iATrademarkPojos;
      if (res.responseCode === '_200') {
        if (res.data.iATrademarkPojos.length < 1) {
          this.TrademarkListTips = '暂无信息！';
        }
        this.trademarkList = [...this.trademarkList, ...res.data.iATrademarkPojos ? res.data.iATrademarkPojos : []];
        this.trademarkListPramas.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }
}
