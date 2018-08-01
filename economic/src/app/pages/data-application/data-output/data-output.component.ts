import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-output',
  templateUrl: './data-output.component.html',
  styleUrls: ['./data-output.component.css']
})
export class DataOutputComponent implements OnInit {

  constructor() { }
  companyList = [];
  downLoadData = {
    registerType: true,
    registerMoney: true,
    address: true,
    industryType: true,
    contactPeople: true,
    contactPhone: true,
    operatingIncome: true,
    taxPay: true
  };
  downLoadDataExcelName = '数据输出信息表';
  ngOnInit() {
  }
  /*获取数据*/
  getList() {
    const options = [
      {
        name: '成都天奥集团有限公司',
        registerType: '有限责任公司（非自然人投资或控股的法人独资）',
        registerMoney: '412680',
        address: '成都市高新西区新业路88号',
        industryType: '电子信息',
        contactPeople: '未知',
        contactPhone: '未知',
        operatingIncome: '1288047.49',
        taxPay: '3005.82'
      },
      {
        name: '富通光纤光缆（成都）有限公司',
        registerType: '有限责任公司（非自然人投资或控股的法人独资）',
        registerMoney: '205080',
        address: '四川省成都高新技术产业开发区（西区）西区大道77号',
        industryType: '电子信息',
        contactPeople: '吕友平',
        contactPhone: '13350868911',
        operatingIncome: '969783',
        taxPay: '39583'
      },
      {
        name: '成都富通光通信技术有限公司',
        registerType: '有限责任公司（非自然人投资或控股的法人独资）',
        registerMoney: '14700',
        address: '成都高新区（西区）百草路78号',
        industryType: '电子信息',
        contactPeople: '吕友平',
        contactPhone: '13350868911',
        operatingIncome: '699865',
        taxPay: '19963'
      },
      {
        name: '四川汇源光通信有限公司',
        registerType: '有限责任公司（非自然人投资或控股的法人独资）',
        registerMoney: '108000',
        address: '成都市高新西区新业路2号',
        industryType: '电子信息',
        contactPeople: '龙仕群',
        contactPhone: '028-87826104',
        operatingIncome: '193794',
        taxPay: '11037'
      },
      {
        name: '成都盟升科技有限公司',
        registerType: '有限责任公司(自然人投资或控股)',
        registerMoney: '20000',
        address: '成都市高新西区西芯大道5号(汇都总部园5栋1号楼)',
        industryType: '电子信息',
        contactPeople: '袁勇',
        contactPhone: '13084424059',
        operatingIncome: '183309',
        taxPay: '19259'
      },
      {
        name: '成都驰通数码系统有限公司',
        registerType: '有限责任公司（非自然人投资或控股的法人独资）',
        registerMoney: '30000',
        address: '成都高新区天虹路5号',
        industryType: '电子信息',
        contactPeople: '樊勋',
        contactPhone: '87839922-567',
        operatingIncome: '56919',
        taxPay: '6864'
      },
      {
        name: '成都因纳伟盛科技股份有限公司',
        registerType: '其他股份有限公司（非上市）',
        registerMoney: '20000',
        address: '成都高新区西芯大道3号',
        industryType: '电子信息',
        contactPeople: '殷海燕',
        contactPhone: '13438805451',
        operatingIncome: '44109',
        taxPay: '780'
      },
      {
        name: '凌阳成芯科技（成都）有限公司',
        registerType: '有限责任公司(外国自然人独资)',
        registerMoney: '137650',
        address: '成都市高新区天府四街117、153号1栋1楼1号',
        industryType: '电子信息',
        contactPeople: '未知',
        contactPhone: '未知',
        operatingIncome: '44032',
        taxPay: '1950'
      },
      {
        name: '敦阳泰克科技（成都）有限公司',
        registerType: '有限责任公司(台港澳合资)',
        registerMoney: '8000',
        address: '四川省成都市高新西区天辰路88号2号楼3单元',
        industryType: '电子信息',
        contactPeople: '未知',
        contactPhone: '未知',
        operatingIncome: '37037',
        taxPay: '9138'
      },
      {
        name: '成都锐新科技有限公司',
        registerType: '有限责任公司（非自然人投资或控股的法人独资）',
        registerMoney: '10454.54',
        address: '成都市高新西区西芯大道4号C237',
        industryType: '电子信息',
        contactPeople: '周晔',
        contactPhone: '13438827257',
        operatingIncome: '31649',
        taxPay: '4485'
      },
      {
        name: '成都瀚德科技有限公司',
        registerType: '有限责任公司（非自然人投资或控股的法人独资）',
        registerMoney: '15000',
        address: '成都市高新西区西芯大道5号汇都企业总部园3号楼5楼',
        industryType: '电子信息',
        contactPeople: '陈鲜',
        contactPhone: '028-65300967',
        operatingIncome: '30539',
        taxPay: '2778'
      },
      {
        name: '四川省视频电子有限责任公司',
        registerType: '有限责任公司（非自然人投资或控股的法人独资）',
        registerMoney: '20000',
        address: '成都市高新区新创路12号',
        industryType: '电子信息',
        contactPeople: '丁辉',
        contactPhone: '028-83879234',
        operatingIncome: '27426',
        taxPay: '4752'
      },
      {
        name: '成都华光瑞芯微电子股份有限公司',
        registerType: '其他股份有限公司（非上市）',
        registerMoney: '20000',
        address: '成都市高新区天虹路5号',
        industryType: '电子信息',
        contactPeople: '董欢',
        contactPhone: '董欢',
        operatingIncome: '24849.13',
        taxPay: '2952.12'
      },
      {
        name: '成都顺康电子有限责任公司',
        registerType: '有限责任公司(自然人投资或控股)',
        registerMoney: '18000',
        address: '成都高新区西部园区新航路4号',
        industryType: '电子信息',
        contactPeople: '叶峰',
        contactPhone: '028-87843536',
        operatingIncome: '21075',
        taxPay: '630'
      },
      {
        name: '成都宝利根科技有限公司',
        registerType: '有限责任公司（非自然人投资或控股的法人独资）',
        registerMoney: '1000',
        address: '成都高新西区古楠街315号',
        industryType: '电子信息',
        contactPeople: '未知',
        contactPhone: '未知',
        operatingIncome: '19399',
        taxPay: '1467'
      }
      ];
    this.companyList = options;
  }
  /*导出数据*/
  downLoadDataFn() {
    console.log(this.downLoadData)
  }
}
