import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quality-recommend',
  templateUrl: './quality-recommend.component.html',
  styleUrls: ['./quality-recommend.component.css']
})
export class QualityRecommendComponent implements OnInit {

  constructor() { }
  companyList = [];
  ngOnInit() {
    this.getList();
  }
  /*搜索数据*/
  getList() {
    const options = [
      {name: '四川三联新材料有限公司', industryType: '制造业', address: '成都市益州大道北段280号'},
      {name: '成都青山利康药业有限公司', industryType: '医药制造业', address: '成都市双流区西航港空港五路2888号'},
      {name: '成都优途科技有限公司', industryType: '制造业', address: '成都高新西区西区大道199号模具工业园C3'},
      {name: '四川沃文特生物技术有限公司', industryType: '生物医药', address: '体外诊断产品系统的研发、生产、销售和服务'},
      {name: '成都中住光纤有限公司', industryType: '通讯', address: '成都高新西区西源大道56号'},
      {name: '成都中住光纤有限公司', industryType: '通讯', address: '成都高新西区西源大道56号'},
      {name: '成都熊谷加世电器有限公司', industryType: '金属切割及焊接设备制造', address: '成都市高新区天彩路100号'},
      {name: '四川龙瑞微电子有限公司', industryType: '新一代信息技术', address: '成都高新区科韵路368号五楼'},
      {name: '中电科航空电子有限公司', industryType: '航空产业', address: '成都市高新西区百川路9号'},
      {name: '成都西南交大驱动技术有限责任公司', industryType: '制造业', address: '四川省成都市高新区肖家河街134号'},
      {name: '成都交大川电科技有限公司', industryType: '制造业', address: '成都市高新区西芯大道5号'},
      {name: '布鲁克（成都）工程有限公司', industryType: '制造业', address: '未知'},
      {name: '成都赛来科技有限公司', industryType: '3443', address: '成都高新区天府大道北段1480号8栋2单 602'},
      {name: '成都汇通西电电子有限公司', industryType: '制造业', address: '成都高新西区西区大道199号模具工业园C3'},
      {name: '成都登辉科技有限公司', industryType: '轨道交通配套', address: '成都高新区益州大道中段1858号1704室'},
      {name: '成都旺旺食品有限公司', industryType: '食品', address: '成都高新西区南北大道1388号'},
      {name: '成都华西海圻医药科技有限公司', industryType: '医药', address: '成都市高新区高朋大道28号'},
      {name: '四川亚联高科技股份有限公司', industryType: '制造业', address: '四川省成都市双流区西航港长城路一段201号'},
      {name: '戴尔（成都）有限公司', industryType: '电子信息', address: '成都高新区天府三街288号迈普大厦13楼'},
      {name: '博腾电子产品（成都）有限公司', industryType: '电子信息', address: '高新区益州大道中段1800号3栋4层'},
      {name: '四川君逸数码科技股份有限公司', industryType: '电子信息', address: '成都高新区天府三街288号迈普大厦13楼'},
      {name: '成都锐新科技有限公司', industryType: '集成电路', address: '成都市高新区西芯大道4号C237'},
    ];
    this.companyList = options;
  }
}
