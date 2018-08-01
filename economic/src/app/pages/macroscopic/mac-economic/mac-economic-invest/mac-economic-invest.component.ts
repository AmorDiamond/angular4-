import { Component, OnInit, OnDestroy } from '@angular/core';
import {  } from '@angular/core/src/metadata/lifecycle_hooks';
import { MacEconomicInvestService } from './mac-economic-invest.service';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  selector: 'app-mac-economic-invest',
  templateUrl: './mac-economic-invest.component.html',
  styleUrls: [
    '../mac-economic-gdp/mac-economic-gdp.component.css',
    './mac-economic-invest.component.css'
  ]
})
export class MacEconomicInvestComponent implements OnInit, OnDestroy {

  investOptions: any;
  subscription: Subscription;
  revenueTime = new Date().getFullYear() - 1;
  investDataList = [];
  constructor(
    private macEconomicInvestService: MacEconomicInvestService
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
      this.getInvestInfo(this.revenueTime);
    });

    this.getInvestInfo(this.revenueTime);
  }
  /*获取固定投资数据*/
  getInvestInfo(year) {
    const time = year;
    this.macEconomicInvestService.findListByParams({year: time}, 'macInvestUrl').subscribe(res => {
      console.log('固定投资', res)
      this.investDataList = res.data;
      const formatData = {xAxis: [], series: {investMoney: [], addSpeed: []}};
      this.investDataList.forEach(res => {
        formatData.xAxis.push(res.industryType);
        formatData.series.investMoney.push(res.fixedInverstment);
        formatData.series.addSpeed.push(res.addSpeed);
      });
      this.creatInvestEchart(formatData);
    })
  }
  /*绘制固定投资图表*/
  creatInvestEchart(options) {

    const echartsTitleAlign = 'center';
    const xAxisData = options.xAxis;
    const investSeriesData = options.series.investMoney;
    const speedSeriesData = options.series.addSpeed;
    const investOptions = {
      title: {
        show: true,
        text: '固定投资',
        left: echartsTitleAlign,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (param) {
          return param[0].name + '<br/>投资金额: ' + param[0].data + '亿元<br/>增速: ' + param[1].data + '%';
        }
      },
      grid: {
        left: '15%',
        top: '20%'
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            textStyle: {
              color: '#bcbdbf'
            }
          }
        }
      ],
      yAxis: [
        {
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
            //                        lineStyle: {
            //                            color: colors[1]
            //                        }
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
      series: [
        {
          name: '总投资',
          type: 'bar',
          stack: '产业',
          data: investSeriesData,
          itemStyle: {
            normal: {
              color: '#1eb5d4'
            }
          },
          label: {
            normal: {
              show: true,
              //                            rotate:45,
              offset: [5, -20],
              color: '#1eb5d4',
              position: 'top',
              formatter: function (param) {
                return param.data + '亿元';
              }
            }
          }
        },
        {
          name: '总投资',
          type: 'line',
          yAxisIndex: 1,
          data: speedSeriesData,
          itemStyle: {
            normal: {
              color: '#f9b621'
            }
          },
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'right',
              formatter: function (param) {
                return param.data + '%';
              }
            }
          }
        }
      ]
    };
    this.investOptions = investOptions;
  }
  ngOnDestroy() {}
}
