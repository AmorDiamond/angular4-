import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IntermediateService } from '../../../intermediate.service';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { IndustryMenuService } from "../industry-menu.service";

@Component({
  selector: 'app-lead-industry',
  templateUrl: './lead-industry.component.html',
  styleUrls: ['./lead-industry.component.css']
})
export class LeadIndustryComponent implements OnInit {

  constructor(
    private store: Store<ContainerStyle>,
    private intermediateService: IntermediateService,
    private industryMenuService: IndustryMenuService
  ) {
    this.store.pipe(select('container'));
  }
  leadIndustryTopList = [];
  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('IndustryMenu');
    this.getData();
  }
  /*获取数据*/
  getData() {
    this.industryMenuService.getDataByParams({}, 'enterpriseLeadIndustry100Url').subscribe(res => {
      console.log('分布数据', res);
      if(res.responseCode === '_200') {
        if(res.data.length) {
          this.leadIndustryTopList = res.data;
        }
      }
    });
  }

}
