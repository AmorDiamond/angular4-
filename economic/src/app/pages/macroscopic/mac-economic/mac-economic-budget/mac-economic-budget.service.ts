import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MacEconomicBudgetService {

  private subject = new BehaviorSubject<any>(0);
  constructor() {
    this.changeData();
  }

  changeData() {
    const echartsTitleAlign = 'center';
    const weatherIcons = {
      'Sunny': '/asset/img/weather/sunny_128.png',
      'Cloudy': '/asset/img/weather/cloudy_128.png',
      'Showers': '/asset/img/weather/showers_128.png'
    };
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
        data: ['一季度', '二季度', '三季度', '四季度'],
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
        max: 1000,
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
        data: [318, 397, 417, 423]
      },
      {
        name: '同比增速',
        type: 'line',
        yAxisIndex: 1,
        data: [4, 4.5, 5.23, 5.47]
      }
      ]
    };
    const budgetDetailOptions = {
      title: {
        text: '公共性预算详情',
        textStyle: {
          color: '#bcbdbf'
        },
        subtext: '虚构数据',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '公共预算 <br/>{b} : {c} ({d}%)'
      },
      legend: {
        // orient: 'vertical',
        // top: 'middle',
        bottom: 10,
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
              formatter: [
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
              }
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
    this.subject.next({
      budgetOptions: budgetOptions,
      budgetDetailOptions: budgetDetailOptions
    });
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}
