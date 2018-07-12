import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ForecastResultService {

  private subject = new BehaviorSubject<any>(0);
  constructor() {
    this.changeData();
  }

  changeData() {
    const echartsTitleAlign = 'center';
    const colors = ['#1eb5d4', '#bcbdbf', '#675bba'];
    const forecastTime = new Date().getFullYear() + 1 + '年';
    // 预测结果-> gdp
    const gdpOptions = {
      title: {
        show: true,
        text: forecastTime + '高新区GDP',
        left: 'center',
        textStyle: {
          color: '#bcbdbf'
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
          max: 1000,
          position: 'left',
          splitLine: { show: false },
          /*axisLine: {
              lineStyle: {
                  color: 'black'
              }
          },*/
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
          data: [360, 480, 570, 600],
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
        }
      ]
    };
    // 预测结果-> 公共性预算
    const budgetOptions = {
      title: {
        show: true,
        text: forecastTime + '公共性预算',
        textStyle: {
          color: '#bcbdbf'
        },
        left: echartsTitleAlign

      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['环保', '公共交通建设', '民生', '社保医疗'],
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
          max: 1000,
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
          max: 10,
          position: 'right',
          splitLine: { show: false },
          /*axisLine: {
              lineStyle: {
                  color: colors[1]
              }
          },*/
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
          name: '环保',
          type: 'bar',
          stack: '产业',
          data: [60, 80, 90, 95]
        },
        {
          name: '公共交通建设',
          type: 'bar',
          stack: '产业',
          data: [100, 150, 190, 210]
        },
        {
          name: '民生',
          type: 'bar',
          stack: '产业',
          data: [20, 30, 35, 35]
        },
        {
          name: '社保医疗',
          type: 'bar',
          stack: '产业',
          data: [40, 50, 65, 65]
        },
        {
          name: '环保',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 3, 3, 4]
        },
        {
          name: '公共交通建设',
          type: 'line',
          yAxisIndex: 1,
          data: [1, 2, 2, 3]
        },
        {
          name: '民生',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 4, 3, 4]
        },
        {
          name: '社保医疗',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 3, 2, 2]
        }
      ]
    };
    // 预测结果-> 人均收入
    const incomeOptions = {
      title: {
        show: true,
        text: forecastTime + '高新区人均收入',
        textStyle: {
          color: '#bcbdbf'
        },
        left: echartsTitleAlign
      },
      color: ['#1eb5d4', '#f9b621'],
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
          textStyle: {
            color: '#bcbdbf'
          },
          axisLabel: {
            textStyle: {
              color: '#bcbdbf'
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
          splitLine: { show: false },
          min: 0,
          max: 10000,
          axisLine: {
            //                        lineStyle: {
            //                            color: '#bcbdbf'
            //                        }
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
          max: 10,
          position: 'right',
          splitLine: { show: false },
          axisLine: {
            //                        lineStyle: {
            //                            show:true
            //                        }
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
          data: [3500, 3800, 4500, 5000],
          label: {
            normal: {
              show: true,
              //                            rotate:45,
              offset: [5, -20],
              //                            color:'#76EEC6',
              position: 'top',
              formatter: function (param) {
                return param.data + '元';
              }
            }
          },
          itemStyle: {
            normal: {
              //                            color:'#76EEC6'
            }
          }
        },
        {
          name: '同比增速',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 2, 3, 5],
          label: {
            normal: {
              show: true,
              color: '#f9b621',
              position: 'top',
              formatter: function (param) {
                return param.data + '%';
              }
            }
          }
        }
      ]
    };
    // 预测结果-> 固定投资
    const investOptions = {
      title: {
        show: true,
        text: forecastTime + '固定投资',
        textStyle: {
          color: '#bcbdbf'
        },
        left: echartsTitleAlign
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['房地产', '互联网', '工业', '其他'],
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
          max: 1000,
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
          max: 10,
          position: 'right',
          splitLine: { show: false },
          /*axisLine: {
              lineStyle: {
                  color: colors[1]
              }
          },*/
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
          name: '房地产',
          type: 'bar',
          stack: '产业',
          data: [60, 80, 90, 95],
          itemStyle: {
            normal: {
              color: '#76EEC6'
            }
          }
        },
        {
          name: '互联网',
          type: 'bar',
          stack: '产业',
          data: [100, 150, 190, 210],
          itemStyle: {
            normal: {
              color: '#4F94CD'
            }
          }
        },
        {
          name: '工业',
          type: 'bar',
          stack: '产业',
          data: [20, 30, 35, 35],
          itemStyle: {
            normal: {
              color: '#8B6914'
            }
          }
        },
        {
          name: '其他',
          type: 'bar',
          stack: '产业',
          data: [40, 50, 65, 65],
          itemStyle: {
            normal: {
              color: '#B3EE3A'
            }
          }
        },
        {
          name: '房地产',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 3, 3, 4],
          itemStyle: {
            normal: {
              color: '#76EEC6'
            }
          }
        },
        {
          name: '互联网',
          type: 'line',
          yAxisIndex: 1,
          data: [1, 2, 2, 3],
          itemStyle: {
            normal: {
              color: '#4F94CD'
            }
          }
        },
        {
          name: '工业',
          type: 'line',
          yAxisIndex: 1,
          data: [1, 4, 4, 5],
          itemStyle: {
            normal: {
              color: '#8B6914'
            }
          }
        },
        {
          name: '其他',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 3, 2, 3],
          itemStyle: {
            normal: {
              color: '#B3EE3A'
            }
          }
        }
      ]
    };
    // 预测结果-> 支柱产业
    const pillarOptions = {
      title: {
        show: true,
        text: forecastTime + '支柱产业',
        textStyle: {
          color: '#bcbdbf'
        },
        left: echartsTitleAlign
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['集成电路', '软件及外包服务', '光电', '生物医药', '通讯', '精密机械'],
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
          max: 1000,
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
          max: 10,
          position: 'right',
          splitLine: { show: false },
          /*axisLine: {
              lineStyle: {
                  color: colors[1]
              }
          },*/
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
          name: '集成电路',
          type: 'bar',
          stack: '产业',
          data: [60, 80, 90, 95]
        },
        {
          name: '软件及外包服务',
          type: 'bar',
          stack: '产业',
          data: [100, 150, 190, 210]
        },
        {
          name: '光电',
          type: 'bar',
          stack: '产业',
          data: [20, 30, 35, 35]
        },
        {
          name: '生物医药',
          type: 'bar',
          stack: '产业',
          data: [40, 50, 65, 65]
        },
        {
          name: '通讯',
          type: 'bar',
          stack: '产业',
          data: [40, 50, 60, 65]
        },
        {
          name: '精密机械',
          type: 'bar',
          stack: '产业',
          data: [100, 120, 130, 130]
        },
        {
          name: '集成电路',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 3, 2, 4]
        },
        {
          name: '软件及外包服务',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 3, 4, 5]
        },
        {
          name: '光电',
          type: 'line',
          yAxisIndex: 1,
          data: [1, 2, 2, 3]
        },
        {
          name: '生物医药',
          type: 'line',
          yAxisIndex: 1,
          data: [1, 4, 4, 5]
        },
        {
          name: '通讯',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 3, 2, 4]
        },
        {
          name: '精密机械',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 4, 3, 5]
        }
      ]
    };
    // 预测结果-> 公共性支出
    const expendOptions = {
      title: {
        show: true,
        text: forecastTime + '公共性支出',
        textStyle: {
          color: '#bcbdbf'
        },
        left: echartsTitleAlign
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['环保', '公共交通建设', '民生', '社保医疗'],
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
          max: 1000,
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
          max: 10,
          position: 'right',
          splitLine: { show: false },
          /*axisLine: {
              lineStyle: {
                  color: colors[1]
              }
          },*/
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
          name: '环保',
          type: 'bar',
          stack: '产业',
          data: [60, 80, 90, 95]
        },
        {
          name: '公共交通建设',
          type: 'bar',
          stack: '产业',
          data: [100, 150, 190, 210]
        },
        {
          name: '民生',
          type: 'bar',
          stack: '产业',
          data: [20, 30, 35, 35]
        },
        {
          name: '社保医疗',
          type: 'bar',
          stack: '产业',
          data: [40, 50, 65, 65]
        },
        {
          name: '环保',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 3, 3, 4]
        },
        {
          name: '公共交通建设',
          type: 'line',
          yAxisIndex: 1,
          data: [1, 2, 2, 3]
        },
        {
          name: '民生',
          type: 'line',
          yAxisIndex: 1,
          data: [1, 4, 3, 3]
        },
        {
          name: '社保医疗',
          type: 'line',
          yAxisIndex: 1,
          data: [2, 4, 4, 5]
        }
      ]
    };

    this.subject.next({
      gdpOptions: gdpOptions,
      budgetOptions: budgetOptions,
      incomeOptions: incomeOptions,
      investOptions: investOptions,
      pillarOptions: pillarOptions,
      expendOptions: expendOptions,
    });
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }

}
