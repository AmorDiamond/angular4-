import { Component, OnInit } from '@angular/core';
import { MacEconomicExpendService } from './mac-economic-expend.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
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
  constructor(
    private macEconomicExpendService: MacEconomicExpendService
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
      this.getExpendInfo(this.revenueTime);
      this.getExpendRateInfo(this.revenueTime);
    });

    this.getExpendInfo(this.revenueTime);
    this.getExpendRateInfo(this.revenueTime);

  }

  ngOnDestroy() {}
  /*获取公共性支出数据*/
  getExpendInfo(year) {
    const time = year;
    this.macEconomicExpendService.findListByParams({year: time}, 'macExpendUrl').subscribe(res => {
      console.log('公共性支出', res)
      this.expendDataList = res.data;
      const formatData = {xAxis: [], series: {expend: [], addSpeed: []}};
      this.expendDataList.forEach(res => {
        formatData.xAxis.push(res.quarterInfo);
        formatData.series.expend.push(res.expend);
        formatData.series.addSpeed.push(res.addSpeed);
      });
      this.creatExpendAndSpeedEchart(formatData);

    });
  }
  /*获取公共性支出占比数据*/
  getExpendRateInfo(year) {
    const time = year;
    this.macEconomicExpendService.findListByParams({year: time}, 'macExpendRateUrl').subscribe(res => {
      console.log('支出占比', res)
      if(res.responseCode === '_200') {
        const options = res.data;
        this.creatExpendDetailEchart(options);
      }
    })
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
        text: '公共性支出',
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
  /*绘制公共性支出详情图表*/
  creatExpendDetailEchart(options) {

    const expendDetailOptions = {
      title: {
        text: '公共性支出详情',
        textStyle: {
          color: '#bcbdbf'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '公共支出 <br/>{b} : {c} ({d}%)'
      },
      legend: {
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
        center: ['50%', '55%'],
        selectedMode: 'single',
        data: [{
          value: 849,
          name: '环保',
          label: {
            normal: {
              /*formatter: [
                '{title|{b}}{abg|}',
                '  {weatherHead|}{valueHead|PM2.5}{rateHead|占比}',
                '{hr|}',
                '  {Sunny|}{value|202万}{rate|55.3%}',
                '  {Cloudy|}{value|142万}{rate|38.9%}',
                '  {Showers|}{value|21万}{rate|5.8%}'
              ].join('\n'),
              backgroundColor: '#eee',
              borderColor: '#777',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                title: {
                  color: '#eee',
                  align: 'center'
                },
                abg: {
                  backgroundColor: '#333',
                  width: '100%',
                  align: 'right',
                  height: 25,
                  borderRadius: [4, 4, 0, 0]
                },
                Sunny: {
                  height: 30,
                  align: 'left',
                  backgroundColor: {
                    image: weatherIcons.Sunny
                  }
                },
                Cloudy: {
                  height: 30,
                  align: 'left',
                  backgroundColor: {
                    image: weatherIcons.Cloudy
                  }
                },
                Showers: {
                  height: 30,
                  align: 'left',
                  backgroundColor: {
                    image: weatherIcons.Showers
                  }
                },
                weatherHead: {
                  color: '#333',
                  height: 24,
                  align: 'left'
                },
                hr: {
                  borderColor: '#777',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                value: {
                  width: 20,
                  padding: [0, 20, 0, 30],
                  align: 'left'
                },
                valueHead: {
                  color: '#333',
                  width: 20,
                  padding: [0, 20, 0, 30],
                  align: 'center'
                },
                rate: {
                  width: 40,
                  align: 'right',
                  padding: [0, 10, 0, 0]
                },
                rateHead: {
                  color: '#333',
                  width: 40,
                  align: 'center',
                  padding: [0, 10, 0, 0]
                }
              }*/
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
    this.expendDetailOptions = expendDetailOptions;
  }

}
