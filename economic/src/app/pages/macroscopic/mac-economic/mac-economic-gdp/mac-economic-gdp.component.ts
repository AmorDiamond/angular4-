import { Component, OnInit, OnDestroy } from '@angular/core';
import { MacEconomicGdpService } from './mac-economic-gdp.service';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  selector: 'app-mac-economic-gdp',
  templateUrl: './mac-economic-gdp.component.html',
  styleUrls: ['./mac-economic-gdp.component.css']
})
export class MacEconomicGdpComponent implements OnInit, OnDestroy {

  _date = new Date();
  gdpOptions: any;
  gdpGrowthRateOptions: any;
  subscription: Subscription;
  revenueTime = new Date().getFullYear() - 1;
  gdpDataList = [];
  constructor(
    private macEconomicGdpService: MacEconomicGdpService
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
      this.getGdpInfo(this.revenueTime);
      this.getSpeedInfo(this.revenueTime);
    });

    this.getGdpInfo(this.revenueTime);
    this.getSpeedInfo(this.revenueTime);
  }

  ngOnDestroy() {
  }
  /*获取宏观GDP数据*/
  getGdpInfo(year) {
    const time = year;
    this.macEconomicGdpService.findListByParams({year: time}, 'macGdpByYearUrl').subscribe(res => {
      console.log('GDP数据', res);
      if(res.responseCode === '_200') {
       this.gdpDataList = res.data;

        const formatData = {xAxis: [], series: []};
        this.gdpDataList.forEach(res => {
          formatData.xAxis.push(res.quarterInfo);
          formatData.series.push(res.economicOutput);
        });
        this.creatGdpEcahrt(formatData)
      }
    });
  }
  /*绘制宏观GDP数据图表*/
  creatGdpEcahrt(options) {
    const xAxisData = options.xAxis;
    const seriesData = options.series;
    const colors = ['#1eb5d4', '#d14a61', '#675bba'];
    const gdpOptions = {
      title: {
        show: true,
        text: '高新区GDP',
        left: 'center',
        textStyle: {
          color: '#bcbdbf',
        }
      },
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (param) {
          return param[0].name + '<br/>GDP: ' + param[0].data + '亿元<br/>';
        }
      },
      grid: {
        left: '15%'
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: ['一季度', '二季度', '三季度', '四季度'],
          axisLabel: {
            textStyle: {
              color: '#bcbdbf',
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'GDP',
          nameTextStyle: {
            color: '#bcbdbf',
          },
          min: 0,
          position: 'left',
          splitLine: { show: false },
          axisLabel: {
            formatter: '{value} 亿元',
            textStyle: {
              color: '#bcbdbf',
            }
          }
        }],
      series: [
        {
          name: 'GDP预测',
          type: 'bar',
          data: seriesData,
          label: {
            normal: {
              show: true,
              //                                rotate:45,
              offset: [5, -20],
              color: '#1eb5d4',
              position: 'top',
              formatter: function (param) {
                return param.data + '亿元';
              }
            }
          }
        }
      ]
    };
    this.gdpOptions = gdpOptions;
  }
  /*获取宏观GDP增速数据*/
  getSpeedInfo(year) {
    const time = year;
    this.macEconomicGdpService.findListByParams({year: time}, 'macGdpSpeedByYearUrl').subscribe(res => {
      console.log('GDP增速数据', res);
      if(res.responseCode === '_200') {
        const options  = res.data;
      }
    });
    const optionsZs17 = [8.0, 9.32, 8.1, 6.9];

    const options = {data: optionsZs17};
    this.creatGdpSpeedEchart(options);
  }
  /*绘制宏观GDP增速图表*/
  creatGdpSpeedEchart(options) {
    const seriseData = options.data;
    const colors7 = ['#8e97e6', '#d14a61', '#675bba'];
    const gdpGrowthRateOptions = {
      title: {
        text: 'GDP增速',
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
        data: ['高新区', '成都', '四川省', '中国'],
        boundaryGap: ['20%', '20%'],
        axisLabel: {
          textStyle: {
            color: '#bcbdbf',
          }
        }
      },
      series: [
        {
          name: 'GDP增速',
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
    this.gdpGrowthRateOptions = gdpGrowthRateOptions;
  }

}
