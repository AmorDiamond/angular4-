import { Component, OnInit } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';

@Component({
  selector: 'app-economic-scale',
  templateUrl: './economic-scale.component.html',
  styleUrls: ['./economic-scale.component.css']
})
export class EconomicScaleComponent implements OnInit {
  optionDataMain: any;
  optionDataMain1: any;
  optionDataMain2: any;
  optionDataMain3: any;
  optionDataMain4: any;
  optionDataMain5: any;
  constructor(private intermediateService: IntermediateService) { }

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('IndustryMenu');
    // x轴：年份
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // y轴：总产值
    const GDP = {
      0: [20, 50, 90, 160, 180, 200],
      1: [42.3, 50, 160, 176.2, 177.5, 200],
      2: [60, 143.50, 186.2, 180, 290, 320],
      3: [80, 165.8, 180, 280, 300, 412.2]
    }
    const optionMain = {
      //设置图表与容器的间隔
      grid:{
        x:60,
        y:80,
        x2:120,
        y2:80,
        borderWidth:1
      },
      title: {
        text: '各个季度的总产值',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter : '{b} 年<br/>{a}: {c} 亿元'
        + '<br/>{a1}: {c1} 亿元'
        + '<br/>{a2}: {c2} 亿元'
        + '<br/>{a3}: {c3} 亿元'
      },
      toolbox : {
        show : true,
        bottom : 15,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore : {show: true},
          saveAsImage : {show: true},
          dataZoom: {show: true}
        },
      },
      legend : {
        data : [ '第一季度', '第二季度', '第三季度', '第四季度' ],
        right : '10%',
        textStyle : {
          color : '#fff'
        },
        orient: 'vertical',
        top: 20,
        bottom: 20,
      },
      color: ['red','blue','yellow','white'],
      xAxis : [ {
        type : 'category',
        data : year,
        splitLine : {
          show : false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        axisTick: {length:6},
      } ],
      yAxis : [ {
        type : 'value',
        name : '经济总产值（亿元）',
        min : 0,
        max : 500,
        interval : 50,
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
        splitLine : {
          show : false
        }
      } ],
      series : [ {
        name : '第一季度',
        type : 'line',
        data : GDP[0]
      }, {
        name : '第二季度',
        type : 'line',
        data : GDP[1]
      }, {
        name : '第三季度',
        type : 'line',
        data : GDP[2]
      }, {
        name : '第四季度',
        type : 'line',
        data : GDP[3]
      } ]
    };
    this.optionDataMain = optionMain;

    // x轴：年份
    const year1 = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // y轴：总产值
    const GDP1 = {
      0: [20, 40, 50, 25, 80, 100],
      1: [36, 40, 34, 62, 75, 100],
      2: [30, 35, 62, 80, 90, 120],
      3: [40, 58, 80, 80, 100, 122],
      4: [56, 44, 67, 86, 98, 145],
      5: [60, 63, 78, 95, 156, 186]
    }
    const optionMain1 = {
      //设置图表与容器的间隔
      grid:{
        x:60,
        y:80,
        x2:120,
        y2:80,
        borderWidth:1
      },
      title: {
        text: '各个行业的总产值',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter : '{b} 年<br/>{a}: {c} 亿元'
        + '<br/>{a1}: {c1} 亿元'
        + '<br/>{a2}: {c2} 亿元'
        + '<br/>{a3}: {c3} 亿元'
      },
      toolbox : {
        show : true,
        bottom : 15,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore : {show: true},
          saveAsImage : {show: true},
          dataZoom: {show: true}
        },
      },
      legend : {
        data : [ '集成电路', '软件及服务外包', '光电', '生物医药', '通信', '精密机械'],
        right : '10%',
        textStyle : {
          color : '#fff'
        },
        orient: 'vertical',
        top: 20,
        bottom: 20,
      },
      color: ['red','blue','yellow','white','green','pink'],
      xAxis : [ {
        type : 'category',
        data : year1,
        splitLine : {
          show : false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0
        },
        axisTick: {length:6},
      } ],
      yAxis : [ {
        type : 'value',
        name : '经济总产值（亿元）',
        min : 0,
        max : 200,
        interval : 50,
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
        splitLine : {
          show : false
        }
      } ],
      series : [ {
        name : '集成电路',
        type : 'line',
        data : GDP1[0]
      }, {
        name : '软件及服务外包',
        type : 'line',
        data : GDP1[1]
      }, {
        name : '光电',
        type : 'line',
        data : GDP1[2]
      }, {
        name : '生物医药',
        type : 'line',
        data : GDP1[3]
      }, {
        name : '通信',
        type : 'line',
        data : GDP1[4]
      }, {
        name : '精密机械',
        type : 'line',
        data : GDP1[5]
      }]
    };
    this.optionDataMain1 = optionMain1;

    // x轴：年份
    const year2 = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // y轴：总产值
    const inout = [60, 63, 78, 95, 156, 186];
    const optionMain2 = {
      //设置图表与容器的间隔
      grid:{
        x:60,
        y:80,
        x2:120,
        y2:80,
        borderWidth:1
      },
      title: {
        text: '进出口总额',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter : '{b} 年<br/>{a}: {c} 亿元'
      },
      legend : {
        data : ['进出口总额'],
        right : '10%',
        textStyle : {
          color : '#fff'
        },
        orient: 'vertical',
        top: 20,
        bottom: 20,
      },
      toolbox : {
        show : true,
        bottom : 15,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore : {show: true},
          saveAsImage : {show: true},
          dataZoom: {show: true}
        },
      },
      color: ['yellow','white','green','pink'],
      xAxis : [ {
        type : 'category',
        data : year2,
        splitLine : {
          show : false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //rotate: -30
        },
        axisTick: {length:6},
      } ],
      yAxis : [ {
        type : 'value',
        name : '总额（亿元）',
        min : 0,
        max : 200,
        interval : 50,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //rotate: -30,
          //formatter: '{value} 亿元'
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine : {
          show : false
        }
      } ],
      series : [ {
        name : '进出口总额',
        type : 'line',
        data : inout
      }]
    };
    this.optionDataMain2 = optionMain2;

    // x轴：年份
    const year3 = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // y轴：总产值
    const inout1 = [20, 40, 50, 25, 80, 100];
    const optionMain3 = {
      //设置图表与容器的间隔
      grid:{
        x:60,
        y:80,
        x2:120,
        y2:80,
        borderWidth:1
      },
      title: {
        text: '纳税总额',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter : '{b} 年<br/>{a}: {c} 亿元'
      },
      legend : {
        data : ['纳税总额'],
        right : '10%',
        textStyle : {
          color : '#fff'
        },
        orient: 'vertical',
        top: 20,
        bottom: 20,
      },
      toolbox : {
        show : true,
        bottom : 15,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore : {show: true},
          saveAsImage : {show: true},
          dataZoom: {show: true}
        },
      },
      color: ['yellow','white','green','pink'],
      xAxis : [ {
        type : 'category',
        data : year3,
        splitLine : {
          show : false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //rotate: -30
        },
        axisTick: {length:6},
      } ],
      yAxis : [ {
        type : 'value',
        name : '总额（亿元）',
        min : 0,
        max : 200,
        interval : 50,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //rotate: -30,
          //formatter: '{value} 亿元'
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine : {
          show : false
        }
      } ],
      series : [ {
        name : '纳税总额',
        type : 'line',
        data : inout1
      }]
    };
    this.optionDataMain3 = optionMain3;

    // x轴：年份
    const year4 = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // y轴：总产值
    const perIncom = [1500, 2000, 2350, 3142, 4689, 6410];
    const optionMain4 = {
      //设置图表与容器的间隔
      grid:{
        x:60,
        y:80,
        x2:120,
        y2:80,
        borderWidth:1
      },
      title: {
        text: '人均收入',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter : '{b} 年<br/>{a}: {c} 元'
      },
      legend : {
        data : ['人均收入'],
        right : '10%',
        textStyle : {
          color : '#fff'
        },
        orient: 'vertical',
        top: 20,
        bottom: 20,
      },
      toolbox : {
        show : true,
        bottom : 15,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore : {show: true},
          saveAsImage : {show: true},
          dataZoom: {show: true}
        },
      },
      color: ['yellow','white','green','pink'],
      xAxis : [ {
        type : 'category',
        data : year4,
        splitLine : {
          show : false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //rotate: -30
        },
        axisTick: {length:6},
      } ],
      yAxis : [ {
        type : 'value',
        name : '收入（元）',
        min : 0,
        max : 10000,
        interval : 1000,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //rotate: -30,
          //formatter: '{value} 亿元'
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine : {
          show : false
        }
      } ],
      series : [ {
        name : '人均收入',
        type : 'line',
        data : perIncom
      }]
    };
    this.optionDataMain4 = optionMain4;

    // x轴：年份
    const year5 = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // y轴：总产值
    const pubBudget = [60, 143.50, 186.2, 180, 290, 320];
    const optionMain5 = {
      //设置图表与容器的间隔
      grid:{
        x:60,
        y:80,
        x2:120,
        y2:80,
        borderWidth:1
      },
      title: {
        text: '公共性预算',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter : '{b} 年<br/>{a}: {c} 元'
      },
      legend : {
        data : ['公共性预算'],
        right : '10%',
        textStyle : {
          color : '#fff'
        },
        orient: 'vertical',
        top: 20,
        bottom: 20,
      },
      toolbox : {
        show : true,
        bottom : 15,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore : {show: true},
          saveAsImage : {show: true},
          dataZoom: {show: true}
        },
      },
      color: ['yellow','white','green','pink'],
      xAxis : [ {
        type : 'category',
        data : year5,
        splitLine : {
          show : false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //rotate: -30
        },
        axisTick: {length:6},
      } ],
      yAxis : [ {
        type : 'value',
        name : '预算（元）',
        min : 0,
        max : 500,
        interval : 50,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //rotate: -30,
          //formatter: '{value} 亿元'
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine : {
          show : false
        }
      } ],
      series : [ {
        name : '公共性预算',
        type : 'line',
        data : pubBudget
      }]
    };
    this.optionDataMain5 = optionMain5;
  }

}
