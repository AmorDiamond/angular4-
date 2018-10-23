import { Component, OnInit } from '@angular/core';
import { IndustryBoardService } from '../industry-board.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-type-overview',
  templateUrl: './type-overview.component.html',
  styleUrls: ['./type-overview.component.css']
})
export class TypeOverviewComponent implements OnInit {

  constructor(
    private industryBoardService: IndustryBoardService,
    private routerInfo: ActivatedRoute,
    private toastModalService: ToastModalService
  ) { }
  typeId = '';
  typeName = '';
  overviewData: any;
  TechnologicalInnovationEchartData: any;
  TechnologicalInnovationData: any;
  workPeopleEchartData: any;
  PeopleConstituteEchartData: any;
  PeopleConstituteJobEchartData: any;
  EconomicData: any;
  leftMoney = 0;
  rightMoney = 0;
  ngOnInit() {
    this.typeId = this.routerInfo.snapshot.queryParams['id'];
    this.getCompanyOverviewOfType();
    this.getTechnologicalInnovation();
    this.getWorkPeopleData();
    this.getPeopleConstituteData();
    this.getEconomicOverviewData();
  }
  /*获取企业概况数据*/
  getCompanyOverviewOfType() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'companyOverviewUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        const data = res.data[0];
        this.overviewData = {
          total: data[0] ? data[0] : 0,
          money: data[1] ? data[1] : 0,
          scaleUp: data[2] ? data[2] : 0,
          hightCompany: data[3] ? data[3] : 0,
          moveCompany: data[4] ? data[4] : 0
        };
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取科技创新*/
  getTechnologicalInnovation() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'technologicalInnovationUrl').subscribe(res => {
      console.log('科技创新', res)
      if (res.responseCode === '_200') {
        const data = res.data[0];
        this.TechnologicalInnovationData = {
          paper: data[5] ? data[5] : 0,
          funding: data[4] ? data[4] : 0,
          people: data[3] ? data[3] : 0,
          mechanism: data[2] ? data[2] : 0,
          patent: data[1] ? data[1] : 0,
          trademark: data[0] ? data[0] : 0,
          RD: data[6] ? data[6] : 0
        };
        this.creatTechnologicalInnovationEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取从业人数*/
  getWorkPeopleData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'workPeopleUrl').subscribe(res => {
      console.log('从业', res)
      if (res.responseCode === '_200') {
        const data = res.data[0];
        this.creatWorkPeopleEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取人员构成*/
  getPeopleConstituteData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'peopleConstituteUrl').subscribe(res => {
      console.log('构成', res)
      if (res.responseCode === '_200') {
        const data = res.data[0];
        this.creatPeopleConstituteOfEducationEchart(data);
        this.creatPeopleConstituteOfJobEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*获取经济现状*/
  getEconomicOverviewData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'economicOverviewUrl').subscribe(res => {
      console.log('经济', res);
      if (res.responseCode === '_200') {
        const data = res.data[0];
        this.EconomicData = {
          governmental: data[0] ?  data[0] : 0,
          payTaxes: data[1] ?  data[1] : 0,
          operatingIncome: data[2] ?  data[2] : 0,
          mainIncome: data[3] ?  data[3] : 0,
          industrialOutput: data[4] ?  data[4] : 0,
          operatingProfit: data[5] ?  data[5] : 0,
          totalAssets: data[6] ?  data[6] : 0,
          totalLiabilities: data[7] ?  data[7] : 0
        };
        this.leftMoney = this.EconomicData.governmental;
        this.rightMoney = this.EconomicData.payTaxes;
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*绘制科技创新圆环图*/
  creatTechnologicalInnovationEchart(options) {
    const seriesData = [
      {name: '测试', symbolSize: 60, value: options[0] ? options[0] : 0 , x: 55, y: 45, itemStyle: {normal: {color: 'green'}}},
      {name: '测试2', symbolSize: 35, value: options[1] ? options[1] : 0 , itemStyle: {normal: {color: 'red'}}},
      {name: '测试3', symbolSize: 30, value: options[2] ? options[2] : 0 , itemStyle: {normal: {color: 'blue'}}},
      {name: '测试4', symbolSize: 25, value: options[3] ? options[3] : 0 , x: 55, y: 60, itemStyle: {normal: {color: 'yellow'}}},
      {name: '测试5', symbolSize: 20, value: options[3] ? options[3] : 0 , itemStyle: {normal: {color: 'yellow'}}},
      {name: '测试6', symbolSize: 15, value: options[3] ? options[3] : 0 , itemStyle: {normal: {color: 'yellow'}}},
      {name: '测试7', symbolSize: 12, value: options[3] ? options[3] : 0, itemStyle: {normal: {color: 'yellow'}}}
    ];
    const links = [
      {source: '测试2', target: '测试'},
      {source: '测试3', target: '测试2'},
      {source: '测试4', target: '测试3'},
      {source: '测试5', target: '测试4'},
      {source: '测试6', target: '测试5'},
      {source: '测试7', target: '测试6'},
      {source: '测试', target: '测试7'},
    ];
    const option = {
      title: {
        text: '科技创新',
        top: 30,
        left: 'center'
      },
      tooltip: {confine: true},
      grid: {
        top: '50%',
        containLabel: true
      },
      series : [
        {
          name: '科技创新',
          type: 'graph',
          layout: 'circular',
          circular: {
            rotateLabel: true
          },
          data: seriesData,
          links: links,
          roam: false,
          label: {
            normal: {
              position: 'right',
              formatter: '{b}'
            }
          },
          lineStyle: {
            normal: {
              color: 'source',
              curveness: -0.05
            }
          },
          force: {
            gravity: 0
          }
        }
      ]
    };
    this.TechnologicalInnovationEchartData = option;
  }
  /*绘制从业人员图表*/
  creatWorkPeopleEchart(options) {
    const spirit = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAYCAYAAAARfGZ1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0YzQUQ3RUY0RjlEMTFFODlGRTRBN0FENkM0ODU1MDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0YzQUQ3RjA0RjlEMTFFODlGRTRBN0FENkM0ODU1MDUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDRjNBRDdFRDRGOUQxMUU4OUZFNEE3QUQ2QzQ4NTUwNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDRjNBRDdFRTRGOUQxMUU4OUZFNEE3QUQ2QzQ4NTUwNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlJLRSEAAAGgSURBVHjaYvTfPoWBCBAHxBFArA3Ed4F4NRBPB0ls8MjGqYnl/39GfIZyAfEOILZFEpMDYkcgBpnqBsTPcGlm+vePiQEP3g/EtjjktIH4mO/WGYzkGB4MxGYELJcH4kJyDK8hYDAMl+M0/C9QARasA8QGOOTQsZjb+nlmWCMUZDsW4MBAGnAH4lMYhv/9i9VwQRINV8Tq8r9/mbGJfyfR8BfYDf+H1XBQ2u4mwfBVOFyONViuAPExILYiwuAbJ+LCLpASLCBQD8S7iTC8GGf2x2P4HpCrgFgDj8HXzqUEbCPHcBCIAeIzOOT+A3EYPs2EDD8LxJuB2BeL3BogvkrAcCZCYcqKQ/wbIY1MoKSIA4cA8U4g9sAhHwvEc9Um7jbGZTijUu9eZD47EOcAcSYQK5OQzkHJdikQL7hb5AT3EaN8136YoaDCPw+I5RnIB6CKYw4IPyh1eMwo23FQFsg5BMQKDNQDP4HYCZj9mSZS2WBYSCwAFbkmDLQBqiDD7wMZsjQw/A3I8FQgYxYQa4LSPRD/o8BARmjOfQTERQABBgCE7wlkIUrLBQAAAABJRU5ErkJggg==';
    const seriesData = [options[0] ? options[0] : 0, options[1] ? options[1] : 0, options[2] ? options[2] : 0, options[3] ? options[3] : 0];
    const option = {
      title: {
        show: false,
        text: '从业人数',
        left: 'center',
        textStyle: {
          color: '#86878b'
        }
      },
      tooltip: {},
      xAxis: {
        // max: maxData,
        // name: '人',
        axisTick: {show: false},
        splitLine: {show: false},
        splitNumber: 4,
        offset: 10,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#86878b'
          }
        },
        axisLabel: {
          show: false,
          margin: 10,
        }
      },
      yAxis: {
        // name: '年',
        data: ['期末人数', '年平均人数', '当年新增从业人员', '吸纳高校毕业生'],
        axisTick: {show: false},
        axisLine: {
          show: false,
          lineStyle: {
            color: '#86878b'
          }
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            color: '#86878b',
            fontSize: 16
          }
        }
      },
      grid: {
        top: 0,
        // height: 100,
        left: 140,
        right: 70,
        // containLabel: true
      },
      series: [{
        // current data
        type: 'pictorialBar',
        symbol: spirit,
        symbolRepeat: 'fixed',
        symbolMargin: '5%',
        symbolClip: true,
        symbolSize: 22,
        // symbolBoundingData: maxData,
        data: seriesData,
        z: 10
      }, {
        // full data
        type: 'pictorialBar',
        itemStyle: {
          normal: {
            opacity: 0.2
          }
        },
        label: {
          normal: {
            show: true,
            formatter: function (params) {
                return params.value + '人';
            },
            position: 'right',
            // offset: [-35, 0],
            textStyle: {
              color: '#57ba8c',
              fontSize: 16
            }
          }
        },
        animationDuration: 0,
        symbolRepeat: 'fixed',
        symbolMargin: '5%',
        symbol: spirit,
        symbolSize: 22,
        // symbolBoundingData: maxData,
        data: seriesData,
        z: 5
      }]
    };
    this.workPeopleEchartData = option;
  }
  /*绘制从业人员构成--学历*/
  creatPeopleConstituteOfEducationEchart(options) {
    const seriesData = [
      {value: options[0] ? options[0] : 0, name: '研究生'},
      {value: options[1] ? options[1] : 0, name: '本科及以上'},
      {value: options[2] ? options[2] : 0, name: '大专'}
    ];
    const option = {
      color: ['#f8b71f', '#497ad6', '#57ba8a'],
      title: {
        text: '学历学位',
        top: '45%',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      grid: {
        top: 0,
        containLabel: true
      },
      series: [
        {
          name: '学历学位',
          type: 'pie',
          radius: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              formatter: '{a|{b}:}\n{b|{c}}{c|人}',
              rich: {
                a: {
                  color: '#999',
                },
                b: {
                  fontSize: 18,
                },
                c: {
                  color: '#999'
                }
              }
              // position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false,
              length: 10,
              length2: 0,
            }
          },
          data: seriesData
        }
      ]
    };
    this.PeopleConstituteEchartData = option;
  }
  /*绘制从业人员构成--岗位类型*/
  creatPeopleConstituteOfJobEchart(options) {
    const seriesData = [
      {value: options[3] ? options[3] : 0, name: '中层及以上管理人员'},
      {value: options[4] ? options[4] : 0, name: '专业技术人员'},
      {value: options[5] ? options[5] : 0, name: '技术工人'}
    ];
    const option = {
      color: ['#6657b9', '#d88a4a', '#f8b71f'],
      title: {
        text: '岗位类型',
        top: '30%',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      grid: {
        top: 0,
        containLabel: true
      },
      series: [
        {
          name: '岗位类型',
          type: 'pie',
          center: ['50%', '35%'],
          radius: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              formatter: '{a|{b}:}\n{b|{c}}{c|人}',
              rich: {
                a: {
                  color: '#999',
                },
                b: {
                  fontSize: 18,
                },
                c: {
                  color: '#999'
                }
              }
              // position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false,
              length: 10,
              length2: 0,
            }
          },
          data: seriesData
        }
      ]
    };
    this.PeopleConstituteJobEchartData = option;
  }

}
