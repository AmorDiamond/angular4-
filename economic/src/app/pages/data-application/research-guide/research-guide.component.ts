import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-research-guide',
  templateUrl: './research-guide.component.html',
  styleUrls: ['./research-guide.component.css']
})
export class ResearchGuideComponent implements OnInit {

  constructor() { }
  companyList = [];
  ngOnInit() {
  }
  /*搜索数据*/
  getList() {
    const options = [
      {name: '成都国腾实业集团有限公司', industryType: '电子信息', address: '四川省成都市高新西区西芯大道3号国腾科技园'},
      {name: '成都国腾电子集团有限公司', industryType: '先进制造', address: '四川省成都市高新区高朋大道1号'},
      {name: '四川国腾科技有限公司', industryType: '未知', address: '四川省成都市郫县高新西区镇西芯大道3号'},
      {name: '成都国腾信息安全技术有限责任公司', industryType: '未知', address: '四川省成都市高新区高新大道创业路8号'},
      {name: '成都国腾软资金海科技有限公司', industryType: '未知', address: '四川省成都市高新技术开发区西区百叶路1号'}
    ];
    this.companyList = options;
  }
}
