import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MacEconomicIncomeService {

  private subject = new BehaviorSubject<any>(0);
  constructor() {
    this.changeData();
  }

  changeData() {
    const echartsTitleAlign = 'center';
    const incomeOptions = {
      color: ['#1eb5d4', '#f9b621', '#675bba'],
      title: {
        show: true,
        text: '高新区人均收入',
        left: echartsTitleAlign,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['人均收入', '同比增速'],
        textStyle: {
          color: '#bcbdbf'
        },
        top: 30
      },
      grid: {
        left: '15%',
        top: '20%'
      },
      xAxis: [
        {
          type: 'category',
          data: ['一季度', '二季度', '三季度', '四季度'],
          axisLabel: {
            textStyle: {
              color: '#B2B2B2'
            }
          }
        }
      ],
      yAxis: [
        {
          name: '元',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          type: 'value',
          min: 0,
          max: 10000,
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: '{value} 元',
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
          max: 100,
          position: 'right',
          axisLine: {
            lineStyle: {
              show: true
            }
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
          name: '人均收入',
          type: 'bar',
          data: [5600, 5700, 5700, 5750],
          label: {
            normal: {
              show: true,
              offset: [5, -20],
              position: 'top',
              formatter: function (param) {
                return param.data + '元';
              }
            }
          },
          itemStyle: {
            normal: {
            }
          }
        },
        {
          name: '同比增速',
          type: 'line',
          yAxisIndex: 1,
          data: [9.8, 9.8, 9.6, 9.5],
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
              formatter: function (param) {
                return param.data + '%';
              }
            }
          }
        }
      ]
    };
    const incomeTypeOptions = {
      title: {
        text: '收入类型占比',
        left: echartsTitleAlign,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}%'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['土木工程', '互联网及软件', '机械制造', '其他'],
        textStyle: {
          color: '#bcbdbf'
        }
      },
      series: [
        {
          name: '收入类型占比',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              formatter: '{b}: {c}%',
              textStyle: {
                fontSize: '25',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: 15, name: '土木工程' },
            { value: 34, name: '互联网及软件' },
            { value: 21, name: '机械制造' },
            { value: 30, name: '其他' }
          ]
        }
      ]
    };
    this.subject.next({
      incomeOptions: incomeOptions,
      incomeTypeOptions: incomeTypeOptions
    });
  }

  getData() {
    return this.subject.asObservable();
  }

}
