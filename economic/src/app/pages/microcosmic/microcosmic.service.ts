import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
declare var echarts: any;

@Injectable()
export class MicrocosmicService {
  // 公司名字存起来，在企业详情的几个小菜单里面要用
  private companyNameSubject = new BehaviorSubject<any>(0);
  companyName: any;
  private subject = new BehaviorSubject<any>(0);

  private getDataUrl = '/v1/enterpriseMicroKanbanPojo/getMicInformation';
  // 区别四个区域
  title: string = '高新西区';
  constructor(private http: HttpClient, protected routerInfo: ActivatedRoute) {
    // this.changeData(this.title);
  }

  getMicInformation(): void {
    const params = new HttpParams().set('park', 'A');
    this.http.get<any>(this.getDataUrl, { params: params }).subscribe(
      res => {
        if (res.responseCode === '_200') {
          console.log('getMicInformation success => ', res.data);
          this.modifyData(res.data);
          // this.getArrayOfType(res.data.grossProduct);
        } else {
          console.log('getMicInformation error => ', res.errorMsg);
        }
      },
      err => {
        console.log('getMicInformation error => ', err);
      }
    );
  }

  getObjOfType(data: any[], type: string): any {
    const dataCopy = data;
    const xAxis = [];
    const series = [
      {
        name: `${data[0].park}园区`,
        type: 'line',
        stack: '总量',
        data: []
      }
    ];
    dataCopy.sort((a, b) => {
      const flag = a.year > b.year ? 1 : -1;
      return flag;
    });
    dataCopy.forEach((item, index) => {
      xAxis.push(item.year);
      series[0].data.push(item[type]);
    });
    return {
      xAxis: {
        data: xAxis
      },
      series: series
    };
  }

  modifyData(data: any) {
    const title = `${data.grossProduct[0].park}园区`;
    // 企业年产值
    const outputValueObj = this.getObjOfType(data.outputValue, 'outputValue');
    // 生产总值
    const grossProductObj = this.getObjOfType(
      data.grossProduct,
      'grossProduct'
    );
    // 产业规模
    const enterpriseScaleObj = this.getObjOfType(
      data.enterpriseScale,
      'enterpriseScale'
    );
    // 企业数量
    const enterpriseNumberObj = this.getObjOfType(
      data.enterpriseNumber,
      'enterpriseNumber'
    );
    const outputValue = {
      title: {
        text: '企业年产值',
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'none'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        show: false
        /*feature: {
                saveAsImage: {}
            }*/
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: outputValueObj.xAxis.data,
        axisLabel: {
          color: '#fff',
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: outputValueObj.series
    };

    const grossProduct = {
      title: {
        text: '生产总值',
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'none'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        show: false
        /*feature: {
                saveAsImage: {}
            }*/
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: grossProductObj.xAxis.data,
        axisLabel: {
          color: '#fff',
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: grossProductObj.series
    };

    const enterpriseScale = {
      title: {
        text: '产业规模',
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'none'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        show: false
        /*feature: {
                saveAsImage: {}
            }*/
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: enterpriseScaleObj.xAxis.data,
        axisLabel: {
          color: '#fff',
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: enterpriseScaleObj.series
    };

    const enterpriseNumber = {
      title: {
        text: '企业数量',
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'none'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        show: false
        /*feature: {
                saveAsImage: {}
            }*/
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: enterpriseNumberObj.xAxis.data,
        axisLabel: {
          color: '#fff',
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: enterpriseNumberObj.series
    };

    const SixMajorIndustries = {
      //                    backgroundColor : '#000',
      title: {
        show: false,
        text: '六大集群行业体系',
        top: 'top',
        left: 'center'
      },
      tooltip: {
        formatter: function() {
          return;
        }
      },
      legend: [
        {
          show: false,
          formatter: function(name) {
            return echarts.format.truncateText(
              name,
              40,
              '14px Microsoft Yahei',
              '…'
            );
          },
          tooltip: {
            show: true
          },
          selectedMode: 'false',
          bottom: 20,
          data: [
            '集成电路',
            '软件及服务外包',
            '光电',
            '生物医药',
            '通信',
            '精密机械'
          ]
        }
      ],
      toolbox: {
        show: false,
        bottom: 15,
        right: 5,
        feature: {
          dataView: {
            show: true,
            readOnly: false
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      animationDuration: 3000,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          name: title,
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: 500
          },
          focusNodeAdjacency: true,
          /*layout:'circular',
        circular:{
            rotateLabel:false
        },*/
          roam: true,
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 10,
                fibtWeight: 'normal', // 'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的
                color: '#fff' // '#cde6c7'
              },
              position: 'inside'
            }
          },
          lineStyle: {
            normal: {
              color: 'source',
              width: '2',
              // 曲线程度
              curveness: 0.5,
              type: 'solid'
            }
          },
          // 边缘标签
          edgeLable: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 10
              },
              formatter: '{c}'
            }
          },
          data: [
            {
              name: title,
              // symbol: '/economic/images/menu_bg_3.png',
              symbolSize: 60,
              // 节点是否可拖拽
              draggable: true,
              category: 0
            },
            {
              name: '集成电路',
              symbolSize: 40,
              category: '集成电路',
              draggable: 'true'
            },
            {
              name: '软件及服务外包',
              symbolSize: 40,
              category: '软件及服务外包',
              draggable: 'true'
            },
            {
              name: '光电',
              symbolSize: 40,
              category: '光电',
              draggable: 'true'
            },
            {
              name: '生物医药',
              symbolSize: 40,
              category: '生物医药',
              draggable: 'true'
            },
            {
              name: '通信',
              symbolSize: 40,
              category: '通信',
              draggable: 'true'
            },
            {
              name: '精密机械',
              symbolSize: 40,
              category: '精密机械',
              draggable: 'true'
            }
          ],
          links: [
            {
              source: title,
              target: '集成电路',
              value: '产业集群'
            },
            {
              source: title,
              target: '软件及服务外包',
              value: '产业集群'
            },
            {
              source: title,
              target: '生物医药',
              value: '产业集群'
            },
            {
              source: title,
              target: '光电',
              value: '产业集群'
            },
            {
              source: title,
              target: '通信',
              value: '产业集群'
            },
            {
              source: title,
              target: '精密机械',
              value: '产业集群'
            },
            {
              source: '通信',
              target: '成都中联信通科技股份有限公司'
            },
            {
              source: '精密机械',
              target: '成都凯泉铁路配件有限责任公司'
            },
            {
              source: '光电',
              target: '成都锦江电子系统工程有限公司'
            },
            {
              source: '集成电路',
              target: '成都芯通科技股份有限公司'
            },
            {
              source: '软件及服务外包',
              target: '成都芯通软件有限公司'
            }
          ],
          categories: [
            {
              name: '六大产业集群'
            },
            {
              name: '集成电路'
            },
            {
              name: '软件及服务外包'
            },
            {
              name: '光电'
            },
            {
              name: '生物医药'
            },
            {
              name: '通信'
            },
            {
              name: '精密机械'
            }
          ]
        }
      ]
    };

    this.subject.next({
      outputValue: outputValue,
      grossProduct: grossProduct,
      enterpriseScale: enterpriseScale,
      enterpriseNumber: enterpriseNumber,
      SixMajorIndustries: SixMajorIndustries
    });
  }

  changeData(title: string) {
    let annualOutputValue;
    let numberOfEnterprises;
    let enterpriseSize;
    let totalOutputValue;
    let SixMajorIndustries;
    if ('高新西区' === title) {
      SixMajorIndustries = {
        //                    backgroundColor : '#000',
        title: {
          show: false,
          text: '六大集群行业体系',
          top: 'top',
          left: 'center'
        },
        tooltip: {
          formatter: function() {
            return;
          }
        },
        legend: [
          {
            show: false,
            formatter: function(name) {
              return echarts.format.truncateText(
                name,
                40,
                '14px Microsoft Yahei',
                '…'
              );
            },
            tooltip: {
              show: true
            },
            selectedMode: 'false',
            bottom: 20,
            data: [
              '集成电路',
              '软件及服务外包',
              '光电',
              '生物医药',
              '通信',
              '精密机械'
            ]
          }
        ],
        toolbox: {
          show: false,
          bottom: 15,
          right: 5,
          feature: {
            dataView: {
              show: true,
              readOnly: false
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        animationDuration: 3000,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: title,
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 500
            },
            focusNodeAdjacency: true,
            /*layout:'circular',
          circular:{
              rotateLabel:false
          },*/
            roam: true,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 10,
                  fibtWeight: 'normal', // 'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的
                  color: '#fff' // '#cde6c7'
                },
                position: 'inside'
              }
            },
            lineStyle: {
              normal: {
                color: 'source',
                width: '2',
                // 曲线程度
                curveness: 0.5,
                type: 'solid'
              }
            },
            // 边缘标签
            edgeLable: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 10
                },
                formatter: '{c}'
              }
            },
            data: [
              {
                name: title,
                // symbol: '/economic/images/menu_bg_3.png',
                symbolSize: 60,
                // 节点是否可拖拽
                draggable: true,
                category: 0
              },
              {
                name: '集成电路',
                symbolSize: 40,
                category: '集成电路',
                draggable: 'true'
              },
              {
                name: '软件及服务外包',
                symbolSize: 40,
                category: '软件及服务外包',
                draggable: 'true'
              },
              {
                name: '光电',
                symbolSize: 40,
                category: '光电',
                draggable: 'true'
              },
              {
                name: '生物医药',
                symbolSize: 40,
                category: '生物医药',
                draggable: 'true'
              },
              {
                name: '通信',
                symbolSize: 40,
                category: '通信',
                draggable: 'true'
              },
              {
                name: '精密机械',
                symbolSize: 40,
                category: '精密机械',
                draggable: 'true'
              }
            ],
            links: [
              {
                source: title,
                target: '集成电路',
                value: '产业集群'
              },
              {
                source: title,
                target: '软件及服务外包',
                value: '产业集群'
              },
              {
                source: title,
                target: '生物医药',
                value: '产业集群'
              },
              {
                source: title,
                target: '光电',
                value: '产业集群'
              },
              {
                source: title,
                target: '通信',
                value: '产业集群'
              },
              {
                source: title,
                target: '精密机械',
                value: '产业集群'
              },
              {
                source: '通信',
                target: '成都中联信通科技股份有限公司'
              },
              {
                source: '精密机械',
                target: '成都凯泉铁路配件有限责任公司'
              },
              {
                source: '光电',
                target: '成都锦江电子系统工程有限公司'
              },
              {
                source: '集成电路',
                target: '成都芯通科技股份有限公司'
              },
              {
                source: '软件及服务外包',
                target: '成都芯通软件有限公司'
              }
            ],
            categories: [
              {
                name: '六大产业集群'
              },
              {
                name: '集成电路'
              },
              {
                name: '软件及服务外包'
              },
              {
                name: '光电'
              },
              {
                name: '生物医药'
              },
              {
                name: '通信'
              },
              {
                name: '精密机械'
              }
            ]
          }
        ]
      };

      annualOutputValue = {
        title: {
          text: '企业年产值',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'none'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
          /*feature: {
              saveAsImage: {}
          }*/
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff',
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: '高新西区AAA公司',
            type: 'line',
            stack: '总量',
            data: [34, 54, 80, 134, 90, 210, 190]
          }
        ]
      };

      numberOfEnterprises = {
        title: {
          text: '企业数量',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'none'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: title,
            type: 'line',
            stack: '总量',
            data: [700, 500, 800, 934, 1290, 1500, 1120]
          }
        ]
      };

      enterpriseSize = {
        title: {
          text: '产业规模',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'none'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: title,
            type: 'line',
            stack: '总量',
            data: [80, 150, 210, 335, 270, 199, 320]
          }
        ]
      };

      totalOutputValue = {
        title: {
          text: '生产总值',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: title,
            type: 'line',
            stack: '总量',
            data: [290, 330, 310, 220, 182, 191, 234]
          }
        ]
      };
    } else if ('高新南区' === title) {
      SixMajorIndustries = {
        //                    backgroundColor : '#000',
        title: {
          show: false,
          text: '六大集群行业体系',
          top: 'top',
          left: 'center'
        },
        tooltip: {
          formatter: function() {
            return;
          }
        },
        legend: [
          {
            show: false,
            formatter: function(name) {
              return echarts.format.truncateText(
                name,
                40,
                '14px Microsoft Yahei',
                '…'
              );
            },
            tooltip: {
              show: true
            },
            selectedMode: 'false',
            bottom: 20,
            data: [
              '集成电路',
              '软件及服务外包',
              '光电',
              '生物医药',
              '通信',
              '精密机械'
            ]
          }
        ],
        toolbox: {
          show: false,
          bottom: 15,
          right: 5,
          feature: {
            dataView: {
              show: true,
              readOnly: false
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        animationDuration: 3000,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: title,
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 500
            },
            focusNodeAdjacency: true,
            /*layout:'circular',
          circular:{
              rotateLabel:false
          },*/
            roam: true,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 10,
                  fibtWeight: 'normal', // 'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的
                  color: '#fff' // '#cde6c7'
                },
                position: 'inside'
              }
            },
            lineStyle: {
              normal: {
                color: 'source',
                width: '2',
                // 曲线程度
                curveness: 0.5,
                type: 'solid'
              }
            },
            // 边缘标签
            edgeLable: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 10
                },
                formatter: '{c}'
              }
            },

            data: [
              {
                name: title,
                // symbol: '/economic/images/menu_bg_3.png',
                symbolSize: 60,
                // 节点是否可拖拽
                draggable: true,
                category: 0
              },
              {
                name: '集成电路',
                symbolSize: 40,
                category: '集成电路',
                draggable: 'true'
              },
              {
                name: '软件及服务外包',
                symbolSize: 40,
                category: '软件及服务外包',
                draggable: 'true'
              },
              {
                name: '光电',
                symbolSize: 40,
                category: '光电',
                draggable: 'true'
              },
              {
                name: '生物医药',
                symbolSize: 40,
                category: '生物医药',
                draggable: 'true'
              },
              {
                name: '通信',
                symbolSize: 40,
                category: '通信',
                draggable: 'true'
              },
              {
                name: '精密机械',
                symbolSize: 40,
                category: '精密机械',
                draggable: 'true'
              }
            ],
            links: [
              {
                source: title,
                target: '集成电路',
                value: '产业集群'
              },
              {
                source: title,
                target: '软件及服务外包',
                value: '产业集群'
              },
              {
                source: title,
                target: '光电',
                value: '产业集群'
              },
              {
                source: title,
                target: '生物医药',
                value: '产业集群'
              },
              {
                source: title,
                target: '通信',
                value: '产业集群'
              },
              {
                source: title,
                target: '精密机械',
                value: '产业集群'
              },
              {
                source: '集成电路',
                target: '成都方舟微电子有限公司'
              },
              {
                source: '通信',
                target: '四川浩特通信有限公司'
              },
              {
                source: '通信',
                target: '成都天翼空间科技有限公司'
              },
              {
                source: '精密机械',
                target: '成都五牛科技有限公司'
              },
              {
                source: '精密机械',
                target: '成都三里汽车技术有限公司'
              },
              {
                source: '软件及服务外包',
                target: '成都金本华电子有限公司'
              },
              {
                source: '光电',
                target: '成都新锐鑫光通信技术有限公司'
              },
              {
                source: '光电',
                target: '成都新易盛通信技术股份有限公司'
              },
              {
                source: '光电',
                target: '成都维信电子科大新技术有限公司'
              },
              {
                source: '生物医药',
                target: '四川华德生物工程有限公司'
              },
              {
                source: '集成电路',
                target: '富泰华精密电子（成都）有限公司'
              },
              {
                source: '集成电路',
                target: '成都畅达通检测技术股份有限公司'
              }
            ],
            categories: [
              {
                name: '六大产业集群'
              },
              {
                name: '集成电路'
              },
              {
                name: '软件及服务外包'
              },
              {
                name: '光电'
              },
              {
                name: '生物医药'
              },
              {
                name: '通信'
              },
              {
                name: '精密机械'
              }
            ]
          }
        ]
      };

      annualOutputValue = {
        title: {
          text: '企业年产值',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'none'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff',
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: '高新南区BBB公司',
            type: 'line',
            stack: '总量',
            data: [34, 210, 190, 54, 80, 134, 90]
          }
        ]
      };

      numberOfEnterprises = {
        title: {
          text: '企业数量',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'none'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
          /*feature: {
              saveAsImage: {}
          }*/
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: title,
            type: 'line',
            stack: '总量',
            data: [700, 1500, 1120, 500, 800, 934, 1290]
          }
        ]
      };

      enterpriseSize = {
        title: {
          text: '产业规模',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'none'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: title,
            type: 'line',
            stack: '总量',
            data: [80, 199, 320, 150, 210, 335, 270]
          }
        ]
      };

      totalOutputValue = {
        title: {
          text: '生产总值',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: title,
            type: 'line',
            stack: '总量',
            data: [290, 330, 182, 191, 310, 220, 234]
          }
        ]
      };
    } else if ('高新东区' === title) {
      SixMajorIndustries = {
        //                    backgroundColor : '#000',
        title: {
          show: false,
          text: '六大集群行业体系',
          top: 'top',
          left: 'center'
        },
        tooltip: {
          formatter: function() {
            return;
          }
        },
        legend: [
          {
            show: false,
            formatter: function(name) {
              return echarts.format.truncateText(
                name,
                40,
                '14px Microsoft Yahei',
                '…'
              );
            },
            tooltip: {
              show: true
            },
            selectedMode: 'false',
            bottom: 20,
            data: [
              '集成电路',
              '软件及服务外包',
              '光电',
              '生物医药',
              '通信',
              '精密机械'
            ]
          }
        ],
        toolbox: {
          show: false,
          bottom: 15,
          right: 5,
          feature: {
            dataView: {
              show: true,
              readOnly: false
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        animationDuration: 3000,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: title,
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 500
            },
            focusNodeAdjacency: true,
            /*layout:'circular',
          circular:{
          rotateLabel:false
          },*/
            roam: true,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 10,
                  fibtWeight: 'normal', // 'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的
                  color: '#fff' // '#cde6c7'
                },
                position: 'inside'
              }
            },
            lineStyle: {
              normal: {
                color: 'source',
                width: '2',
                // 曲线程度
                curveness: 0.5,
                type: 'solid'
              }
            },
            // 边缘标签
            edgeLable: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 10
                },
                formatter: '{c}'
              }
            },

            data: [
              {
                name: title,
                // symbol: '/economic/images/menu_bg_3.png',
                symbolSize: 60,
                // 节点是否可拖拽
                draggable: true,
                category: 0
              },
              {
                name: '集成电路',
                symbolSize: 40,
                category: '集成电路',
                draggable: 'true'
              },
              {
                name: '软件及服务外包',
                symbolSize: 40,
                category: '软件及服务外包',
                draggable: 'true'
              },
              {
                name: '光电',
                symbolSize: 40,
                category: '光电',
                draggable: 'true'
              },
              {
                name: '生物医药',
                symbolSize: 40,
                category: '生物医药',
                draggable: 'true'
              },
              {
                name: '通信',
                symbolSize: 40,
                category: '通信',
                draggable: 'true'
              },
              {
                name: '精密机械',
                symbolSize: 40,
                category: '精密机械',
                draggable: 'true'
              }
            ],
            links: [
              {
                source: title,
                target: '集成电路',
                value: '产业集群'
              },
              {
                source: '集成电路',
                target: '成都畅达通检测技术股份有限公司'
              },
              {
                source: '集成电路',
                target: '成都飞鱼星科技股份有限公司'
              },
              {
                source: title,
                target: '软件及服务外包',
                value: '产业集群'
              },
              {
                source: '软件及服务外包',
                target: '成都芯通软件有限公司'
              },
              {
                source: title,
                target: '光电',
                value: '产业集群'
              },
              {
                source: '光电',
                target: '成都锦江电子系统工程有限公司'
              },
              {
                source: '光电',
                target: '成都新易盛通信技术股份有限公司'
              },
              {
                source: '光电',
                target: '成都维信电子科大新技术有限公司'
              },
              {
                source: '光电',
                target: '成都摩尔环宇测试技术有限公司'
              },
              {
                source: title,
                target: '生物医药',
                value: '产业集群'
              },
              {
                source: '生物医药',
                target: '四川华德生物工程有限公司'
              },
              {
                source: title,
                target: '通信',
                value: '产业集群'
              },
              {
                source: '通信',
                target: '成都中联信通科技股份有限公司'
              },
              {
                source: '通信',
                target: '四川浩特通信有限公司'
              },
              {
                source: title,
                target: '精密机械',
                value: '产业集群'
              },
              {
                source: '精密机械',
                target: '成都五牛科技有限公司'
              },
              {
                source: '精密机械',
                target: '四川蜀杰通用电气有限公司'
              }
            ],
            categories: [
              {
                name: '六大产业集群'
              },
              {
                name: '集成电路'
              },
              {
                name: '软件及服务外包'
              },
              {
                name: '光电'
              },
              {
                name: '生物医药'
              },
              {
                name: '通信'
              },
              {
                name: '精密机械'
              }
            ]
          }
        ]
      };

      annualOutputValue = {
        title: {
          text: '企业年产值',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'none'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff',
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: '高新东区CCC公司',
            type: 'line',
            stack: '总量',
            data: [134, 90, 210, 190, 34, 54, 80]
          }
        ]
      };

      numberOfEnterprises = {
        title: {
          text: '企业数量',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'none'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
          /*feature: {
              saveAsImage: {}
          }*/
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: title,
            type: 'line',
            stack: '总量',
            data: [500, 800, 934, 700, 1290, 1500, 1120]
          }
        ]
      };

      enterpriseSize = {
        title: {
          text: '产业规模',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'none'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: title,
            type: 'line',
            stack: '总量',
            data: [80, 150, 210, 320, 335, 270, 199]
          }
        ]
      };

      totalOutputValue = {
        title: {
          text: '生产总值',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: title,
            type: 'line',
            stack: '总量',
            data: [182, 191, 234, 290, 330, 310, 220]
          }
        ]
      };
    }

    this.subject.next({
      annualOutputValue: annualOutputValue,
      numberOfEnterprises: numberOfEnterprises,
      enterpriseSize: enterpriseSize,
      totalOutputValue: totalOutputValue,
      SixMajorIndustries: SixMajorIndustries
    });
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }

  setCompanyName(companyName: string) {
    this.setStringCompanyName(companyName);
    this.companyNameSubject.next({
      companyName: companyName
    });
  }

  getCompanyName(): Observable<any> {
    return this.companyNameSubject.asObservable();
  }

  setStringCompanyName(companyName: string) {
    this.companyName = companyName;
  }
  getStringCompanyName() {
    return this.companyName;
  }
  getUrlParams(option) {
    return this.routerInfo.snapshot.queryParams[option];
  }
}
