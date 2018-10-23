import { Component, OnInit } from '@angular/core';
import { IndustryBoardService } from '../industry-board.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-type-functional-area',
  templateUrl: './type-functional-area.component.html',
  styleUrls: ['./type-functional-area.component.css']
})
export class TypeFunctionalAreaComponent implements OnInit {

  constructor(
    private industryBoardService: IndustryBoardService,
    private routerInfo: ActivatedRoute,
    private toastModalService: ToastModalService
  ) { }

  typeName = '';
  typeId = '';
  chooseYear = new Date().getFullYear() - 1;
  chooseFunctionalArea = '高新西区';
  yearList = [];
  CompanyTotalWorkerNumberEchartData: any;
  EducationCompositionEchartData: any;
  JobCompositionEchartData: any;
  GovernmentalSupportEchartData: any;
  AssetsIncomeTaxProfitEchartData: any;
  OperatingIncomeLadderEchartData: any;
  PeopleIncomePeopleTaxPeopleProfitEchartData: any;
  GovernmentalSupportAndTaxEchartData: any;
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
    this.typeId = this.routerInfo.snapshot.queryParams['id'];
    this.typeName = this.routerInfo.snapshot.queryParams['name'];
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const series = {data1: [], data2: []};
    for (let i = countYear - 1; i >= 0; i--) {
      this.yearList.push(lastYear - i);
    }
    this.initData();
  }
  initData() {
    this.getCompanyTotalWorkerNumberData();
    this.getWorkerCompositionData();
    this.getGovernmentalSupportData();
    this.getAssetsIncomeTaxProfitData();
    this.getOperatingIncomeLadderData();
    this.getPeopleIncomePeopleTaxPeopleProfitData();
    this.getGovernmentalSupportAndTaxData();
  }
  yearChange() {
    this.initData();
  }
  chartClick(event) {
    this.chooseFunctionalArea = event.name;
    this.getWorkerCompositionData();
  }
  /*获取企业数和职工数数据*/
  getCompanyTotalWorkerNumberData() {
    const params = {industryClassTypeId: this.typeId, year: this.chooseYear};
    this.industryBoardService.requestJsonByYear(params, 'typeFunctionCompanyTotalWorkerNumberUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data;
        this.creatCompanyTotalWorkerNumberEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取学历分布和岗位构成数据*/
  getWorkerCompositionData() {
    const params = {industryClassTypeId: this.typeId, year: this.chooseYear, regional: this.chooseFunctionalArea};
    this.industryBoardService.requestJsonByYear(params, 'typeFunctionWorkerCompositionUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data[0] ? res.data[0] : [];
        this.creatEducationCompositionEchart(data);
        this.creatJobCompositionEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取各功能区政府支持、投资、研发经费数据*/
  getGovernmentalSupportData() {
    const params = {industryClassTypeId: this.typeId, year: this.chooseYear};
    this.industryBoardService.requestJsonByYear(params, 'typeFunctionGovernmentalSupportUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data ? res.data : [];
        this.creatGovernmentalSupportEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取各功能区资产总计,营业收入,利润,税收数据*/
  getAssetsIncomeTaxProfitData() {
    const params = {industryClassTypeId: this.typeId, year: this.chooseYear};
    this.industryBoardService.requestJsonByYear(params, 'typeFunctionAssetsIncomeTaxProfitUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data ? res.data : [];
        this.creatAssetsIncomeTaxProfitEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取各功能区营业收入阶梯分布数据*/
  getOperatingIncomeLadderData() {
    const params = {industryClassTypeId: this.typeId, year: this.chooseYear};
    this.industryBoardService.requestJsonByYear(params, 'typeFunctionOperatingIncomeLadderUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data ? res.data : [];
        this.creatOperatingIncomeLadderEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取各功能区人均收入、人均税收、人均利润数据*/
  getPeopleIncomePeopleTaxPeopleProfitData() {
    const params = {industryClassTypeId: this.typeId, year: this.chooseYear};
    this.industryBoardService.requestJsonByYear(params, 'typeFunctionPeopleIncomeTaxProfitUrl').subscribe(res => {
      console.log('人均', res)
      if (res.responseCode === '_200') {
        const data = res.data ? res.data : [];
        this.creatPeopleIncomePeopleTaxPeopleProfitEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取各功能区政府支持与税收的占比数据*/
  getGovernmentalSupportAndTaxData() {
    const params = {industryClassTypeId: this.typeId, year: this.chooseYear};
    this.industryBoardService.requestJsonByYear(params, 'typeFunctionGovernmentalSupportTaxPayUrl').subscribe(res => {
      console.log('占比', res)
      if (res.responseCode === '_200') {
        const data = res.data ? res.data : [];
        this.creatGovernmentalSupportAndTaxEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*绘制企业数和职工数图表*/
  creatCompanyTotalWorkerNumberEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = ['高新西区', '高新南区', '高新东区', '天府国际生物城'];
    const series = {data1: [], data2: []};
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(item[0]) && Number(item[2]) === Number(this.chooseYear);
    });
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
    });
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(filterData[i][0]);
      series.data1[index] = filterData[i][3] ? filterData[i][3] : 0;
      series.data2[index] = filterData[i][1] ? filterData[i][1] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        text: '各功能区企业数量和职工人数',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        top: 25,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        data: ['企业数量', '职工人数']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '企业(家)',
          nameTextStyle: {
            color: textColor,
          },
          min: 0,
          splitLine: {
            show: true,
            lineStyle: this.echartInitConfig.splitLineStyle,
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        },
        {
          type: 'value',
          name: '职工(人)',
          nameTextStyle: {
            color: textColor,
          },
          min: 0,
          splitLine: { show: false },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      series: [
        {
          name: '企业数量',
          type: 'bar',
          data: series.data1
        },
        {
          name: '职工人数',
          type: 'bar',
          yAxisIndex: 1,
          data: series.data2
        }
      ]
    };
    this.CompanyTotalWorkerNumberEchartData = option;
  }
  /*绘制职工学历分布*/
  creatEducationCompositionEchart(options) {
    const seriesData = [
      {value: options[2] ? options[2] : 0 , name: '研究生'},
      {value: options[3] ? options[3] : 0 , name: '本科以上'},
      {value: options[4] ? options[4] : 0 , name: '大专'}
    ];
    const echartTitle = this.chooseFunctionalArea ? this.chooseFunctionalArea + '职工学历层次分布' : '职工学历层次分布';
    const textColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: this.echartInitConfig.colors,
      title : {
        text: echartTitle,
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        show: false,
        top: 'bottom',
        left: 'center',
        textStyle: {
          color: textColor,
        },
        data: ['研究生', '本科以上', '大专']
      },
      series : [
        {
          name: '学历分布',
          type: 'pie',
          radius : ['40%', '60%'],
          center: ['50%', '50%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.EducationCompositionEchartData = option;
  }
  /*绘制职工岗位构成*/
  creatJobCompositionEchart(options) {
    const seriesData = [
      {value: options[5] ? options[5] : 0 , name: '中层及以上管理人员'},
      {value: options[6] ? options[6] : 0 , name: '专业技术人员'},
      {value: options[7] ? options[7] : 0 , name: '技术工人'}
    ];
    const echartTitle = this.chooseFunctionalArea ? this.chooseFunctionalArea + '职工岗位类型占比' : '职工岗位类型占比';
    const textColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: this.echartInitConfig.colors,
      title : {
        text: echartTitle,
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        show: false,
        top: 'bottom',
        left: 'center',
        textStyle: {
          color: textColor,
        },
        data: ['中层及以上管理人员', '专业技术人员', '技术工人']
      },
      series : [
        {
          name: '岗位类型',
          type: 'pie',
          radius : ['40%', '60%'],
          center: ['50%', '50%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.JobCompositionEchartData = option;
  }

  /*绘制各功能区政府支持、投资、研发*/
  creatGovernmentalSupportEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = ['高新西区', '高新南区', '高新东区', '天府国际生物城'];
    const series = {data1: [], data2: [], data3: []};
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(item[0]) && Number(item[1]) === Number(this.chooseYear);
    });
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    });
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(filterData[i][0]);
      series.data1[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data2[index] = filterData[i][3] ? filterData[i][3] : 0;
      series.data3[index] = filterData[i][4] ? filterData[i][4] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        text: '各功能区政府支持、投资、研发经费',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        top: 25,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        data: ['政府支持', '固定投资', '研发经费']
      },
      grid: {
        top: 80,
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: {show: false},
          axisPointer: {
            type: 'shadow'
          },
          data: xAxisData,
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '万元',
          nameTextStyle: {
            color: textColor,
          },
          splitLine: {
            show: true,
            lineStyle: this.echartInitConfig.splitLineStyle,
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      series: [
        {
          name: '政府支持',
          type: 'bar',
          barGap: 0,
          data: series.data1
        },
        {
          name: '固定投资',
          type: 'bar',
          data: series.data2
        },
        {
          name: '研发经费',
          type: 'bar',
          data: series.data3
        }
      ]
    };
    this.GovernmentalSupportEchartData = option;
  }
  /*绘制各功能区资产总计,营业收入,利润,税收*/
  creatAssetsIncomeTaxProfitEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = ['高新西区', '高新南区', '高新东区', '天府国际生物城'];
    const series = {data1: [], data2: [], data3: [], data4: []};
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(item[0]) && Number(item[1]) === Number(this.chooseYear);
    });
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
      series.data4.push(0);
    });
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(filterData[i][0]);
      series.data1[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data2[index] = filterData[i][3] ? filterData[i][3] : 0;
      series.data3[index] = filterData[i][4] ? filterData[i][4] : 0;
      series.data4[index] = filterData[i][5] ? filterData[i][5] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        text: '各功能区资产总计、营收、利润、税收',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        top: 25,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        data: ['资产', '营收', '利润', '税收']
      },
      grid: {
        left: '3%',
        right: 50,
        bottom: '5%',
        containLabel: true
      },
      calculable: true,
      xAxis: [
        {
          type: 'value',
          name: '万元',
          nameTextStyle: {
            color: textColor,
          },
          splitLine: {
            show: true,
            lineStyle: this.echartInitConfig.splitLineStyle,
          },
          axisTick: {show: false},
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          splitLine: { show: false },
          axisTick: {show: false},
          data: xAxisData,
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      series: [
        {
          name: '资产',
          type: 'bar',
          barGap: 0,
          data: series.data1
        },
        {
          name: '营收',
          type: 'bar',
          data: series.data2
        },
        {
          name: '利润',
          type: 'bar',
          data: series.data3
        },
        {
          name: '税收',
          type: 'bar',
          data: series.data4
        }
      ]
    };
    this.AssetsIncomeTaxProfitEchartData = option;
  }
  /*绘制各功能区营业收入阶梯分布情况*/
  creatOperatingIncomeLadderEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = ['高新西区', '高新南区', '高新东区', '天府国际生物城'];
    const legendData = ['100万以下', '100-200万', '200-500万', '500-1000万', '1000-2000万', '2000-5000万', '5000万以上'];
    const series = {data1: [], data2: [], data3: [], data4: [], data5: [], data6: [], data7: []};
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(item[0]) && Number(item[1]) === Number(this.chooseYear);
    });
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
      series.data4.push(0);
      series.data5.push(0);
      series.data6.push(0);
      series.data7.push(0);
    });
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(filterData[i][0]);
      series.data1[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data2[index] = filterData[i][3] ? filterData[i][3] : 0;
      series.data3[index] = filterData[i][4] ? filterData[i][4] : 0;
      series.data4[index] = filterData[i][5] ? filterData[i][5] : 0;
      series.data5[index] = filterData[i][6] ? filterData[i][6] : 0;
      series.data6[index] = filterData[i][7] ? filterData[i][7] : 0;
      series.data7[index] = filterData[i][8] ? filterData[i][8] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '各功能区营业收入阶梯分布',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        top: 25,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        data: legendData
      },
      grid: {
        top: 100,
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: {show: false},
          axisPointer: {
            type: 'shadow'
          },
          data: xAxisData,
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '企业(家)',
          nameTextStyle: {
            color: textColor,
          },
          splitLine: {
            show: true,
            lineStyle: this.echartInitConfig.splitLineStyle,
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      series: [
        {
          name: '100万以下',
          type: 'bar',
          barGap: 0,
          data: series.data1
        },
        {
          name: '100-200万',
          type: 'bar',
          data: series.data2
        },
        {
          name: '200-500万',
          type: 'bar',
          data: series.data3
        },
        {
          name: '500-1000万',
          type: 'bar',
          data: series.data4
        },
        {
          name: '1000-2000万',
          type: 'bar',
          data: series.data5
        },
        {
          name: '2000-5000万',
          type: 'bar',
          data: series.data6
        },
        {
          name: '5000万以上',
          type: 'bar',
          data: series.data7
        }
      ]
    };
    this.OperatingIncomeLadderEchartData = option;
  }
  /*绘制各功能区人均收入、人均税收、人均利润情况*/
  creatPeopleIncomePeopleTaxPeopleProfitEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = ['高新西区', '高新南区', '高新东区', '天府国际生物城'];
    const legendData = ['人均收入', '人均税收', '人均利润'];
    const series = {data1: [], data2: [], data3: []};
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(item[0]) && Number(item[1]) === Number(this.chooseYear);
    });
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    });
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(filterData[i][0]);
      series.data1[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data2[index] = filterData[i][3] ? filterData[i][3] : 0;
      series.data3[index] = filterData[i][4] ? filterData[i][4] : 0;
    }

    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '各功能区人均收入、人均税收、人均利润',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        top: 25,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        data: legendData
      },
      grid: {
        top: 80,
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: {show: false},
          axisPointer: {
            type: 'shadow'
          },
          data: xAxisData,
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '万/人',
          nameTextStyle: {
            color: textColor,
          },
          splitLine: {
            show: true,
            lineStyle: this.echartInitConfig.splitLineStyle,
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      series : [
        {
          name: '人均收入',
          type: 'bar',
          markLine : {
            data : [
              [{type : 'min'}, {type : 'max'}]
            ]
          },
          data: series.data1
        },
        {
          name: '人均税收',
          type: 'bar',
          markLine : {
            data : [
              [{type : 'min'}, {type : 'max'}]
            ]
          },
          data: series.data2
        },
        {
          name: '人均利润',
          type: 'bar',
          markLine : {
            data : [
              [{type : 'min'}, {type : 'max'}]
            ]
          },
          data: series.data3
        }
      ]
    };
    this.PeopleIncomePeopleTaxPeopleProfitEchartData = option;
  }
  /*绘制各功能区政府支持与税收的占比情况*/
  creatGovernmentalSupportAndTaxEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = ['高新西区', '高新南区', '高新东区', '天府国际生物城'];
    const legendData = ['政府支持', '税收', '支持/税收'];
    const series = {data1: [], data2: [], data3: []};
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(item[0]) && Number(item[1]) === Number(this.chooseYear);
    });
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    });
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(filterData[i][0]);
      series.data1[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data2[index] = filterData[i][3] ? filterData[i][3] : 0;
      series.data3[index] = (filterData[i][2] / filterData[i][3]) ? (filterData[i][2] / filterData[i][3]).toFixed(2) : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '各功能区政府支持与税收占比',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      grid: {
        top: 80,
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        top: 25,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        data: legendData
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '支持(万)',
          nameTextStyle: {
            color: textColor,
          },
          min: 0,
          splitLine: { show: false },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        },
        {
          type: 'value',
          name: '补贴(万)',
          nameTextStyle: {
            color: textColor,
          },
          min: 0,
          splitLine: {
            show: true,
            lineStyle: this.echartInitConfig.splitLineStyle,
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        },
        {
          type: 'value',
          name: '支持/税收',
          offset: 60,
          nameTextStyle: {
            color: textColor,
          },
          min: 0,
          splitLine: { show: false },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      series: [
        {
          name: '政府支持',
          type: 'bar',
          data: series.data1
        },
        {
          name: '税收',
          type: 'bar',
          yAxisIndex: 1,
          data: series.data2
        },
        {
          name: '支持/税收',
          type: 'line',
          smooth: this.echartInitConfig.lineSmooth,
          yAxisIndex: 2,
          data: series.data3
        }
      ]
    };
    this.GovernmentalSupportAndTaxEchartData = option;
  }

}
