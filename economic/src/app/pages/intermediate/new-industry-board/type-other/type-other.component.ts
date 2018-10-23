import { Component, OnInit } from '@angular/core';
import { IndustryBoardService } from '../industry-board.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-type-other',
  templateUrl: './type-other.component.html',
  styleUrls: ['./type-other.component.css']
})
export class TypeOtherComponent implements OnInit {

  constructor(
    private industryBoardService: IndustryBoardService,
    private routerInfo: ActivatedRoute,
    private toastModalService: ToastModalService
  ) { }

  typeName = '';
  typeId = '';
  yearListData = [];
  LossRateEchartData: any;
  EnergyProductionEchartData: any;
  UnitSewageEchartData: any;
  SewageCapacityEchartData: any;
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
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    for (let i = countYear - 1; i >= 0; i--) {
      this.yearListData.push(lastYear - i);
    }
    this.getLossRateData();
    this.getEnergyProductionData();
    this.getUnitSewageData();
    this.getSewageCapacityData();
  }
  /*获取企业流失率数据*/
  getLossRateData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'typeOtherLossRate').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data;
        this.creatLossRateEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取综合能耗的经济总产值数据*/
  getEnergyProductionData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'typeOtherEnergyProductionUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data;
        this.creatEnergyProductionEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取单位环保排污与总产值比值数据*/
  getUnitSewageData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'typeOtherUnitSewageUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data;
        this.creatUnitSewageEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取环保排污走势情况数据*/
  getSewageCapacityData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'typeOtherSewageCapacityUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data;
        this.creatSewageCapacityEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*绘制流失率图表*/
  creatLossRateEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = this.yearListData;
    const legendData = ['企业总数', '迁出企业', '迁出率'];
    const series = {data1: [], data2: [], data3: []};
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    });
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
        show: false,
        text: '近三年企业迁出情况',
        left: 'center',
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
          name: '数量(家)',
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
          name: '迁出率(%)',
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
          name: '企业总数',
          type: 'bar',
          data: series.data1
        },
        {
          name: '迁出企业',
          type: 'bar',
          data: series.data2
        },
        {
          name: '迁出率',
          type: 'line',
          smooth: this.echartInitConfig.lineSmooth,
          yAxisIndex: 1,
          data: series.data3
        }
      ]
    };
    this.LossRateEchartData = option;
  }
  /*绘制综合能耗的经济总产值图表*/
  creatEnergyProductionEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = this.yearListData;
    const legendData = ['综合能耗', '经济总产值', '单位产值'];
    const series = {data1: [], data2: [], data3: []};
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    });
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
      series.data3[index] = (filterData[i][2] / filterData[i][1]) ? (filterData[i][2] / filterData[i][1] * 100).toFixed(2) : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '近三年单位综合能耗的经济总产值',
        left: 'center',
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
          name: '能耗(吨标准煤)',
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
          name: '经济值(万元)',
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
          name: '单位产值',
          offset: 80,
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
          name: '综合能耗',
          type: 'bar',
          data: series.data1
        },
        {
          name: '经济总产值',
          type: 'bar',
          yAxisIndex: 1,
          data: series.data2
        },
        {
          name: '单位产值',
          type: 'line',
          smooth: this.echartInitConfig.lineSmooth,
          yAxisIndex: 2,
          data: series.data3
        }
      ]
    };
    this.EnergyProductionEchartData = option;
  }
  /*绘制环保排污走势情况图表*/
  creatSewageCapacityEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = this.yearListData;
    const legendData = ['COD含量', '氨氮含量', 'SO2含量', 'NOX含量'];
    const series = {data1: [], data2: [], data3: [], data4: []};
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
      series.data4.push(0);
    });
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
      series.data4[index] = filterData[i][4] ? filterData[i][4] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '近三年环保排污走势情况',
        left: 'center',
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
          name: '值(吨/年)',
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
        }
      ],
      series: [
        {
          name: 'COD含量',
          type: 'scatter',
          data: series.data1,
          symbolSize: (value, params) => Math.sqrt(value),
        },
        {
          name: '氨氮含量',
          type: 'scatter',
          data: series.data2,
          symbolSize: (value, params) => Math.sqrt(value),
        },
        {
          name: 'SO2含量',
          type: 'scatter',
          data: series.data3,
          symbolSize: (value, params) => Math.sqrt(value),
        },
        {
          name: 'NOX含量',
          type: 'scatter',
          data: series.data4,
          symbolSize: (value, params) => Math.sqrt(value),
        }
      ]
    };
    this.SewageCapacityEchartData = option;
  }
  /*绘制单位环保排污与总产值比值图表*/
  creatUnitSewageEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = this.yearListData;
    const legendData = ['环保排污总量', '经济总产值', '单位产值'];
    const series = {data1: [], data2: [], data3: []};
    xAxisData.forEach(item => {
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    });
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
      series.data3[index] = (filterData[i][2] / filterData[i][1]) ? (filterData[i][2] / filterData[i][1] * 100).toFixed(2) : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '近三年单位环保排污的经济总产值',
        left: 'center',
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
          name: '排污量(吨/年)',
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
          name: '经济值(万元)',
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
          name: '单位产值',
          offset: 80,
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
          name: '环保排污总量',
          type: 'bar',
          data: series.data1
        },
        {
          name: '经济总产值',
          type: 'bar',
          yAxisIndex: 1,
          data: series.data2
        },
        {
          name: '单位产值',
          type: 'line',
          smooth: this.echartInitConfig.lineSmooth,
          yAxisIndex: 2,
          data: series.data3
        }
      ]
    };
    this.UnitSewageEchartData = option;
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
