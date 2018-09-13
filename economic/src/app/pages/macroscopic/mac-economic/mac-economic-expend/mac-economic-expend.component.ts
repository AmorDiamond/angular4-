import { Component, OnInit } from '@angular/core';
import { MacEconomicExpendService } from './mac-economic-expend.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
declare var $: any;

@Component({
  selector: 'app-mac-economic-expend',
  templateUrl: './mac-economic-expend.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicExpendComponent implements OnInit, OnDestroy {

  subscriptionExpend: Subscription;
  subscriptionExpendDetail: Subscription;

  // 支出
  expendOptions: any;
  // 支出详情
  expendDetailOptions: any;
  revenueTime = new Date().getFullYear() - 1;
  expendDataList = [];
  expendAddSpeedList = [];
  yearTotalOutput = 0;
  yearTotalAddspeed = 0;
  constructor(
    private macEconomicExpendService: MacEconomicExpendService,
    private toastModalService: ToastModalService
  ) { }

  ngOnInit() {

    /*时间控制*/
    $('#datetimepicker-maceco').datetimepicker({
      autoclose: 1,
      startView: 4,
      minView: 4,
      forceParse: 0,
      startDate: 2015,
      endDate: new Date().getFullYear(),
      initialDate: new Date().getFullYear() - 1
    }).on('changeYear', (ev) => {
      const chooseTime = new Date(ev.date.valueOf()).getFullYear();
      this.revenueTime = chooseTime;
      this.getExpendInfo(this.revenueTime);
      this.getExpendAreaSpeddInfo(this.revenueTime);
    });

    this.getExpendInfo(this.revenueTime);
    this.getExpendAreaSpeddInfo(this.revenueTime);

  }

  ngOnDestroy() {}
  /*获取公共性支出数据*/
  getExpendInfo(year) {
    const time = year;
    this.macEconomicExpendService.findListByParams({year: time}, 'macExpendUrl').subscribe(res => {
      console.log('公共性支出', res)
      if (res.responseCode === '_200') {
        this.yearTotalOutput = 0;
        this.yearTotalAddspeed = 0;
        this.expendDataList = res.data.sort(this.stringCompareFn('quarterInfo')); // 按照季度处理排序
        console.log(this.expendDataList)
        const formatData = {xAxis: [], series: {expend: [], addSpeed: []}};
        this.expendDataList.forEach(item => {
          formatData.xAxis.push(item.quarterInfo);
          formatData.series.expend.push(item.expend);
          formatData.series.addSpeed.push(item.addSpeed);
          this.yearTotalOutput += item.expend;
          this.yearTotalAddspeed += item.addSpeed;
        });
        this.creatExpendAndSpeedEchart(formatData);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }

    });
  }
  /*获取各地区公共性支出增速*/
  getExpendAreaSpeddInfo(year) {
    const time = year;
    this.macEconomicExpendService.findListByParams({year: time}, 'macExpendAreaSpeedUrl').subscribe(res => {
      console.log('支出增速', res)
      if (res.responseCode === '_200') {
        this.expendAddSpeedList = [];
        const options  = res.data;
        const formatData = {yAxisData: [], seriseData: []};
        const copyObjType = {};
        options.forEach(item => {
          const areaRange = item.areaRange;
          if (areaRange && copyObjType[areaRange]) {
            /*返回的数据是各个地区四个季度的数据，需要相加获取一年增速*/
            copyObjType[areaRange].addSpeed += item.addSpeed;
            copyObjType[areaRange].quarterNum += 1;
          }else if (areaRange) {
            copyObjType[areaRange] = {};
            copyObjType[areaRange]['addSpeed'] = 0;
            copyObjType[areaRange]['quarterNum'] = 1;
            copyObjType[areaRange]['addSpeed'] += item.addSpeed;
          }
        });
        console.log(copyObjType)
        for (const item in copyObjType) {
          formatData.yAxisData.push(item);
          const yearAddSpeed = (copyObjType[item].addSpeed / copyObjType[item].quarterNum).toFixed(2);
          formatData.seriseData.push(yearAddSpeed);
          this.expendAddSpeedList.push({areaRange: item, addSpeed: yearAddSpeed});
        }

        const data = formatData;
        this.creatExpendSpeedEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*绘制公共性支出和增速图表*/
  creatExpendAndSpeedEchart(options) {

    const echartsTitleAlign = 'center';
    const xAxisData = options.xAxis;
    const expendData = options.series.expend;
    const speedData = options.series.addSpeed;
    const expendOptions = {
      color: ['#1eb5d4', '#f9b621', '#675bba'],
      title: {
        show: true,
        text: '高新区公共性支出',
        left: echartsTitleAlign,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '15%',
        top: '20%'
      },
      xAxis: [{
        type: 'category',
        data: xAxisData,
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }],
      yAxis: [{
        name: '亿元',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        min: 0,
        type: 'value',
        splitLine: { show: false },
        axisLabel: {
          formatter: '{value} 亿元',
          textStyle: {
            color: '#bcbdbf'
          }

        }
      },
        {
          type: 'value',
          name: '同比增速',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          min: 0,
          position: 'right',
          splitLine: { show: false },
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: '{value} %',
            textStyle: {
              color: '#bcbdbf'
            }
          }
        }
      ],
      series: [{
        name: '总金额',
        type: 'bar',
        barMaxWidth: '50%',
        stack: '产业',
        data: expendData
      },
        {
          name: '同比增速',
          type: 'line',
          yAxisIndex: 1,
          data: speedData
        }
      ]
    };
    this.expendOptions = expendOptions;
  }

  /*绘制宏观各区域支出增速图表*/
  creatExpendSpeedEchart(options) {
    const seriseData = options.seriseData;
    const yAxisData = options.yAxisData;
    const colors7 = ['#8e97e6', '#d14a61', '#675bba'];
    const gdpGrowthRateOptions = {
      title: {
        text: '公共支出增速',
        left: 'center',
        textStyle: {
          color: '#bcbdbf'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '15%',
        right: '13%'
      },
      color: colors7,
      xAxis: {
        name: '增速(%)',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        type: 'value',
        axisTick: {
          alignWithLabel: true
        },
        boundaryGap: [0, 0.1],
        axisLabel: {
          textStyle: {
            color: '#bcbdbf',
          }
        }
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        boundaryGap: ['20%', '20%'],
        axisLabel: {
          textStyle: {
            color: '#bcbdbf',
          }
        }
      },
      series: [
        {
          name: '公共支出增速',
          type: 'bar',
          data: seriseData,
          barMaxWidth: '40%',
          label: {
            normal: {
              show: true,
              color: '#8e97e6',
              position: 'right',
              formatter: function (param) {
                return param.data + '%';
              }
            }
          }
        }
      ]
    };
    this.expendDetailOptions = gdpGrowthRateOptions;
  }
  /*格式化排序*/
  stringCompareFn(prop, type?) {
    return function (obj1, obj2) {
      const val1 = obj1[prop];
      const val2 = obj2[prop];
      return val1.localeCompare(val2);
    };
  }

}
