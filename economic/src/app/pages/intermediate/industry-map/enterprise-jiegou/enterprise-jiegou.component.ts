import { Component, OnInit } from '@angular/core';
import { ADD_INDUSTRY_MAP_POLYGON } from '../../../../core/amap-ngrx/amap.actions';
import { Store } from '@ngrx/store';
import { Amap } from '../../../../core/amap-ngrx/amap.model';

@Component({
  selector: 'app-enterprise-jiegou',
  templateUrl: './enterprise-jiegou.component.html',
  styleUrls: ['./enterprise-jiegou.component.css']
})
export class EnterpriseJiegouComponent implements OnInit {

  constructor(private storeAmap: Store<Amap>) { }
  zhongXiaoEnterpriseEchart: any;
  zhongXingEnterpriseEchart: any;
  daXingEnterpriseEchart: any;
  china500Echart: any;
  world500Echart: any;
  enterpriseScaleHeatEchart: any;
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
    this.creatZhongXiaoEnterpriseEchart();
    this.creatZhongXingEnterpriseEchart();
    this.creatDaXingEnterpriseEchart();
    this.creatChina500Echart();
    this.creatWorld500Echart();
    this.creatEnterpriseScaleHeatEchart();
  }
  creatZhongXiaoEnterpriseEchart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const option_jdzcz = {
      color: ['#1eb5d4','#f9b621'],
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
        formatter: '{b} 年<br/>{a}: {c} 万' + '<br/>{a1}: {c1} 亿元'
      },
      toolbox: {
        /*show: false,
         //                    bottom: 15,
         feature: {
         mark: {show: true},
         dataView: {show: true, readOnly: false},
         //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
         magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
         restore: {show: true},
         saveAsImage: {show: true},
         dataZoom: {show: true}
         },*/
      },
      legend: {
        data: ['企业数量', '经济产值'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
//                color: ['red', 'blue', 'yellow', 'white'],
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
      yAxis: [
        {
          type: 'value',
          name: '企业数量（万）',
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
        }, {
          type: 'value',
          name: '经济产值（亿）',
          min: 0,
          max: 8000,
          interval: 1000,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#B2B2B2',
              fontSize: 12,
            },
            interval: 0,
            //formatter: '{value} 亿'
          },
          nameTextStyle: {
            color: '#B2B2B2',
            fontSize: 12
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "企业数量", type: "bar", yAxisIndex: 0, data: [
            1.3, 3.7, 7.8, 8, 8.9, 9
          ], barWidth: "40%"
        }, {
          name: "经济产值", type: "line", yAxisIndex: 1, data: [
            1234, 2100, 3000, 3500, 4800, 5000
          ], barWidth: "40%"

        }

      ]
    }
    this.zhongXiaoEnterpriseEchart = option_jdzcz;
  }
  creatZhongXingEnterpriseEchart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const option_hyzcz = {
      color: ['#1eb5d4','#f9b621'],
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
        formatter: '{b} 年<br/>{a}: {c} 万' + '<br/>{a1}: {c1} 亿元'
      },
      toolbox: {
        /*show: false,
         //                    bottom: 15,
         feature: {
         mark: {show: true},
         dataView: {show: true, readOnly: false},
         //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
         magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
         restore: {show: true},
         saveAsImage: {show: true},
         dataZoom: {show: true}
         },*/
      },
      legend: {
        data: ['企业数量', '经济产值'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
//                color: ['red', 'blue', 'yellow', 'white'],
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
      yAxis: [
        {
          type: 'value',
          name: '企业数量（万）',
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
        }, {
          type: 'value',
          name: '经济产值（亿）',
          min: 0,
          max: 8000,
          interval: 1000,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#B2B2B2',
              fontSize: 12,
            },
            interval: 0,
            //formatter: '{value} 亿'
          },
          nameTextStyle: {
            color: '#B2B2B2',
            fontSize: 12
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "企业数量", type: "bar", yAxisIndex: 0, data: [
            4, 5, 7, 8, 8.5, 9
          ], barWidth: "40%"
        }, {
          name: "经济产值", type: "line", yAxisIndex: 1, data: [
            2000, 2100, 2678, 3000, 3256, 4200
          ], barWidth: "40%"

        }

      ]
    };
    this.zhongXingEnterpriseEchart = option_hyzcz;
  }
  creatDaXingEnterpriseEchart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const option_jckze = {
      color: ['#1eb5d4','#f9b621'],
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
        formatter: '{b} 年<br/>{a}: {c} 万' + '<br/>{a1}: {c1} 亿元'
      },
      toolbox: {
        /*show: false,
         //                    bottom: 15,
         feature: {
         mark: {show: true},
         dataView: {show: true, readOnly: false},
         //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
         magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
         restore: {show: true},
         saveAsImage: {show: true},
         dataZoom: {show: true}
         },*/
      },
      legend: {
        data: ['企业数量', '经济产值'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
//                color: ['red', 'blue', 'yellow', 'white'],
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
      yAxis: [
        {
          type: 'value',
          name: '企业数量（万）',
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
        }, {
          type: 'value',
          name: '经济产值（亿）',
          min: 0,
          max: 8000,
          interval: 1000,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#B2B2B2',
              fontSize: 12,
            },
            interval: 0,
            //formatter: '{value} 亿'
          },
          nameTextStyle: {
            color: '#B2B2B2',
            fontSize: 12
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "企业数量", type: "bar", yAxisIndex: 0, data: [
            4.5, 5.8, 8.9,9.9, 12.5, 14
          ], barWidth: "40%"
        }, {
          name: "经济产值", type: "line", yAxisIndex: 1, data: [
            2300, 2100, 3000, 3500, 4800, 6678
          ], barWidth: "40%"

        }

      ]
    };
    this.daXingEnterpriseEchart = option_jckze;
  }
  creatChina500Echart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const option_nsze = {
      color: ['#1eb5d4','#f9b621'],
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
        formatter: '{b} 年<br/>{a}: {c} 万' + '<br/>{a1}: {c1} 亿元'
      },
      toolbox: {
        /*show: false,
         //                    bottom: 15,
         feature: {
         mark: {show: true},
         dataView: {show: true, readOnly: false},
         //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
         magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
         restore: {show: true},
         saveAsImage: {show: true},
         dataZoom: {show: true}
         },*/
      },
      legend: {
        data: ['企业数量', '经济产值'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
//                color: ['red', 'blue', 'yellow', 'white'],
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
      yAxis: [
        {
          type: 'value',
          name: '企业数量（万）',
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
        }, {
          type: 'value',
          name: '经济产值（亿）',
          min: 0,
          max: 8000,
          interval: 1000,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#B2B2B2',
              fontSize: 12,
            },
            interval: 0,
            //formatter: '{value} 亿'
          },
          nameTextStyle: {
            color: '#B2B2B2',
            fontSize: 12
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "企业数量", type: "bar", yAxisIndex: 0, data: [
            1.3, 3.7, 7.8, 8, 8.9, 9
          ], barWidth: "40%"
        }, {
          name: "经济产值", type: "line", yAxisIndex: 1, data: [
            1234, 2100, 3000, 3500, 4800, 5000
          ], barWidth: "40%"

        }

      ]
    };
    this.china500Echart = option_nsze;
  }
  creatWorld500Echart() {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const option_rjsr = {
      color: ['#1eb5d4','#f9b621'],
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
        formatter: '{b} 年<br/>{a}: {c} 万' + '<br/>{a1}: {c1} 亿元'
      },
      toolbox: {
        /*show: false,
         //                    bottom: 15,
         feature: {
         mark: {show: true},
         dataView: {show: true, readOnly: false},
         //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
         magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
         restore: {show: true},
         saveAsImage: {show: true},
         dataZoom: {show: true}
         },*/
      },
      legend: {
        data: ['企业数量', '经济产值'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
//                color: ['red', 'blue', 'yellow', 'white'],
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
      yAxis: [
        {
          type: 'value',
          name: '企业数量（万）',
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
        }, {
          type: 'value',
          name: '经济产值（亿）',
          min: 0,
          max: 8000,
          interval: 1000,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#B2B2B2',
              fontSize: 12,
            },
            interval: 0,
            //formatter: '{value} 亿'
          },
          nameTextStyle: {
            color: '#B2B2B2',
            fontSize: 12
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "企业数量", type: "bar", yAxisIndex: 0, data: [
            1.3, 3.7, 7.8, 8, 8.9, 9
          ], barWidth: "40%"
        }, {
          name: "经济产值", type: "line", yAxisIndex: 1, data: [
            1234, 2100, 3000, 3500, 4800, 5000
          ], barWidth: "40%"

        }

      ]
    };
    this.world500Echart = option_rjsr;
  }
  creatEnterpriseScaleHeatEchart() {
    const years = ['2012','2013','2014','2015','2016','2017'];
    const industry_cluster = ['中小微企业','中型企业','大型企业','中国500强','世界500强'];
    const rankOption = [[0,0,18],[0,1,15],[0,2,15],[0,3,16],[0,4,12],[0,5,14],
      [1,0,1],[1,1,3],[1,2,11],[1,3,14],[1,4,6],[1,5,15],
      [2,0,11],[2,1,20],[2,2,4],[2,3,15],[2,4,6],[2,5,2],
      [3,0,3],[3,1,2],[3,2,5],[3,3,6],[3,4,6],[3,5,4],
      [4,0,6],[4,1,5],[4,2,4],[4,3,13],[4,4,2],[4,5,3]];
    const rankData = rankOption.map(function(item) {
      return [ item[1], item[0], item[2] || '-' ];
    });
    const option_ggxys = {
      // backgroundColor : '#000',
      color : [ 'blue', 'yellow', 'white', 'green', 'pink' ],
      title: {
        text: '企业规模热度统计',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip : {
        position : 'top'
      },
      animation : false,
      grid : {
        height : '55%',
        y : '18%',
        x : '22%'
      },
      xAxis : {
        type : 'category',
        data : years,
        splitArea : {
          show : true
        },
        splitLine:{
          show: false
        },
        axisTick: {
          show: false
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
      },
      yAxis : {
        type : 'category',
        data : industry_cluster,
        splitArea : {
          show : true
        },
        splitLine:{
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //formatter: '{value} 万'
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        }
      },
      visualMap : {
        min : 0,
        max : 20,
        calculable : true,
        orient : 'horizontal',
        left : 'center',
        bottom : '5%',
        textStyle: {
          color: '#B2B2B2',
          fontSize: 12,
        },
      },
      series : [ {
        name : '企业规模热度',
        type : 'heatmap',
        data : rankData,
        label : {
          normal : {
            show : true
          }
        },
        itemStyle : {
          emphasis : {
            shadowBlur : 10,
            shadowColor : 'rgba(0, 0, 0, 0.5)'
          }
        }
      } ]
    }
    this.enterpriseScaleHeatEchart = option_ggxys;
  }

}
