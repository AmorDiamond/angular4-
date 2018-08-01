import { Component, OnInit, OnDestroy } from '@angular/core';
import { MacEconomicPillarService } from './mac-economic-pillar.service';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  selector: 'app-mac-economic-pillar',
  templateUrl: './mac-economic-pillar.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicPillarComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  // 产业产值和增速
  pillarOutputSpeedOptions: any;
  // 产业贡献率
  pillarContributionRateOptions: any;
  revenueTime = new Date().getFullYear() - 1;
  constructor(
    private macEconomicPillarService: MacEconomicPillarService
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
      this.getPillarIndustryOutputAndSpeed(this.revenueTime);
    });

    this.getPillarIndustryOutputAndSpeed(this.revenueTime);
  }

  ngOnDestroy() {}
  /*获取支柱产业产值和贡献率情况*/
  getPillarIndustryOutputAndSpeed(year) {
    const time = year;
    this.macEconomicPillarService.findListByParams({year: time}, 'macPillarIndustryUrl').subscribe(res => {
      console.log('支柱产业', res);
      if(res.responseCode === '_200') {
        if(res.data.length > 0) {
          const options = res.data;
          const option = {
            industryType: ['集成电路', '软件及外包服务', '光电', '生物医药', '通讯', '精密机械'],
            outputValue: [201, 806, 403, 604, 201, 403],
            increaseSpeed: [13, 25, 10, 14, 14, 18]
          };
          const formatOption ={
            outPutValue: {industryType: [], outputValue: [], increaseSpeed: []},
            industryRate: {seriesData: [], legendData: []}
          };
          options.forEach((res) => {
            formatOption.outPutValue.industryType.push(res.mainstayIndustryType);
            formatOption.outPutValue.outputValue.push(res.economicOutput);
            formatOption.outPutValue.increaseSpeed.push(res.addSpeed);
            formatOption.industryRate.seriesData.push({value: res.economicOutput, name: res.mainstayIndustryType});
            formatOption.industryRate.legendData.push(res.mainstayIndustryType);
          });
          this.creatOutputAndSpeedEchart(formatOption.outPutValue);
          this.creatContributionRateEchart(formatOption.industryRate);
        }
      }
    })
  }
  /*绘制产业产值和产业增速*/
  creatOutputAndSpeedEchart(options) {
    const echartsTitleAlign = 'center';
    const optionCycz = options.outputValue;
    const optionCyzs = options.increaseSpeed;
    const legendData = ['产业产值', '产业增速'];
    const xAxisData = options.industryType;
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
      },
        {
          name: '增速',
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
  /*绘制产业贡献率图表*/
  creatContributionRateEchart(options) {
    const echartsTitleAlign = 'center';
    /*const optionCyzs = [
      { value: 13, name: '集成电路' },
      { value: 25, name: '软件及外包服务' },
      { value: 10, name: '光电' },
      { value: 14, name: '生物医药' },
      { value: 14, name: '通讯' },
      { value: 18, name: '精密机械' }
    ];*/
    const legendData = options.legendData;
    const optionCyzs = options.seriesData;

    // 产业增速
    const pillarContributionRateOptions = {
      title: {
        text: '支柱产业贡献率',
        textStyle: {
          color: '#bcbdbf'
        },
        left: echartsTitleAlign
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}:  {d}%'
      },
      grid: {containLabel: true},
      legend: {
        left: 'center',
        top: '8%',
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      series: [
        {
          name: '产业',
          type: 'pie',
          selectedMode: 'single',
          radius: '60%',
          center: ['50%', '55%'],
          label: {
            normal: {
              /*formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}% ', // 比例:{per|{d}%}
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }*/
            }
          },
          data: optionCyzs
        }
      ]
    };
    this.pillarContributionRateOptions = pillarContributionRateOptions;

  }
}
