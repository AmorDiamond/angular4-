import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MacEconomicGdpService {

  private subject = new BehaviorSubject<any>(0);
  constructor() {
    this.changeData();
  }

  changeData() {
    const optionsGdp16 = [310.7, 319.69, 338.3, 467.81];
    const optionsZs16 = [8.5, 7.7, 7.7, 6.7];

    const optionsGdp17 = [375.1, 344, 457];
    const optionsZs17 = [8.0, 9.32, 8.1, 6.9];

    const colors = ['#1eb5d4', '#d14a61', '#675bba'];
    const colors7 = ['#8e97e6', '#d14a61', '#675bba'];

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
          data: optionsGdp17,
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
          name: '2016年',
          type: 'bar',
          data: optionsZs17,
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
    this.subject.next({
      gdpOptions: gdpOptions,
      gdpGrowthRateOptions: gdpGrowthRateOptions
    });
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }

}
