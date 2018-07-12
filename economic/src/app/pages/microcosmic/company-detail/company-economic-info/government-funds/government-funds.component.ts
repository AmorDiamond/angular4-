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
  //   项目申报
  ProjectDeclarations = [];
  GovernmentProjectTips = '加载中...';
  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    /*获取政府项目申报信息*/
    this.getGovernmentProject();
  }
  /*获取政府项目申报信息*/
  getGovernmentProject() {
    this.companyEconomicInfoService.getProjectDeclaration(this.companyName).subscribe(res => {
      console.log('政府项目申报', res);
      if (res.responseCode === '_200') {
        if (res.data.kETProjectDeclarationPojo.length < 1) {
          this.GovernmentProjectTips = '暂无信息！';
        }
        this.ProjectDeclarations = res.data.kETProjectDeclarationPojo;
      }
    });
  }

}
