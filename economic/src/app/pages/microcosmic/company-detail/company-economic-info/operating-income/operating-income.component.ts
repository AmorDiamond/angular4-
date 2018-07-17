import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyEconomicInfoService } from '../company-economic-info.service';

@Component({
  selector: 'app-operating-income',
  templateUrl: './operating-income.component.html',
  styleUrls: ['./operating-income.component.css']
})
export class OperatingIncomeComponent implements OnInit {

  constructor(
    private microcomicService: MicrocosmicService,
    private companyEconomicInfoService: CompanyEconomicInfoService
  ) { }
  companyName: any;
  businessIncomeRatioData: any;
  businessIncomeData: any;
  businessIncomeRatioLoading = true;
  echartsParams = { companyName: 'test1', currentPage: 0, pageSize: 20, lastRowKey: '' };
  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    /*获取营业收入信息*/
    this.getBusinessIncome()
    /*获取收入占比信息*/
    this.getBusinessIncomeRatio();
  }
  /*获取营业收入信息*/
  getBusinessIncome() {
    this.companyEconomicInfoService.findListByUrl(this.companyName, 'companyIncomeStatisticsByYearUrl').subscribe(res => {
      console.log('获取营业收入', res)
      this.creatBusinessIncomeEChart(res.data, [2015, 2016, 2017]);
    });
    /*this.companyEconomicInfoService.getIncomeStatisticsByYear('鸿富锦精密电子(成都)有限公司', [2015, 2016, 2017]).subscribe(results => {
      console.log('获取营业收入', results)
      const datas = [results[0].data, results[1].data, results[2].data];
      this.creatBusinessIncomeEChart(datas);
    });*/
  }
  /*获取收入占比信息*/
  getBusinessIncomeRatio() {
    this.companyEconomicInfoService.getRevenueShare(this.companyName, new Date().getFullYear() - 1).subscribe(res => {
      console.log('获取收入占比', res);
      /*const data = {
        2017:{"timestemp":1529639550524,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"5b877abb-e9d9-42d5-a6eb-3e8a5b09cbd1","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":1200,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"75316988-4b84-49e9-acc1-88cacecd6687","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":352,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"b99c91d6-0f05-4909-9e0a-c7314d1d1f8b","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":500,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"bdb5dcc1-6d33-4528-9def-0e2767fa79bf","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":1100,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"d81e707e-3137-4fb2-a45f-31f910598a7f","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":157,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"f97a4444-075c-4252-97c5-9dda887bfc7d","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":850,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
        2016:{"timestemp":1529639635285,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"1d96d4d6-2f56-480d-bd40-6ea217a981a8","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":1850,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"3fcde07e-aaf4-491b-96fa-791e4ac0a2f6","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":200,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"8b676875-03ef-4ac4-8004-34c0cd7df68e","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":100,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"8d4d0f19-87af-4386-b83b-87eaf4b1240c","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":252,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"94e496e1-f9cc-4f79-82ec-7ebddc93d75b","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":157,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"e658ccdf-fcb5-4fda-a500-845c13d63888","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":1100,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
        2015: {"timestemp":1529639682720,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"3ae4e1d2-2f51-4627-a14d-233a4f522ea4","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":600,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"5299a6e9-a03a-4922-a5e0-e809bcc29dcd","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":357,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"64db7775-3fb0-4e8e-8bee-48319aa7b6ee","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":452,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"69e3d6ea-f778-4148-9982-9d7d23bf59e1","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":621,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"a17e8044-e39a-44a3-9340-7fff47200a4d","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":320,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"ec4eb106-e213-47c5-a68f-edcc67618c4b","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":850,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
        2014: {"timestemp":1529640281853,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"5eb2c7d7-1659-487b-937a-c1d664c3d859","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":621,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"67bdd1c6-bc10-4f39-aa0d-e2c2d09bf4ae","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":751,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"96b97bb6-c206-4c0b-896d-a8ee3323318f","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":452,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"9a00cf07-31f3-4ef2-8a47-c2a6efe1e43d","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":621,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"db0a491b-341a-4a29-aa79-7a729eb5f42f","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":557,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"e978d7fc-523b-4b8c-ac51-acf15e02f8d7","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":316,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null}
      }
      let result;
      if (data[new Date().getFullYear() - 1]) {
        result = data[new Date().getFullYear() - 1];
      }else {
        result = res;
      }*/
      if (res.data[0]) {
        this.creatBusinessIncomeRatioEChart(res.data[0], new Date().getFullYear() - 1);
      }
    });
  }
  /*获取每年收入占比*/
  changeBusinessIncomeRatioData(event) {
    /*获取收入占比信息*/
    this.businessIncomeRatioLoading = true;
    const time = event.name;
    const BusinessIncomeRatioPramas = { name: this.companyName, year: time };
    this.companyEconomicInfoService.findListByUrl(BusinessIncomeRatioPramas, 'companyIncomeStatisticsByYearUrl').subscribe(res => {
    // this.companyEconomicInfoService.getRevenueShare(this.companyName, time).subscribe(res => {
      /*const data = {
        2017:{"timestemp":1529639550524,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"5b877abb-e9d9-42d5-a6eb-3e8a5b09cbd1","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":1200,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"75316988-4b84-49e9-acc1-88cacecd6687","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":352,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"b99c91d6-0f05-4909-9e0a-c7314d1d1f8b","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":500,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"bdb5dcc1-6d33-4528-9def-0e2767fa79bf","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":1100,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"d81e707e-3137-4fb2-a45f-31f910598a7f","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":157,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"f97a4444-075c-4252-97c5-9dda887bfc7d","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":850,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
        2016:{"timestemp":1529639635285,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"1d96d4d6-2f56-480d-bd40-6ea217a981a8","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":1850,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"3fcde07e-aaf4-491b-96fa-791e4ac0a2f6","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":200,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"8b676875-03ef-4ac4-8004-34c0cd7df68e","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":100,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"8d4d0f19-87af-4386-b83b-87eaf4b1240c","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":252,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"94e496e1-f9cc-4f79-82ec-7ebddc93d75b","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":157,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"e658ccdf-fcb5-4fda-a500-845c13d63888","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":1100,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
        2015: {"timestemp":1529639682720,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"3ae4e1d2-2f51-4627-a14d-233a4f522ea4","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":600,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"5299a6e9-a03a-4922-a5e0-e809bcc29dcd","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":357,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"64db7775-3fb0-4e8e-8bee-48319aa7b6ee","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":452,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"69e3d6ea-f778-4148-9982-9d7d23bf59e1","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":621,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"a17e8044-e39a-44a3-9340-7fff47200a4d","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":320,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"ec4eb106-e213-47c5-a68f-edcc67618c4b","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":850,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
        2014: {"timestemp":1529640281853,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"5eb2c7d7-1659-487b-937a-c1d664c3d859","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":621,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"67bdd1c6-bc10-4f39-aa0d-e2c2d09bf4ae","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":751,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"96b97bb6-c206-4c0b-896d-a8ee3323318f","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":452,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"9a00cf07-31f3-4ef2-8a47-c2a6efe1e43d","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":621,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"db0a491b-341a-4a29-aa79-7a729eb5f42f","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":557,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"e978d7fc-523b-4b8c-ac51-acf15e02f8d7","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":316,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null}
      }
      let result;
      if (data[time]) {
        result = data[time];
      }else {
        result = res;
      }*/
      console.log('获取收入占比', res);
      if (res.data[0]) {
        this.creatBusinessIncomeRatioEChart(res.data[0], time);
      }
    });
  }
  /*绘制营业收入图表*/
  creatBusinessIncomeEChartOld(options) {
    // const dataAxis = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
    let dataAxis = [];
    const yMax = 500;
    const dataShadow = [];
    // const tu1 = JSON.parse(options.income);
    const tu1 = options;
    tu1.sort(this.compareFn('year'));
    let data = [];
    for (let i = 0; i < tu1.length; i++) {
      if (tu1[i].year !== String(new Date().getFullYear())) {
        data.push(tu1[i].totalMoney);
        dataAxis.push(tu1[i].year);
      }
    }
    /*7年*/
    if (data.length > 7) {
      data = data.slice(data.length - 7, data.length);
      dataAxis = dataAxis.slice(dataAxis.length - 7, dataAxis.length);
    }

    /*for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }*/

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          const tar = params[0];
          // console.log(tar)
          return tar.name + '年总收入' + ' : ' + tar.value + '万';
        }
      },
      title: {
        text: '公司几年内收入变化图',
        left: 'center', // 居中
        top: 20, // 距离上边框距离
        textStyle: {
          color: '#bcbdbf'          // 主标题文字颜色
        }
      },
      xAxis: {
        name: '年份',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        position: 'bottom',
        data: dataAxis,
        axisLabel: {
          inside: true,
          textStyle: {
            color: '#fff'
          }
        },
        axisTick: {
          show: true
        },
        axisLine: {
          show: true
        },
        z: 10
      },
      yAxis: {
        name: '总销量(万)',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series: [
        { // For shadow
          type: 'bar',
          itemStyle: {
            normal: { color: 'rgba(0,0,0,0.05)' }
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false
        },
        {
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#1eb5d4'
            },
            emphasis: {
              color: '#1eb5d4'
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.data + '万';
              }
            }
          },
          data: data
        }
      ]
    };
    this.businessIncomeData = option;
  }
  creatBusinessIncomeEChart(options, years) {
    // const dataAxis = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
    let dataAxis = [];
    const yMax = 500;
    const dataShadow = [];
    // const tu1 = JSON.parse(options.income);
    const tu1 = options;
    tu1.sort(this.compareFn('dataSupplyTime'));
    let data = [];
    /*新接口查询不到一些年份的数据，将其设置为0Start*/
    const requestYear: any = {};
    for (let i = 0; i < tu1.length; i++) {
      requestYear[tu1[i].dataSupplyTime] = tu1[i].operatingIncome;
    }
    for (let i = 0; i < years.length; i++) {
      if (requestYear[years[i]]) {
        data.push(requestYear[years[i]]);
        dataAxis.push(years[i]);
      }else {
        data.push(0);
        dataAxis.push(years[i]);
      }
    }
    /*新接口查询不到一些年份的数据，将其设置为0End*/
    /*7年*/
    if (data.length > 7) {
      data = data.slice(data.length - 7, data.length);
      dataAxis = dataAxis.slice(dataAxis.length - 7, dataAxis.length);
    }

    /*for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }*/

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          const tar = params[0];
          // console.log(tar)
          return tar.name + '年总收入' + ' : ' + tar.value + '万';
        }
      },
      title: {
        text: '公司近三年内收入变化',
        left: 'center', // 居中
        top: 20, // 距离上边框距离
        textStyle: {
          color: '#bcbdbf'          // 主标题文字颜色
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: {
        name: '年份',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        position: 'bottom',
        data: dataAxis,
        axisLabel: {
          // inside: true,
          textStyle: {
            color: '#fff'
          }
        },
        axisTick: {
          show: true
        },
        axisLine: {
          show: true
        },
        z: 10
      },
      yAxis: {
        name: '总销量(万)',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series: [
        { // For shadow
          type: 'bar',
          itemStyle: {
            normal: { color: 'rgba(0,0,0,0.05)' }
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false
        },
        {
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#1eb5d4'
            },
            emphasis: {
              color: '#1eb5d4'
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.data + '万';
              }
            }
          },
          data: data
        }
      ]
    };
    this.businessIncomeData = option;
  }
  /*绘制营业收入占比图表*/
  creatBusinessIncomeRatioEChart(options, time) {
    const data = [
      // {value: options.technicalIncome, name: '技术'},
      {value: options.technologyTransferIncome, name: '技术转让'},
      {value: options.technicalContractingIncome, name: '技术承包'},
      {value: options.technicalServicesIncome, name: '技术咨询与服务'},
      {value: options.entrustedIncome, name: '接受委托研究开发'},
      // {value: options.productSalesIncome, name: '产品销售'},
      {value: options.highTechProductsIncome, name: '高新技术产品'},
      {value: options.commoditySalesIncome, name: '商品销售'},
      {value: options.otherIncome, name: '其他营业'}
      ];
    // for (let i = 0; i < options.length; i++) {
    //   if (options[i].year !== String(new Date().getFullYear())) {
    //     data.push({ value: options[i].money, name: options[i].type });
    //   }
    // }
    const echartTitle = time + '年收入占比';
    const option3 = {
      //            backgroundColor: '#2c343c',//背景颜色
      title: {
        text: echartTitle,
        left: 'center', // 居中
        top: 20, // 距离上边框距离
        textStyle: {
          color: '#bcbdbf'
        }
      },

      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}万 ({d}%)'
      },

      /*visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },*/
      series: [
        {
          name: '收益来源',
          type: 'pie',
          radius: '60%', // 饼图大小
          center: ['50%', '50%'],
          data: data.sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: '#bcbdbf'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };
    this.businessIncomeRatioLoading = false;
    this.businessIncomeRatioData = option3;
  }

  /*格式化排序*/
  compareFn(prop) {
    return function (obj1, obj2) {
      let val1 = obj1[prop];
      let val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    };
  }
}
