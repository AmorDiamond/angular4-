import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from "../../../microcosmic/microcosmic.service";

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {

  constructor(private microcomicService: MicrocosmicService) { }
  contactDataList = [];
  companyName: any;
  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.getList()
  }
  /*获取数据*/
  getList() {
    let options = [];
    if(this.companyName === '成都尚作电子商务有限公司') {
      options = [
        {name: '陆丙海', job: '经理', phone: '15928740574'},
        {name: '侯文杰', job: '公共关系总监', phone: '13882105351'}
      ];
    }else if(this.companyName === '成都迪康药业有限公司') {
      options = [
        {name: '王学明', job: '政府事务', phone: '13308082653'},
        {name: '蒲太平', job: '总工程师', phone: '13908087572'}
      ];
    }else if(this.companyName === '成都恒瑞制药有限公司') {
      options = [
        {name: '朱德琪', job: '行政总监', phone: '13540710680'},
        {name: '王琴', job: '总经理', phone: '13708444761'}
      ];
    }else if(this.companyName === '成都维纳软件股份有限公司') {
      options = [
        {name: '周密', job: '公司总裁', phone: '13908072069'},
        {name: '陈铸', job: '总经理', phone: '15982210521'},
        {name: '张爱民', job: '技术总监', phone: '13654983038'},
        {name: '宋桂芳', job: '人事总监', phone: '18010520328'}
      ];
    }else {
      options = [];
    }
    this.contactDataList = options;
  }

}
