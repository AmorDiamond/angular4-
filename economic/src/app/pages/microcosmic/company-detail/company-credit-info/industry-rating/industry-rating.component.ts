import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CompanyCreditService } from '../company-credit.service';

@Component({
  selector: 'app-industry-rating',
  templateUrl: './industry-rating.component.html',
  styleUrls: ['./industry-rating.component.css']
})
export class IndustryRatingComponent implements OnInit {

  constructor(
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService,
    private companyCreditService: CompanyCreditService
  ) { }
  keyWord: any;
  IndustryRatingParams = { companyName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  IndustryRating = [];
  IndustryRatingTips = '加载中...';
  ngOnInit() {
    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.IndustryRatingParams.companyName = this.keyWord;
    this.getIndustryRating();
  }
  getIndustryRating() {
    this.companyCreditService.findListByCompanyName(this.IndustryRatingParams, 'IndustryRating').subscribe(res => {
      console.log('行业评级信息', res.data.eIIApAssetsPojo);
      if (res.responseCode === '_200') {
        if (res.data.eIIApAssetsPojo.length < 1) {
          this.IndustryRatingTips = '暂无信息！';
        }
        this.IndustryRatingParams.lastRowKey = res.data.pagination.lastRowKey;
        this.IndustryRating = [...this.IndustryRating, ...res.data.eIIApAssetsPojo];
      }
    });
  }

}
