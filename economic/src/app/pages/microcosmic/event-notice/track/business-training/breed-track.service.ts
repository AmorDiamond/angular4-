import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BreedTrackService {
  private subject = new BehaviorSubject<any>(0);

  constructor() {
    this.changeData();
  }

  changeData() {
    const breedTrackOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['专利申请', '知识产权申请', '用地申请', '创业金申请'],
        textStyle: {
          color: '#bcbdbf'
        }
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          name: '时间',
          nameTextStyle: {
            color: '#B2B2B2',
          },
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisLabel: {
            textStyle: {
              color: '#B2B2B2'
            }
          }
        }
      ],
      yAxis: [
        {
          name: '份数 (份)',
          nameTextStyle: {
            color: '#B2B2B2',
          },
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#B2B2B2'
            }
          }
        }
      ],
      series: [
        {
          name: '专利申请',
          type: 'bar',
          stack: '材料',
          data: [120, 132, 101, 134, 90, 230, 210, 85, 79, 94, 16, 85]
        },
        {
          name: '知识产权申请',
          type: 'bar',
          stack: '材料',
          data: [220, 182, 191, 234, 290, 330, 310, 89, 58, 68, 109, 68]
        },
        {
          name: '用地申请',
          type: 'bar',
          stack: '材料',
          data: [150, 232, 201, 154, 190, 330, 410, 120, 150, 29, 50, 60]
        },
        {
          name: '创业金申请',
          type: 'bar',
          stack: '材料',
          data: [150, 232, 201, 154, 190, 330, 0, 89, 78, 58, 97, 109]
        }
      ]
    };

    this.subject.next({
      breedTrackOptions: breedTrackOptions
    });
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}
