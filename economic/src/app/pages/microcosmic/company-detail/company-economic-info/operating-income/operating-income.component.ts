import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyEconomicInfoService } from '../company-economic-info.service';
import { ToastModalService } from '../../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-operating-income',
  templateUrl: './operating-income.component.html',
  styleUrls: ['./operating-income.component.css']
})
export class OperatingIncomeComponent implements OnInit {

  constructor(
    private microcomicService: MicrocosmicService,
    private toastModalService: ToastModalService,
    private companyEconomicInfoService: CompanyEconomicInfoService
  ) { }
  companyName: string;
  businessIncomeRatioData: any;
  businessIncomeData: any;
  taxPayEChartData: any;
  assetsTotalEChartData: any;
  businessIncomeRatioLoading = true;
  echartsParams = { companyName: 'test1', currentPage: 0, pageSize: 20, lastRowKey: '' };
  businessIncomeTableData: any;
  RateEchartChoseYear = new Date().getFullYear() - 1;
  echartInitConfig = {
    colors: ['#5079d9', '#57ba8c', '#ffcc00', '#7958d6', '#bcbdbf', '#7c7e80', '#87a3e4', '#78d05d'],
    backgroundColor: '#191919',
    titleTextStyle: {
      color: '#7c7e80',
      fontSize: 18,
      fontWeight: 'normal'
    },
    legendStyle: {
      width: '30%',
      itemWidth: 14,
      itemHeight: 14,
      borderRadius: '10px',
    },
    labelTextColor: '#7c7e80',
    gridTop: 100,
    legendTop: 20,
    splitLineStyle: {
      color: '#1f2020',
    },
    lineSmooth: true,
  };
  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    /*获取营业收入信息*/
    this.getBusinessIncome();
    /*获取收入占比信息*/
    this.getBusinessIncomeRatio(new Date().getFullYear() - 1);
    /*获取税费信息*/
    this.getRealTaxPayData();
    /*获取资产总计信息*/
    this.getAssetsTotalData();
    /*获取表格数据*/
    this.getBusinessIncomeTableData(new Date().getFullYear() - 1);
  }
  /*获取营业收入信息*/
  getBusinessIncome() {
    const params = {name: this.companyName};
    console.log(this.companyName)
    this.companyEconomicInfoService.findListByUrl(params, 'companyIncomeStatisticsByYearUrl').subscribe(res => {
      console.log('获取营业收入', res)
      if (res.responseCode === '_200') {
        this.creatBusinessIncomeEChart(res.data, [2015, 2016, 2017]);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
    /*this.companyEconomicInfoService.getIncomeStatisticsByYear('鸿富锦精密电子(成都)有限公司', [2015, 2016, 2017]).subscribe(results => {
      console.log('获取营业收入', results)
      const datas = [results[0].data, results[1].data, results[2].data];
      this.creatBusinessIncomeEChart(datas);
    });*/
  }
  /*获取收入占比信息*/
  getBusinessIncomeRatio(year) {
    const BusinessIncomeRatioPramas = { name: this.companyName, year: year };
    this.companyEconomicInfoService.findListByUrl(BusinessIncomeRatioPramas, 'companyIncomeStatisticsByYearUrl').subscribe(res => {
      console.log('获取收入占比', res);
      if (res.responseCode === '_200') {
        this.creatBusinessIncomeRatioEChart(res.data[0], year);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*获取每年收入占比*/
  changeBusinessIncomeRatioData(event) {
    this.businessIncomeRatioLoading = true;
    const time = event.name;
    this.RateEchartChoseYear = time;
    /*获取表格信息*/
    this.getBusinessIncomeTableData(time);
    /*获取收入占比信息*/
    this.getBusinessIncomeRatio(time);
  }
  /*获取税费信息*/
  getRealTaxPayData() {
    const params = {companyName: this.companyName}
    this.companyEconomicInfoService.findListByUrl(params, 'realTaxPayUrl').subscribe(res => {
      console.log('获取税费信息', res)
      if (res.responseCode === '_200') {
        const options = res.data;
        this.creatTaxPayEChart(options, [2015, 2016, 2017]);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*获取资产总计信息*/
  getAssetsTotalData() {
    const params = {companyName: this.companyName}
    this.companyEconomicInfoService.findListByUrl(params, 'assetsTotalUrl').subscribe(res => {
      console.log('资产总计信息', res)
      if (res.responseCode === '_200') {
        const options = res.data;
        this.creatAssetsTotalEChart(options, [2015, 2016, 2017]);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*获取经济概况表格数据*/
  getBusinessIncomeTableData(year) {
    const params = {name: this.companyName, year: year};
    this.companyEconomicInfoService.findListByUrl(params, 'companyIncomeStatisticsTableUrl').subscribe(res => {
      console.log('表格数据', res)
      if (res.responseCode === '_200') {
        this.businessIncomeTableData = res.data;
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
    const labelTextColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: this.echartInitConfig.colors,
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
        show: false,
        text: '公司几年内收入变化图',
        left: 'center', // 居中
        top: 20, // 距离上边框距离
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      xAxis: {
        name: '年份',
        nameTextStyle: {
          color: labelTextColor
        },
        position: 'bottom',
        data: dataAxis,
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
          color: labelTextColor
        },
        splitLine: {
          show: true,
          lineStyle: this.echartInitConfig.splitLineStyle,
        },
        axisLabel: {
          textStyle: {
            color: labelTextColor
          }
        }
      },
      series: [
        { // For shadow
          type: 'bar',
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false
        },
        {
          type: 'bar',
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

    const labelTextColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: [this.echartInitConfig.colors[0]],
      tooltip: {
        trigger: 'axis',
        confine: true,
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
        show: false,
        text: '公司近三年内收入变化',
        left: 'center', // 居中
        top: '3%', // 距离上边框距离
        textStyle: {
          color: '#bcbdbf'          // 主标题文字颜色
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        name: '年份',
        nameTextStyle: {
          color: labelTextColor,
        },
        position: 'bottom',
        data: dataAxis,
        axisLabel: {
          // inside: true,
          textStyle: {
            color: labelTextColor,
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
        name: '总收入(万元)',
        nameTextStyle: {
          color: labelTextColor,
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: this.echartInitConfig.splitLineStyle,
        },
        axisLabel: {
          textStyle: {
            color: labelTextColor,
          }
        }
      },
      series: [
        {
          type: 'bar',
          barMaxWidth: '60%',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.data + '万元';
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
    const technologyTransferIncome = options && options.technologyTransferIncome ? options.technologyTransferIncome : 0;
    const technicalContractingIncome = options && options.technicalContractingIncome ? options.technicalContractingIncome : 0;
    const technicalServicesIncome = options && options.technicalServicesIncome ? options.technicalServicesIncome : 0;
    const entrustedIncome = options && options.entrustedIncome ? options.entrustedIncome : 0;
    const productSalesIncome = options && options.productSalesIncome ? options.productSalesIncome : 0;
    // const highTechProductsIncome = options && options.highTechProductsIncome ? options.highTechProductsIncome : 0;
    const commoditySalesIncome = options && options.commoditySalesIncome ? options.commoditySalesIncome : 0;
    const otherIncome = options && options.otherIncome ? options.otherIncome : 0;
    const data = [
      // {value: options.technicalIncome, name: '技术'},
      {value: technologyTransferIncome, name: '技术转让'},
      {value: technicalContractingIncome, name: '技术承包'},
      {value: technicalServicesIncome, name: '技术咨询与服务'},
      {value: entrustedIncome, name: '接受委托研究开发'},
      {value: productSalesIncome, name: '产品销售'},
      // {value: highTechProductsIncome, name: '高新技术产品'},
      {value: commoditySalesIncome, name: '商品销售'},
      {value: otherIncome, name: '其他营业'}
      ];
    // for (let i = 0; i < options.length; i++) {
    //   if (options[i].year !== String(new Date().getFullYear())) {
    //     data.push({ value: options[i].money, name: options[i].type });
    //   }
    // }
    const echartTitle = time + '年收入占比';
    const labelTextColor = this.echartInitConfig.labelTextColor;
    const option3 = {
      //            backgroundColor: '#2c343c',//背景颜色
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: echartTitle,
        left: 'center', // 居中
        top: '3%', // 距离上边框距离
        textStyle: {
          color: '#bcbdbf'
        }
      },

      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b} : {c}万 ({d}%)'
      },
      series: [
        {
          name: '收入占比',
          type: 'pie',
          radius: ['40%', '60%'], // 饼图大小
          center: ['50%', '50%'],
          data: data.sort(function (a, b) { return a.value - b.value; }),
          // roseType: 'radius',
          label: {
            normal: {
              show: false,
              textStyle: {
                color: labelTextColor,
              }
            },
            emphasis: {
              show: true
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              // smooth: 0.2,
              length: 0,
              // length2: 10
            }
          },
          itemStyle: {
            normal: {
              // color: this.echartInitConfig.colors[1],
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          /*animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }*/
        }
      ]
    };
    this.businessIncomeRatioLoading = false;
    this.businessIncomeRatioData = option3;
  }
  /*绘制税费图表*/
  creatTaxPayEChart(options, years) {
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
      requestYear[tu1[i].dataSupplyTime] = tu1[i].totalActualTax;
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
    const labelTextColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: [this.echartInitConfig.colors[2]],
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          const tar = params[0];
          // console.log(tar)
          return tar.name + '年缴税费' + ' : ' + tar.value + '万元';
        }
      },
      title: {
        show: false,
        text: '公司近三年内缴税费信息',
        left: 'center', // 居中
        top: '3%', // 距离上边框距离
        textStyle: {
          color: '#bcbdbf'          // 主标题文字颜色
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        name: '年份',
        nameTextStyle: {
          color: labelTextColor,
        },
        position: 'bottom',
        data: dataAxis,
        axisLabel: {
          // inside: true,
          textStyle: {
            color: labelTextColor,
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
        name: '总缴税费(万元)',
        nameTextStyle: {
          color: labelTextColor,
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: this.echartInitConfig.splitLineStyle,
        },
        axisLabel: {
          textStyle: {
            color: labelTextColor,
          }
        }
      },
      series: [
        {
          type: 'bar',
          barMaxWidth: '60%',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.data + '万元';
              }
            }
          },
          data: data
        }
      ]
    };
    this.taxPayEChartData = option;
  }
  /*绘制资产总计图表*/
  creatAssetsTotalEChart(options, years) {
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
      requestYear[tu1[i].dataSupplyTime] = tu1[i].totalAssets;
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
    const labelTextColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: [this.echartInitConfig.colors[3]],
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          const tar = params[0];
          // console.log(tar)
          return tar.name + '年资产' + ' : ' + tar.value + '万元';
        }
      },
      title: {
        show: false,
        text: '公司近三年内资产信息',
        left: 'center', // 居中
        top: '3%', // 距离上边框距离
        textStyle: {
          color: '#bcbdbf'          // 主标题文字颜色
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        name: '年份',
        nameTextStyle: {
          color: labelTextColor,
        },
        position: 'bottom',
        data: dataAxis,
        axisLabel: {
          // inside: true,
          textStyle: {
            color: labelTextColor,
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
        name: '总资产(万元)',
        nameTextStyle: {
          color: labelTextColor,
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: this.echartInitConfig.splitLineStyle,
        },
        axisLabel: {
          textStyle: {
            color: labelTextColor,
          }
        }
      },
      series: [
        {
          type: 'bar',
          barMaxWidth: '60%',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.data + '万元';
              }
            }
          },
          data: data
        }
      ]
    };
    this.assetsTotalEChartData = option;
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
