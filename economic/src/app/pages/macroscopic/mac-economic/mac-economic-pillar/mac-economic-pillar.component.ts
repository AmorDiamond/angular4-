import { Component, OnInit, OnDestroy } from '@angular/core';
import { MacEconomicPillarService } from './mac-economic-pillar.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
declare var $: any;

@Component({
  selector: 'app-mac-economic-pillar',
  templateUrl: './mac-economic-pillar.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicPillarComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  // 产业产值
  pillarOutputOptions: any;
  // 产业产值和增速
  pillarOutputSpeedOptions: any;
  pillarOutputList = [];
  pillarOutputSpeedList = [];
  allEconomicOutput: any = 0;
  yearTotalOutput = 0;
  allTypeTotalOutput = 0;
  allSpeedOutput = 0;
  revenueTime = new Date().getFullYear() - 1;
  constructor(
    private macEconomicPillarService: MacEconomicPillarService,
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
      this.getPillarIndustryOutputAndSpeed(this.revenueTime);
    });

    this.getPillarIndustryOutputAndSpeed(this.revenueTime);
  }

  ngOnDestroy() {}
  /*获取支柱产业产值和贡献率情况*/
  getPillarIndustryOutputAndSpeed(year) {
    const time = year;
    this.macEconomicPillarService.findListByParams({year: time}, 'macPillarIndustryQuarterUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        const options = res.data;
        this.allTypeTotalOutput = 0;
        this.allSpeedOutput = 0;
        this.pillarOutputSpeedList = options;
        this.creatOutputAndSpeedEchart(options);
      }
    });
    this.macEconomicPillarService.findListByParams({year: time}, 'macPillarIndustryUrl').subscribe(res => {
      console.log('支柱产业', res);
      if (res.responseCode === '_200') {
        const options = res.data;
        this.yearTotalOutput = 0;
        this.pillarOutputList = options;
        this.creatOutputEchart(options);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*绘制各季度产业产值*/
  creatOutputEchart(options) {
    const echartsTitleAlign = 'center';
    const optionCycz = [];
    const legendData = ['产业产值', '产业增速'];
    const xAxisData = [];
    options.forEach(res => {
      xAxisData.push(res[0]);
      optionCycz.push(res[1] ? Number(res[1]).toFixed(2) : '');
      this.yearTotalOutput += res[1];
    });
    console.log(xAxisData)
    const pillarOutputSpeedOptions = {
      color: ['#1eb5d4', '#f9b621', '#675bba'],
      title: {
        show: true,
        text: '支柱产业产值',
        left: echartsTitleAlign,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      legend: {
        show: false,
        data: legendData,
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
        name: '产值(亿元)',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        min: 0,
        type: 'value',
        axisLabel: {
          formatter: '{value} 亿元',
          textStyle: {
            color: '#bcbdbf'
          }

        }
      }
      ],
      series: [{
        name: '产值',
        type: 'bar',
        stack: '产业',
        label: {
          normal: {
            show: true,
            // offset: [5, -20],
            color: '#1eb5d4',
            position: 'top',
            formatter: function (param) {
              return param.data + '亿元';
            }
          }
        },
        data: optionCycz
      }
      ]
    };
    this.pillarOutputOptions = pillarOutputSpeedOptions;

  }
  /*绘制产业产值和产业增速*/
  creatOutputAndSpeedEchart(options) {
    const echartsTitleAlign = 'center';
    const optionCycz = [];
    const optionCyzs = [];
    const xAxisData = [];
    const legendData = ['产业产值', '产业增速'];
    options.forEach(res => {
      xAxisData.push(res[1]);
      optionCycz.push(res[2] ? Number(res[2]).toFixed(2) : '');
      optionCyzs.push(res[0]);
      this.allTypeTotalOutput += res[2];
      this.allSpeedOutput += res[0];
    });
    const pillarOutputSpeedOptions = {
      color: ['#1eb5d4', '#f9b621', '#675bba'],
      title: {
        show: true,
        text: '支柱产业产值和增速',
        left: echartsTitleAlign,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      legend: {
        top: '30',
        data: legendData,
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
        name: '产值(亿元)',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        min: 0,
        type: 'value',
        axisLabel: {
          formatter: '{value} 亿元',
          textStyle: {
            color: '#bcbdbf'
          }

        }
      },
        {
          type: 'value',
          name: '增速(%)',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          min: 0,
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
        name: '产业产值',
        type: 'bar',
        stack: '产业',
        label: {
          normal: {
            show: true,
            // offset: [5, -20],
            color: '#1eb5d4',
            position: 'top',
            formatter: function (param) {
              return param.data + '亿元';
            }
          }
        },
        data: optionCycz
      },
        {
          name: '产业增速',
          type: 'line',
          yAxisIndex: 1,
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'right',
              formatter: function (param) {
                return param.data + '%';
              }
            }
          },
          data: optionCyzs
        }
      ]
    };
    this.pillarOutputSpeedOptions = pillarOutputSpeedOptions;

  }
}
