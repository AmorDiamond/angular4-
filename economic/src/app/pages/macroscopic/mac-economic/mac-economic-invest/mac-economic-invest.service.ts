import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MacEconomicInvestService {

  private subject = new BehaviorSubject<any>(0);
  constructor() {
    this.changeData();
  }

  changeData() {
    const echartsTitleAlign = 'center';
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
          data: ['电子信息', '生物与新医药', '航空航天', '新材料', '高技术服务业', '新能源节能', '资源与环境', '高新技术改造传统产业技术'],
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
          max: 200,
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
          max: 25,
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
          data: [87, 97, 105, 97, 130, 124, 98, 150],
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
          data: [2, 3, 6, 4, 5, 7, 6, 5],
          itemStyle: {
            normal: {
              color: '#f9b621'
            }
          },
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'button',
              formatter: function (param) {
                return param.data + '%';
              }
            }
          }
        }
      ]
    };
    this.subject.next({
      investOptions: investOptions
    });
  }

  getDate(): Observable<any> {
    return this.subject.asObservable();
  }
}
