import { Component, OnInit } from '@angular/core';
import { ADD_INDUSTRY_MAP_POLYGON } from '../../../../core/amap-ngrx/amap.actions';
import { Store } from '@ngrx/store';
import { Amap } from '../../../../core/amap-ngrx/amap.model';

@Component({
  selector: 'app-economic-scale',
  templateUrl: './economic-scale.component.html',
  styleUrls: ['./economic-scale.component.css']
})
export class EconomicScaleComponent implements OnInit {

  constructor(private storeAmap: Store<Amap>) { }
  jiduOutputValueEchart: any;
  hangyeOutputValueEchart: any;
  importExportValueEchart: any;
  payTaxesValueEchart: any;
  renjunShouruValueEchart: any;
  gonggongYusuanValueEchart: any;
  ngOnInit() {
    this.storeAmap.dispatch({
      type: ADD_INDUSTRY_MAP_POLYGON,
      payload: {
        action: 'ADD_INDUSTRY_MAP_POLYGON',
        data: {
          type: 'parkIndustry'
        }
      }
    });
    this.creatJiduOutputValueEchart();
    this.creatHangyeOutputValueEchart();
    this.creatImportExportValueEchart();
    this.creatPayTaxesValueEchart();
    this.creatRenjunShouruValueEchart();
    this.creatGonggongYusuanValueEchart();
  }
  creatJiduOutputValueEchart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const GDP = {
      0: [20, 50, 90, 160, 180, 200],
      1: [42.3, 50, 160, 176.2, 177.5, 200],
      2: [60, 143.50, 186.2, 180, 290, 320],
      3: [80, 165.8, 180, 280, 300, 412.2]
    };
    const option_jdzcz = {
      //设置图表与容器的间隔
      grid: {
        left: '8%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      title: {
        show: false,
        text: '各个季度的总产值',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
//            backgroundColor: '#000',
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter: '{b} 年<br/>{a}: {c} 亿元'
        + '<br/>{a1}: {c1} 亿元'
        + '<br/>{a2}: {c2} 亿元'
        + '<br/>{a3}: {c3} 亿元'
      },
      toolbox: {
        show: false,
//                    bottom: 15,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true},
          dataZoom: {show: true}
        },
      },
      legend: {
        data: ['第一季度', '第二季度', '第三季度', '第四季度'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: ['red', 'blue', 'yellow', 'white'],
      xAxis: [{
        type: 'category',
        data: year,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        axisTick: {length: 6},
      }],
      yAxis: [{
        type: 'value',
        name: '经济总产值（亿元）',
        min: 0,
//                    max: 500,
//                    interval: 50,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: '第一季度',
        type: 'line',
        data: GDP[0]
      }, {
        name: '第二季度',
        type: 'line',
        data: GDP[1]
      }, {
        name: '第三季度',
        type: 'line',
        data: GDP[2]
      }, {
        name: '第四季度',
        type: 'line',
        data: GDP[3]
      }]
    };
    this.jiduOutputValueEchart = option_jdzcz;
  }
  creatHangyeOutputValueEchart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const GDP = {
      0: [20, 40, 50, 25, 80, 100],
      1: [36, 40, 34, 62, 75, 100],
      2: [30, 35, 62, 80, 90, 120],
      3: [40, 58, 80, 80, 100, 122],
      4: [56, 44, 67, 86, 98, 145],
      5: [60, 63, 78, 95, 156, 186]
    };
    const option_hyzcz = {
      //设置图表与容器的间隔
      grid: {
        left: '8%',
        right: '4%',
        bottom: '3%',
        top: '80px',
        containLabel: true
      },
      title: {
        show: false,
        text: '各个季度的总产值',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
//            backgroundColor: '#000',
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter: '{b} 年<br/>{a}: {c} 亿元'
        + '<br/>{a1}: {c1} 亿元'
        + '<br/>{a2}: {c2} 亿元'
        + '<br/>{a3}: {c3} 亿元'
      },
      toolbox: {
        show: false,
//                    bottom: 15,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true},
          dataZoom: {show: true}
        },
      },
      legend: {
        data: ['集成电路', '软件及服务外包', '光电', '生物医药', '通信', '精密机械'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: ['red', 'blue', 'yellow', 'white', 'green', 'pink'],
      xAxis: [{
        type: 'category',
        data: year,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        axisTick: {length: 6},
      }],
      yAxis: [{
        type: 'value',
        name: '经济总产值（亿元）',
        min: 0,
//                    max: 500,
//                    interval: 50,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: '集成电路',
        type: 'line',
        data: GDP[0]
      }, {
        name: '软件及服务外包',
        type: 'line',
        data: GDP[1]
      }, {
        name: '光电',
        type: 'line',
        data: GDP[2]
      }, {
        name: '生物医药',
        type: 'line',
        data: GDP[3]
      }, {
        name: '通信',
        type: 'line',
        data: GDP[4]
      }, {
        name: '精密机械',
        type: 'line',
        data: GDP[5]
      }]
    };
    this.hangyeOutputValueEchart = option_hyzcz;
  }
  creatImportExportValueEchart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const inout = [60, 63, 78, 95, 156, 186];
    const option_jckze = {
      //设置图表与容器的间隔
      grid: {
        left: '8%',
        right: '4%',
        bottom: '3%',
        top: '80px',
        containLabel: true
      },
      title: {
        show: false,
        text: '各个季度的总产值',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
//            backgroundColor: '#000',
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter: '{b} 年<br/>{a}: {c} 亿元'
//                    + '<br/>{a1}: {c1} 亿元'
//                    + '<br/>{a2}: {c2} 亿元'
//                    + '<br/>{a3}: {c3} 亿元'
      },
      toolbox: {
        show: false,
//                    bottom: 15,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true},
          dataZoom: {show: true}
        },
      },
      legend: {
        data: ['进出口总额'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: ['yellow', 'white', 'green', 'pink'],
      xAxis: [{
        type: 'category',
        data: year,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        axisTick: {length: 6},
      }],
      yAxis: [{
        type: 'value',
        name: '总额（亿元）',
        min: 0,
//                    max: 500,
//                    interval: 50,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: '进出口总额',
        type: 'line',
        data: inout
      }]
    };
    this.importExportValueEchart = option_jckze;
  }
  creatPayTaxesValueEchart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const inout = [20, 40, 50, 25, 80, 100];
    const option_nsze = {
      //设置图表与容器的间隔
      grid: {
        left: '8%',
        right: '4%',
        bottom: '3%',
        top: '80px',
        containLabel: true
      },
      title: {
        show: false,
        text: '纳税总额',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
//            backgroundColor: '#000',
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter: '{b} 年<br/>{a}: {c} 亿元'
//                    + '<br/>{a1}: {c1} 亿元'
//                    + '<br/>{a2}: {c2} 亿元'
//                    + '<br/>{a3}: {c3} 亿元'
      },
      toolbox: {
        show: false,
//                    bottom: 15,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true},
          dataZoom: {show: true}
        },
      },
      legend: {
        data: ['纳税总额'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: ['yellow', 'white', 'green', 'pink'],
      xAxis: [{
        type: 'category',
        data: year,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        axisTick: {length: 6},
      }],
      yAxis: [{
        type: 'value',
        name: '总额（亿元）',
        min: 0,
//                    max: 500,
//                    interval: 50,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: '纳税总额',
        type: 'line',
        data: inout
      }]
    };
    this.payTaxesValueEchart = option_nsze;
  }
  creatRenjunShouruValueEchart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const inout = [1500, 2000, 2350, 3142, 4689, 6410];
    const option_rjsr = {
      //设置图表与容器的间隔
      grid: {
        left: '8%',
        right: '4%',
        bottom: '3%',
        top: '80px',
        containLabel: true
      },
      title: {
        show: false,
        text: '人均收入',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
//            backgroundColor: '#000',
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter: '{b} 年<br/>{a}: {c} 亿元'
//                    + '<br/>{a1}: {c1} 亿元'
//                    + '<br/>{a2}: {c2} 亿元'
//                    + '<br/>{a3}: {c3} 亿元'
      },
      toolbox: {
        show: false,
//                    bottom: 15,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true},
          dataZoom: {show: true}
        },
      },
      legend: {
        data: ['人均收入'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: ['yellow', 'white', 'green', 'pink'],
      xAxis: [{
        type: 'category',
        data: year,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        axisTick: {length: 6},
      }],
      yAxis: [{
        type: 'value',
        name: '总额（亿元）',
        min: 0,
//                    max: 500,
//                    interval: 50,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: '人均收入',
        type: 'line',
        data: inout
      }]
    };
    this.renjunShouruValueEchart = option_rjsr;
  }
  creatGonggongYusuanValueEchart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const inout = [60, 143.50, 186.2, 180, 290, 320];
    const option_ggxys = {
      //设置图表与容器的间隔
      grid: {
        left: '8%',
        right: '4%',
        bottom: '3%',
        top: '80px',
        containLabel: true
      },
      title: {
        show: false,
        text: '公共性预算',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
//            backgroundColor: '#000',
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter: '{b} 年<br/>{a}: {c} 亿元'
//                    + '<br/>{a1}: {c1} 亿元'
//                    + '<br/>{a2}: {c2} 亿元'
//                    + '<br/>{a3}: {c3} 亿元'
      },
      toolbox: {
        show: false,
//                    bottom: 15,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true},
          dataZoom: {show: true}
        },
      },
      legend: {
        data: ['公共性预算'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: ['yellow', 'white', 'green', 'pink'],
      xAxis: [{
        type: 'category',
        data: year,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        axisTick: {length: 6},
      }],
      yAxis: [{
        type: 'value',
        name: '总额（亿元）',
        min: 0,
//                    max: 500,
//                    interval: 50,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: '公共性预算',
        type: 'line',
        data: inout
      }]
    };
    this.gonggongYusuanValueEchart = option_ggxys;
  }

}
