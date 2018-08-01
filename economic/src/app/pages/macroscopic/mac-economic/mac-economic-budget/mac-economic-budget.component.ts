import { Component, OnInit, OnDestroy } from '@angular/core';
import { MacEconomicBudgetService } from './mac-economic-budget.service';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  selector: 'app-mac-economic-budget',
  templateUrl: './mac-economic-budget.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicBudgetComponent implements OnInit, OnDestroy {

  budgetOptions: any;
  budgetDetailOptions: any;
  subscription: Subscription;
  revenueTime = new Date().getFullYear() - 1;
  budgetDataList = [];
  constructor(
    private macEconomicBudgetService: MacEconomicBudgetService
  ) { }

  ngOnInit() {
    /*时间控制*/
    $("#datetimepicker-maceco").datetimepicker({
      autoclose: 1,
      startView: 4,
      minView: 4,
      forceParse: 0,
      startDate: 2015,
      endDate: new Date().getFullYear() - 1,
      initialDate: new Date().getFullYear() - 1
    }).on('changeYear', (ev) => {
      const chooseTime = new Date(ev.date.valueOf()).getFullYear();
      this.revenueTime = chooseTime;
      this.getBudgetSpeedInfo(this.revenueTime);
      this.getBudgetRateInfo(this.revenueTime);
    });

    this.getBudgetSpeedInfo(this.revenueTime);
    this.getBudgetRateInfo(this.revenueTime);
  }

  ngOnDestroy() {}

  /*获取公共性预算数据和增速*/
  getBudgetSpeedInfo(year) {
    const time = year;
    this.macEconomicBudgetService.findListByParams({year: time}, 'macBudgetUrl').subscribe(res => {
      console.log('公共性预算', res);
      if(res.responseCode === '_200') {
        this.budgetDataList = res.data;
        const formatData = {xAxis: [], series: {budget: [], addSpeed: []}};
        this.budgetDataList.forEach(res => {
          formatData.xAxis.push(res.quarterInfo);
          formatData.series.budget.push(res.budget);
          formatData.series.addSpeed.push(res.addSpeed);
        });
        this.creatBudgetSpeedEchart(formatData);
      }
    })
  }
  /*获取公共性预算详情数据*/
  getBudgetRateInfo(year) {
    const time = year;
    this.macEconomicBudgetService.findListByParams({year: time}, 'macBudgetRateUrl').subscribe(res => {
      console.log('预算详情', res)
      if(res.responseCode === '_200') {
        const formatData = {};
        this.creatBudgetDetailEchart(formatData);
      }
    })
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
          max: 10,
          position: 'right',
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
  /*绘制公共性预算详情图表*/
  creatBudgetDetailEchart(options) {
    const weatherIcons = {
      'Sunny': '/asset/img/weather/sunny_128.png',
      'Cloudy': '/asset/img/weather/cloudy_128.png',
      'Showers': '/asset/img/weather/showers_128.png'
    };
    const budgetDetailOptions = {
      title: {
        text: '公共性预算详情',
        textStyle: {
          color: '#bcbdbf'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '公共预算 <br/>{b} : {c} ({d}%)'
      },
      legend: {
        // orient: 'vertical',
        top: '8%',
        left: 'center',
        data: ['环保', '公共交通建设', '民生', '社保医疗'],
        textStyle: {
          color: '#bcbdbf'
        }
      },
      series: [{
        type: 'pie',
        radius: '65%',
        center: ['50%', '50%'],
        selectedMode: 'single',
        data: [{
          value: 849,
          name: '环保',
          label: {
            normal: {
            }
          }
        },
          {
            value: 425,
            name: '公共交通建设'
          },
          {
            value: 318,
            name: '民生'
          },
          {
            value: 425,
            name: '社保医疗'
          }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    this.budgetDetailOptions = budgetDetailOptions;
  }
}
