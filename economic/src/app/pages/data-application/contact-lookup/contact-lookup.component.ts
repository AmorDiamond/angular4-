import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.css']
})
export class ContactLookupComponent implements OnInit {

  constructor() { }
  companyList = [];
  ngOnInit() {
  }
  /*搜索数据*/
  getList() {
    const options = [
      {name: '成都维纳软件股份有限公司', industryType: '电子信息', address: '成都高新区天华一路99号天府软件园B区3栋2楼'},
      {name: '成都尚作电子商务有限公司', industryType: '电子信息', address: '四川省成都高新区府城大道西段399号9栋12层5号'},
      {name: '成都迪康药业有限公司', industryType: '生物医药', address: '成都高新区（西区）西芯大道9号'},
      {name: '成都恒瑞制药有限公司', industryType: '生物医药', address: '成都高新区西部园区百草路18号'},
      {name: '成都合力科技有限公司', industryType: '电子信息', address: '成都高新区天府大道北段1480号高新科技孵化园5号楼108房'},
      {name: '成都风行科技有限公司', industryType: '电子信息', address: '成都高新区紫竹中街14号'},
      {name: '成都地奥九泓制药厂', industryType: '电子信息', address: '四川省成都市高新区高新大道创业路26号'},
      {name: '布鲁克(成都)工程有限公司', industryType: '先进制造', address: '四川省成都高新技术产业开发西区'},
      {name: '成都荣耀科技有限公司', industryType: '先进制造', address: '成都高新区天府大道南延线高新孵化园1号楼'},
    ];
    this.companyList = options;
  }
}
