import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class MacEconomicPillarService {

  private subject = new BehaviorSubject<any>(0);
  /*所有产业产值和增速*/
  private macPillarIndustryUrl = 'assets/jsonData/mac/macroMainstayfindByYear';
  /*各季度产值*/
  private macPillarIndustryQuarterUrl = 'assets/jsonData/mac/macroMainstayfindByQuarter';
  constructor(
    private http: HttpClient,
  ) {
    // this.changeData();
  }
  findListByParams(findParams, url, type?): Observable<any> {
    const httpUrl = this[url];
    const requestType = type ? type : 'get';
    let params;
    let paramsString = ``;
    if (!requestType || requestType === 'get' || requestType === 'delete') {
      for (let item in findParams) {
        if (item) {
          paramsString += findParams[item] ? `${item}=${findParams[item]}&` : '';
        }
      }
      params = {params: new HttpParams({ fromString: paramsString })};
    }

    return this.http[requestType](httpUrl + findParams.year + '.json', params);
  }

  /*通过多个请求获取数据*/
  getRequestByForkJoin(options: Array<any>): Observable<any> {
    const data = options;
    const forkJoinArr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let paramsString = '';
        const findParams = data[i].findParams;
        const http = data[i].http;
        for (const key in findParams) {
          if (findParams.hasOwnProperty(key)) {
            paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
          }
        }
        const params = new HttpParams({ fromString: paramsString });
        let post = this.http.get(`${this[http]}`, {params});
        forkJoinArr.push(post);
      }
    }
    return Observable.forkJoin(forkJoinArr);
  }
/*  changeData() {
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
  }*/

  getData() {
    return this.subject.asObservable();
  }
}
