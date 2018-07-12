import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MacEconomicPillarService {

  private subject = new BehaviorSubject<any>(0);

  constructor() {
    this.changeData();
  }

  changeData() {
    const echartsTitleAlign = 'center';
    const optionCycz = [
      { value: 201, name: '集成电路' },
      { value: 806, name: '软件及外包服务' },
      { value: 403, name: '光电' },
      { value: 604, name: '生物医药' },
      { value: 201, name: '通讯' },
      { value: 403, name: '精密机械' }
    ];
    const optionCyzs = [
      { value: 13, name: '集成电路' },
      { value: 25, name: '软件及外包服务' },
      { value: 10, name: '光电' },
      { value: 14, name: '生物医药' },
      { value: 14, name: '通讯' },
      { value: 18, name: '精密机械' }
    ];
    // 产业产值
    const pillarOutputValueOptions = {
      title: {
        text: '支柱产业产值',
        textStyle: {
          color: '#bcbdbf'
        },
        left: echartsTitleAlign
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['集成电路', '软件及外包服务', '光电', '生物医药', '通讯', '精密机械'],
        textStyle: {
          color: '#bcbdbf'
        }
      },
      series: [
        {
          name: '产业',
          type: 'pie',
          selectedMode: 'single',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}亿元    ', // 比例:{per|{d}%}
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
              }
            }
          },
          data: optionCycz
        }
      ]
    };
    // 产业增速
    const pillarGrowthRateOptions = {
      title: {
        text: '支柱产业增速',
        textStyle: {
          color: '#bcbdbf'
        },
        left: echartsTitleAlign
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}:  {c}%'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['集成电路', '软件及外包服务', '光电', '生物医药', '通讯', '精密机械'],
        textStyle: {
          color: '#bcbdbf'
        }
      },
      series: [
        {
          name: '产业',
          type: 'pie',
          selectedMode: 'single',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}% ', // 比例:{per|{d}%}
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
              }
            }
          },
          data: optionCyzs
        }
      ]
    };
    this.subject.next({
      pillarOutputValueOptions: pillarOutputValueOptions,
      pillarGrowthRateOptions: pillarGrowthRateOptions
    });
  }

  getData() {
    return this.subject.asObservable();
  }
}
