import { Component, OnInit } from '@angular/core';
import { IndustryBoardService } from '../industry-board.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-type-economic',
  templateUrl: './type-economic.component.html',
  styleUrls: ['./type-economic.component.css']
})
export class TypeEconomicComponent implements OnInit {

  constructor(
    private industryBoardService: IndustryBoardService,
    private routerInfo: ActivatedRoute,
    private toastModalService: ToastModalService
  ) { }

  typeName = '';
  typeId = '';
  RateEchartChoseYear = '';
  GovernmentalSupportEchart: any;
  GovernmentalSupportDataInfo = [];
  OutputValueEchartData: any;
  OutputValueDataInfo = [];
  OperatingIncomeTypeRateEchartData: any;
  OperatingIncomeTypeLadderEchartData: any;
  GovernmentalSupportAndTaxEchartData: any;
  FixedInvestmentIncomeProfitEchartData: any;
  PeopleIncomePeopleTaxPeopleProfitEchartData: any;
  echartInitConfig = {
    colors: ['#5079d9', '#57ba8c', '#ffcc00', '#7958d6', '#bcbdbf', '#7c7e80'],
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
    this.getEconomicData();
  }
  /*获取经济数据*/
  getEconomicData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'typeEconomicUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data;
        this.creatGovernmentalSupportEchart(data.table_1);
        this.creatOutputValueEchart(data.table_2);
        this.creatOperatingIncomeTypeRateEchart(data.table_3[0]);
        this.creatOperatingIncomeTypeLadderEchart(data.table_4[0]);
        this.creatGovernmentalSupportAndTaxEchart(data.table_5);
        this.creatFixedInvestmentIncomeProfitEchart(data.table_6);
        this.creatPeopleIncomePeopleTaxPeopleProfitEchart(data.table_7);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*根据年份获取占比数据*/
  getOperatingIncomeTypeRateByYear(year) {
    const params = {industryClassTypeId: this.typeId, year: year};
    this.industryBoardService.requestByParams(params, 'typeEconomicIncomeUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data;
        this.creatOperatingIncomeTypeRateEchart(data.income[0]);
        this.creatOperatingIncomeTypeLadderEchart(data.ladder[0]);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*绘制近几年政府支持、投资、研发*/
  creatGovernmentalSupportEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const xAxisData = [];
    const series = {data1: [], data2: [], data3: []};
    for (let i = countYear - 1; i >= 0; i--) {
      xAxisData.push(lastYear - i);
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    }
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(Number(item[3]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(3));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][3]));
      series.data1[index] = filterData[i][0] ? filterData[i][0] : 0;
      series.data2[index] = filterData[i][1] ? filterData[i][1] : 0;
      series.data3[index] = filterData[i][2] ? filterData[i][2] : 0;
      if (index > -1) {
        this.GovernmentalSupportDataInfo.push(filterData[i]);
      }
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        text: '近三年政府支持、投资、研发',
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
          name: '金额(万元)',
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
    this.GovernmentalSupportEchart = option;
  }
  /*绘制近几年总产值、资产、营收、利润、税收、利润率图表*/
  creatOutputValueEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const yAxisData = [];
    const series = {data1: [], data2: [], data3: [], data4: [], data5: [], data6: []};
    for (let i = countYear - 1; i >= 0; i--) {
      yAxisData.push(lastYear - i);
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
      series.data4.push(0);
      series.data5.push(0);
      series.data6.push(0);
    }
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return yAxisData.includes(Number(item[0]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(0));
    for (let i = 0; i < filterData.length; i++) {
      const index = yAxisData.indexOf(Number(filterData[i][0]));
      series.data1[index] = filterData[i][1] ? filterData[i][1] : 0;
      series.data2[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data3[index] = filterData[i][3] ? filterData[i][3] : 0;
      series.data4[index] = filterData[i][4] ? filterData[i][4] : 0;
      series.data5[index] = filterData[i][5] ? filterData[i][5] : 0;
      series.data6[index] = (filterData[i][4] / filterData[i][3]) ? (filterData[i][4] / filterData[i][3] * 100).toFixed(2) : 0;
      if (index > -1) {
        this.OutputValueDataInfo.push(filterData[i]);
      }
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        text: '近三年总产值、资产、营收、利润、税收、利润率',
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
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        top: 25,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        data: ['总产值', '资产', '营收', '利润', '税收', '利润率']
      },
      xAxis:  {
        type: 'category',
        nameTextStyle: {
          color: textColor,
        },
        axisPointer: {
          type: 'shadow'
        },
        splitLine: { show: false },
        axisLabel: {
          textStyle: {
            color: textColor,
          }
        },
        data: yAxisData
      },
      yAxis: [{
        type: 'value',
        name: '金额(万元)',
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
      },
      {
        type: 'value',
        name: '利润率(%)',
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
          name: '总产值',
          type: 'bar',
          barMaxWidth: '50%',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data1
        },
        {
          name: '资产',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data2
        },
        {
          name: '营收',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data3
        },
        {
          name: '利润',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data4
        },
        {
          name: '税收',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data5
        },
        {
          name: '利润率',
          type: 'line',
          smooth: this.echartInitConfig.lineSmooth,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          yAxisIndex: 1,
          data: series.data6
        }
      ]
    };
    this.OutputValueEchartData = option;
  }

  chartClick(event) {
    const year = event.name;
    this.RateEchartChoseYear = year;
    this.getOperatingIncomeTypeRateByYear(year);
  }
  /*绘制不同营业收入类型的占比*/
  creatOperatingIncomeTypeRateEchart(options) {
    const seriesData = [
      {value: options[0] ? options[0] : 0 , name: '主营收入'},
      {value: options[1] ? options[1] : 0 , name: '技术收入'},
      {value: options[2] ? options[2] : 0 , name: '产品销售收入'},
      {value: options[3] ? options[3] : 0 , name: '商品销售收入'},
      {value: options[4] ? options[4] : 0 , name: '其他营业收入'}
    ];
    const echartTitle = this.RateEchartChoseYear ? this.RateEchartChoseYear + '不同营业收入类型的占比' : '不同营业收入类型的占比';
    const textColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: this.echartInitConfig.colors,
      title : {
        text: echartTitle,
        left: 'center',
        top: 20,
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
        data: ['主营收入', '技术收入', '产品销售收入', '商品销售收入', '其他营业收入']
      },
      series : [
        {
          name: '收入类型',
          type: 'pie',
          radius : '45%',
          center: ['50%', '60%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            normal: {
              length: 5,
              length2: 5,
            }
          }
        }
      ]
    };
    this.OperatingIncomeTypeRateEchartData = option;
  }
  /*绘制不同营业收入阶梯分布*/
  creatOperatingIncomeTypeLadderEchart(options) {
    const seriesData = [
      {value: options[0] ? options[0] : 0 , name: '100万以下'},
      {value: options[1] ? options[1] : 0 , name: '100-500万'},
      {value: options[2] ? options[2] : 0 , name: '500-1000万'},
      {value: options[3] ? options[3] : 0 , name: '1000-2000万'},
      {value: options[4] ? options[4] : 0 , name: '2000-5000万'},
      {value: options[5] ? options[5] : 0 , name: '5000万以上'}
    ];
    const echartTitle = this.RateEchartChoseYear ? this.RateEchartChoseYear + '不同营业收入阶梯分布' : '不同营业收入阶梯分布';
    const textColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: this.echartInitConfig.colors,
      title : {
        text: echartTitle,
        left: 'center',
        top: 20,
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
        data: ['100万以下', '100-500万', '500-1000万', '1000-2000万', '2000-5000万', '5000万以上']
      },
      series : [
        {
          name: '收入阶梯',
          type: 'pie',
          radius : '45%',
          center: ['50%', '60%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            normal: {
              length: 5,
              length2: 5,
            }
          }
        }
      ]
    };
    this.OperatingIncomeTypeLadderEchartData = option;
  }
  /*绘制近几年政府支持与税收情况*/
  creatGovernmentalSupportAndTaxEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const xAxisData = [];
    const series = {data1: [], data2: [], data3: []};
    for (let i = countYear - 1; i >= 0; i--) {
      xAxisData.push(lastYear - i);
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    }
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(Number(item[0]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(0));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][0]));
      series.data1[index] = filterData[i][1] ? filterData[i][1] : 0;
      series.data2[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data3[index] = (filterData[i][1] / filterData[i][2]) ? (filterData[i][1] / filterData[i][2] * 100).toFixed(2) : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        text: '近三年政府支持与税收',
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
        data: ['政府支持', '税收', '支持/税收']
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
          name: '补贴(万)',
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
  /*绘制近几年固定投资、营业收入和利润的比较*/
  creatFixedInvestmentIncomeProfitEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const xAxisData = [];
    const legendData = ['固定投资', '营业收入', '利润'];
    const series = {data1: [], data2: [], data3: []};
    for (let i = countYear - 1; i >= 0; i--) {
      xAxisData.push(lastYear - i);
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    }
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(Number(item[0]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(0));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][0]));
      series.data1[index] = filterData[i][1] ? -filterData[i][1] : 0;
      series.data2[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data3[index] = filterData[i][3] ? filterData[i][3] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        text: '近三年固定投资、营业收入和利润',
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
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
      xAxis : [
        {
          type : 'value',
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          },
          splitLine: { show: false },
        }
      ],
      yAxis : [
        {
          type : 'category',
          axisTick : {show: false},
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          },
          data : xAxisData
        }
      ],
      series : [
        {
          name: '固定投资',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data1
        },
        {
          name: '营业收入',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true
            }
          },
          data: series.data2
        },
        {
          name: '利润',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'left'
            }
          },
          data: series.data3
        }
      ]
    };
    this.FixedInvestmentIncomeProfitEchartData = option;
  }
  /*绘制近几年人均收入、人均税收、人均利润情况*/
  creatPeopleIncomePeopleTaxPeopleProfitEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const xAxisData = [];
    const legendData = ['人均收入', '人均税收', '人均利润'];
    const series = {data1: [], data2: [], data3: []};
    for (let i = countYear - 1; i >= 0; i--) {
      xAxisData.push(lastYear - i);
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    }
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(Number(item[0]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(0));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][0]));
      series.data1[index] = filterData[i][1] ? filterData[i][1] : 0;
      series.data2[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data3[index] = filterData[i][3] ? filterData[i][3] : 0;
    }

    const option = {
      color: this.echartInitConfig.colors,
      title: {
        text: '近三年人均收入、人均税收、人均利润',
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
  /*格式化排序*/
  compareFn(prop, type?) {
    return function (obj1, obj2) {
      let val1 = obj1[prop];
      let val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (type === 'asc') {
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      }else {
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      }
    };
  }

}
