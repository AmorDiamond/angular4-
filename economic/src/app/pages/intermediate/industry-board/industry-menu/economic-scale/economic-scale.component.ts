import { Component, OnInit } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';
import { IndustryMenuService } from "../industry-menu.service";

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
  echartxAxisData = [];
  constructor(private intermediateService: IntermediateService, private industryMenuService: IndustryMenuService) { }

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('IndustryMenu');
    let startYear = new Date().getFullYear() - 6;
    let endYear = startYear + 6;
    for (let i = startYear; i < endYear; i++) {
      this.echartxAxisData.push(i);
    }
   this.getData();
  }
  /*获取数据*/
  getData() {
    this.industryMenuService.getDataByParams({}, 'enterpriseScaleUrl').subscribe(res => {
      console.log('规模数据', res);
      if (res.responseCode === '_200') {
        if (res.data.length > 0) {
          let formatData = [];
          let options = res.data;
          options.forEach((item, i) => {
            if (item && item.year) {
              formatData.push(item);
            }
          });
          console.log(formatData);
          this.creatIndustryOutputValueEchart(formatData);
          this.creatImportAndExportEchart(formatData);
          this.creatTaxPaymentEchart(formatData);
          this.creatPeopleIncomeEchart(formatData);
        }
      }
    });

  }
  /*绘制行业总产值图表*/
  creatIndustryOutputValueEchart(options) {
    let publicEchartData = this.getPublicEchartData(options, 'industrial_output');
    // x轴：年份
    let xAxisData = publicEchartData.xAxisData;
    let legendData = publicEchartData.legendData;
    let series = publicEchartData.series;
    const optionMain1 = {
      // 设置图表与容器的间隔
      grid: {
        // top: 100,
        bottom: '5%',
        left: '3%',
        right: '3%',
        containLabel: true
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
        confine: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        /*formatter : '{b} 年<br/>{a}: {c} 亿元'
        + '<br/>{a1}: {c1} 亿元'
        + '<br/>{a2}: {c2} 亿元'
        + '<br/>{a3}: {c3} 亿元'*/
      },
      toolbox : {
        show : false,
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
        show: false,
        data : legendData,
        left : 'center',
        top: 25,
        textStyle : {
          color : '#fff'
        },
      },
      color: ['red','blue','yellow','white','green','pink'],
      xAxis : [ {
        type : 'category',
        data : xAxisData,
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
        name : '总产值（亿元）',
        min : 0,
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
      series : series
    };
    this.optionDataMain1 = optionMain1;
  }
  /*绘制进出口总额图表*/
  creatImportAndExportEchart(options) {

    let publicEchartData = this.getPublicEchartData(options, 'timp_exports');
    // x轴：年份
    let xAxisData = publicEchartData.xAxisData;
    let legendData = publicEchartData.legendData;
    let series = publicEchartData.series;
    const optionMain2 = {
      // 设置图表与容器的间隔
      grid: {
        // top: 100,
        bottom: '5%',
        left: '3%',
        right: '3%',
        containLabel: true
      },
      title: {
        text: '进出口总额',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      legend : {
        show: false,
        data : legendData,
        left : 'center',
        top: 25,
        textStyle : {
          color : '#fff'
        },
      },
      color: ['red','blue','yellow','white','green','pink'],
      tooltip: {
        show: true,
        confine: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        // formatter : '{b} 年<br/>{a}: {c} 亿元'
      },
      toolbox : {
        show : false,
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
      xAxis : [ {
        type : 'category',
        data : xAxisData,
        splitLine : {
          show : false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          //rotate: -30
        },
        axisTick: {length:6},
      } ],
      yAxis : [ {
        type : 'value',
        name : '总额（亿元）',
        min : 0,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
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
      series : series
    };
    this.optionDataMain2 = optionMain2;
  }
  /*绘制纳税总额图表*/
  creatTaxPaymentEchart(options) {

    let publicEchartData = this.getPublicEchartData(options, 'totalataxes_output');
    // x轴：年份
    let xAxisData = publicEchartData.xAxisData;
    let legendData = publicEchartData.legendData;
    let series = publicEchartData.series;
    const optionMain3 = {
      // 设置图表与容器的间隔
      grid: {
        // top: 100,
        bottom: '5%',
        left: '3%',
        right: '3%',
        containLabel: true
      },
      title: {
        text: '纳税总额',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      legend : {
        show: false,
        data : legendData,
        left : 'center',
        top: 25,
        textStyle : {
          color : '#fff'
        },
      },
      color: ['red','blue','yellow','white','green','pink'],
      tooltip: {
        show: true,
        confine: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        // formatter : '{b} 年<br/>{a}: {c} 亿元'
      },
      toolbox : {
        show : false,
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
      xAxis : [ {
        type : 'category',
        data : xAxisData,
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
      series : series
    };
    this.optionDataMain3 = optionMain3;
  }
  /*绘制人均收入图表*/
  creatPeopleIncomeEchart(options) {

    let publicEchartData = this.getPublicEchartData(options, 'avgincome');
    // x轴：年份
    let xAxisData = publicEchartData.xAxisData;
    let legendData = publicEchartData.legendData;
    let series = publicEchartData.series;
    const optionMain4 = {
      // 设置图表与容器的间隔
      grid: {
        // top: 100,
        bottom: '5%',
        left: '3%',
        right: '3%',
        containLabel: true
      },
      title: {
        text: '人均收入',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      legend : {
        show: false,
        data : legendData,
        left : 'center',
        top: 25,
        textStyle : {
          color : '#fff'
        },
      },
      color: ['red','blue','yellow','white','green','pink'],
      tooltip: {
        show: true,
        confine: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        // formatter : '{b} 年<br/>{a}: {c} 元'
      },
      toolbox : {
        show : false,
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
      xAxis : [ {
        type : 'category',
        data : xAxisData,
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
      series : series
    };
    this.optionDataMain4 = optionMain4;
  }
  /*绘制公共性预算图表*/
  creatPublicBudgetEchart(options) {
    // x轴：年份
    const year5 = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // y轴：总产值
    const pubBudget = [60, 143.50, 186.2, 180, 290, 320];
    const optionMain5 = {
      //设置图表与容器的间隔
      grid:{
        top: 100,
        bottom: '5%',
        left: '3%',
        right: '3%',
        containLabel: true
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
        // formatter : '{b} 年<br/>{a}: {c} 元'
      },
      toolbox : {
        show : false,
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
  /*提取公共图表数据*/
  getPublicEchartData(options, type) {
    let xAxisData = this.echartxAxisData;
    let legendData = [];
    let series = [];
    let copyObjType = {};
    options.forEach(res => {
      let year = res.year;
      let type = res.industry_type;
      if (type && copyObjType[type]) {
        copyObjType[type].push(res);
      }else if (type) {
        copyObjType[type] = [];
        copyObjType[type].push(res);
        legendData.push(type);
      }
    });
    /*将提取出来的按行业类型合并的数据处理成所需的seriesData数据格式*/
    for(let item in copyObjType) {
      const itemObj = {
        name: '行业类型',
        type: 'line',
        data: new Array(xAxisData.length) // 不存在对应类型的数据时设置为0
      };
      for (let i = 0; i < itemObj.data.length; i++) {
        itemObj.data[i] = 0;
      }
      itemObj.name = item;
      copyObjType[item].forEach(res => {
        if (res.year) {
          let index = xAxisData.indexOf(Number(res.year)); // 让series里data的数据位置和x轴坐标类型的数据对应。
          if (itemObj.data[index]) {
            itemObj.data[index] += res[type] ? Number(res[type]) : 0;
          }else {
            itemObj.data[index] = res[type] ? Number(res[type]) : 0;
          }
        }
      });
      series.push(itemObj);
    }
    return {xAxisData: xAxisData, legendData: legendData, series: series};
  }
}
