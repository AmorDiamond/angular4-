import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyEconomicInfoService } from '../company-economic-info.service';

@Component({
  selector: 'app-government-funds',
  templateUrl: './government-funds.component.html',
  styleUrls: ['./government-funds.component.css']
})
export class GovernmentFundsComponent implements OnInit {

  constructor(
    private microcomicService: MicrocosmicService,
    private companyEconomicInfoService: CompanyEconomicInfoService
  ) { }
  companyName: any;
  findParams = {
    enterpriseName: '',
    page: 0,
    size: 15
  };
  pageParams = {
    maxSize: 5,
    itemsPerPage: this.findParams.size,
    bigTotalItems: 10,
    bigCurrentPage: 1,
    numPages: 0,
    totalPages: 0
  };
  //   项目申报
  ProjectDeclarations = [];
  totalMoney = 0;
  GovernmentProjectTips = '加载中...';
  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    this.findParams.enterpriseName = this.companyName;
    /*获取政府项目申报信息*/
    this.getGovernmentProject();
  }
  /*获取政府项目申报信息*/
  getGovernmentProject() {
    this.companyEconomicInfoService.findListByUrl(this.findParams, 'companyProjectDeclarationUrl').subscribe(res => {
      console.log('政府支持信息', res);
      if (res.responseCode === '_200') {
        this.ProjectDeclarations = [...this.ProjectDeclarations, ...res.data.governmentsupports.content];
        this.pageParams.totalPages = res.data.governmentsupports.totalPages;
        this.findParams.page = res.data.governmentsupports.number + 1;
        this.totalMoney = res.data.total;
        if (this.ProjectDeclarations.length < 1) {
          this.GovernmentProjectTips = '暂无信息！';
        }
      }
    });
  }

}
