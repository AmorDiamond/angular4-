import { Component, OnInit } from '@angular/core';
import { CompanyAssetsService } from '../company-assets.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';

@Component({
  selector: 'app-patent',
  templateUrl: './patent.component.html',
  styles: []
})
export class PatentComponent implements OnInit {

  patenList = [];
  patentListPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  constructor(
    private companyAssetsService: CompanyAssetsService,
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService
  ) { }
  keyWord: any;
  PatentListTips = '加载中...';
  ngOnInit() {
    this.keyWord = this.routerInfo.snapshot.queryParams['name'];

    this.microcomicService.setCompanyName(this.keyWord);
    this.patentListPramas.companyName = this.keyWord;
    this.getPatentList();
  }

  getPatentList() {
    this.companyAssetsService.getDataList(this.patentListPramas, 'companyPatentListUrl').subscribe(res => {
      console.log('专利', res.data);
      if (res.responseCode === '_200') {
        if (res.data.patentPojos.length < 1) {
          this.PatentListTips = '暂无信息！';
        }
        this.patenList = [...this.patenList, ...res.data.patentPojos];
        this.patentListPramas.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }
}
