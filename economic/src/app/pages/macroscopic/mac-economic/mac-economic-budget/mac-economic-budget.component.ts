import { Component, OnInit, OnDestroy } from '@angular/core';
import { MacEconomicBudgetService } from './mac-economic-budget.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
declare var $: any;

@Component({
  selector: 'app-mac-economic-budget',
  templateUrl: './mac-economic-budget.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicBudgetComponent implements OnInit, OnDestroy {

  budgetOptions: any;
  budgetAreaSpeedOptions: any;
  subscription: Subscription;
  revenueTime = new Date().getFullYear() - 1;
  budgetDataList = [];
  budgetAreaAddSpeedList = [];
  yearTotalOutput = 0;
  yearTotalAddspeed = 0;
  constructor(
    private macEconomicBudgetService: MacEconomicBudgetService,
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
      this.getBudgetSpeedInfo(this.revenueTime);
      this.getBudgetAreaAddSpeedInfo(this.revenueTime);
    });

    this.getBudgetSpeedInfo(this.revenueTime);
    this.getBudgetAreaAddSpeedInfo(this.revenueTime);
  }

  ngOnDestroy() {}

  /*获取公共性预算数据和增速*/
  getBudgetSpeedInfo(year) {
    const time = year;
    this.macEconomicBudgetService.findListByParams({year: time}, 'macBudgetUrl').subscribe(res => {
      console.log('公共性预算', res);
      if (res.responseCode === '_200') {
        this.budgetDataList = res.data;
        this.yearTotalOutput = 0;
        this.yearTotalAddspeed = 0;
        const formatData = {xAxis: [], series: {budget: [], addSpeed: []}};
        this.budgetDataList.forEach(item => {
          formatData.xAxis.push(item.quarterInfo);
          formatData.series.budget.push(item.budget);
          formatData.series.addSpeed.push(item.addSpeed);
          this.yearTotalOutput += item.budget;
          this.yearTotalAddspeed += item.addSpeed;
        });
        this.creatBudgetSpeedEchart(formatData);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*获取公共性预算地区增速数据*/
  getBudgetAreaAddSpeedInfo(year) {
    const time = year;
    this.macEconomicBudgetService.findListByParams({year: time}, 'macBudgetAreaSpeedUrl').subscribe(res => {
      console.log('预算详情', res)
      if (res.responseCode === '_200') {
        this.budgetAreaAddSpeedList = [];
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
          this.budgetAreaAddSpeedList.push({areaRange: item, addSpeed: yearAddSpeed});
        }

        const data = formatData;
        this.creatBudgetAreaSpeedEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*绘制公共性预算和增速图表*/
  creatBudgetSpeedEchart(options) {

    const echartsTitleAlign = 'center';
    const xAxisData = options.xAxis;
    const budgetData = options.series.budget;
    const speedData = options.series.addSpeed;
    const budgetOptions = {
      color: ['#1eb5d4', '#f9b621', '#675bba'],
      title: {
        show: true,
        text: '公共性预算',
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
        name: '千万',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        min: 0,
        type: 'value',
        splitLine: { show: false },
        axisLabel: {
          formatter: '{value} 千万',
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
        data: budgetData
      },
        {
          name: '同比增速',
          type: 'line',
          yAxisIndex: 1,
          data: speedData
        }
      ]
    };
    this.budgetOptions = budgetOptions;

  }
  /*绘制宏观公共预算地区增速图表*/
  creatBudgetAreaSpeedEchart(options) {
    const seriseData = options.seriseData;
    const yAxisData = options.yAxisData;
    const colors7 = ['#8e97e6', '#d14a61', '#675bba'];
    const gdpGrowthRateOptions = {
      title: {
        text: '公共预算增速',
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
          name: '公共预算增速',
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
    this.budgetAreaSpeedOptions = gdpGrowthRateOptions;
  }
}
