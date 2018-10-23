import { Component, OnInit } from '@angular/core';
import { TradeBoardService } from '../trade-board.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-lead-service',
  templateUrl: './lead-service.component.html',
  styleUrls: ['./lead-service.component.css']
})
export class LeadServiceComponent implements OnInit {

  constructor(
    private tradeBoardService: TradeBoardService,
    private toastModalService: ToastModalService,
  ) { }

  CompositionEchartChoseYear: number;
  CompositionData = [];
  CompanyNumberAndPeopleNumberEchartData: any;
  EducationCompositionEchartData: any;
  JobCompositionEchartData: any;
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
    this.getData();
  }
  /*获取主导服务业数据*/
  getData() {
    this.tradeBoardService.requestByParams({}, 'tradeServiceIndustryViewUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        const data = res.data;
        this.CompositionData = data.table_1_2_3;
        this.creatCompanyNumberAndPeopleNumber(this.CompositionData);
        this.filterCompositionEchartData();
        this.creatGovernmentalSupportAndTaxEchart(data.table_4);
        this.creatFixedInvestmentIncomeProfitEchart(data.table_5);
        this.creatPeopleIncomePeopleTaxPeopleProfitEchart(data.table_6);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  chartClick(event) {
    const year = event.name;
    this.CompositionEchartChoseYear = Number(year);
    this.filterCompositionEchartData();
  }
  /*筛选所需的职工绘制占比数据*/
  filterCompositionEchartData() {
    /*筛选出所需数据*/
    let filterData;
    if (this.CompositionEchartChoseYear) {
      filterData = this.CompositionData.filter((item) => {
        return Number(item[1]) === this.CompositionEchartChoseYear;
      });
    }else {
      const needData = this.CompositionData.filter((item) => {
        return item[1];
      });
      filterData = [needData[0]];
      this.CompositionData.forEach((item) => {
        item.forEach((itemChild, i) => {
          if (i > 2) {
            filterData[0][i] += itemChild;
          }
        });
      });
    }
    this.creatEducationCompositionEchart(filterData[0]);
    this.creatJobCompositionEchart(filterData[0]);
  }
  /*绘制近三年企业数量和职工人数*/
  creatCompanyNumberAndPeopleNumber(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const xAxisData = [];
    const series = {data1: [], data2: []};
    for (let i = countYear - 1; i >= 0; i--) {
      xAxisData.push(lastYear - i);
      series.data1.push(0);
      series.data2.push(0);
    }
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(Number(item[1]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(1));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][1]));
      series.data1[index] = filterData[i][0] ? filterData[i][0] : 0;
      series.data2[index] = filterData[i][2] ? filterData[i][2] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '近三年企业数量和职工人数',
        left: 'center',
        textStyle: {
          color: textColor,
        }
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
    this.CompanyNumberAndPeopleNumberEchartData = option;
  }
  /*绘制职工学历分布*/
  creatEducationCompositionEchart(options) {
    const seriesData = [
      {value: options[3] ? options[3] : 0 , name: '研究生'},
      {value: options[4] ? options[4] : 0 , name: '本科以上'},
      {value: options[5] ? options[5] : 0 , name: '大专'}
    ];
    const echartTitle = this.CompositionEchartChoseYear ? this.CompositionEchartChoseYear + '职工学历层次分布' : '职工学历层次分布';
    const textColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: this.echartInitConfig.colors,
      title : {
        text: '学历学位',
        left: 'center',
        top: '45%',
        textStyle: {
          color: '#bcbdbf',
          fontSize: 24,
          fontWeight: 'normal',
        }
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
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
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
      {value: options[6] ? options[6] : 0 , name: '中层及以上管理人员'},
      {value: options[7] ? options[7] : 0 , name: '专业技术人员'},
      {value: options[8] ? options[8] : 0 , name: '技术工人'}
    ];
    const echartTitle = this.CompositionEchartChoseYear ? this.CompositionEchartChoseYear + '职工岗位类型占比' : '职工岗位类型占比';
    const textColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: this.echartInitConfig.colors,
      title : {
        text: '岗位类型',
        left: 'center',
        top: '45%',
        textStyle: {
          color: '#bcbdbf',
          fontSize: 24,
          fontWeight: 'normal',
        }
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
      return xAxisData.includes(Number(item[2]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(2));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][2]));
      series.data1[index] = filterData[i][0] ? filterData[i][0] : 0;
      series.data2[index] = filterData[i][1] ? filterData[i][1] : 0;
      series.data3[index] = (filterData[i][0] / filterData[i][1]) ? (filterData[i][0] / filterData[i][1] * 100).toFixed(2) : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '近三年政府支持与税收',
        left: 'center',
        textStyle: {
          color: textColor,
        }
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
            lineStyle: this.echartInitConfig.splitLineStyle
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
      return xAxisData.includes(Number(item[3]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(3));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][3]));
      series.data1[index] = filterData[i][0] ? -filterData[i][0] : 0;
      series.data2[index] = filterData[i][1] ? filterData[i][1] : 0;
      series.data3[index] = filterData[i][2] ? filterData[i][2] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '近三年固定投资、营业收入和利润',
        left: 'center',
        textStyle: {
          color: textColor,
        }
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
          splitLine: {
            show: true,
            lineStyle: this.echartInitConfig.splitLineStyle,
          },
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
      return xAxisData.includes(Number(item[4]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(4));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][4]));
      series.data1[index] = filterData[i][0] ? filterData[i][0] : 0;
      series.data2[index] = filterData[i][1] ? filterData[i][1] : 0;
      series.data3[index] = filterData[i][2] ? filterData[i][2] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
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
