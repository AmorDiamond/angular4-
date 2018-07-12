import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyEconomicInfoService } from '../company-economic-info.service';
import { CompanyDetailService } from '../../company-detail.service';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.css']
})
export class JobOffersComponent implements OnInit {

  constructor(
    private microcomicService: MicrocosmicService,
    private companyEconomicInfoService: CompanyEconomicInfoService,
    private companyDetailService: CompanyDetailService,
  ) { }
  companyName: any;
  EIIRecruitParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '', type: 'EIIRecruit' };
  EIIRecruit = [];
  EIIRecruitTips = '加载中...';

  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    /*招聘信息*/
    this.findEIIRecruitPage();
  }
  // 招聘信息
  findEIIRecruitPage() {
    this.companyDetailService.findListByCompanyName(this.EIIRecruitParams)
      .subscribe(res => {
        if (res.responseCode === '_200') {
          console.log('招聘信息======================>', res);
          if (res.data.eIIRecruitPojos.length < 1) {
            this.EIIRecruitTips = '暂无信息！';
          }
          this.EIIRecruit = [...this.EIIRecruit, ...res.data.eIIRecruitPojos];
          this.EIIRecruitParams.lastRowKey = res.data.pagination.lastRowKey;
        }
      });
  }

}
