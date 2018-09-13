import { Component, OnInit } from '@angular/core';
import { IndustryMenuService } from '../industry-menu.service';
import { IntermediateService } from '../../../intermediate.service';

@Component({
  selector: 'app-advanced-manufacturing',
  templateUrl: './advanced-manufacturing.component.html',
  styleUrls: ['./advanced-manufacturing.component.css']
})
export class AdvancedManufacturingComponent implements OnInit {

  constructor(
    private intermediateService: IntermediateService,
    private industryMenuService: IndustryMenuService
  ) { }
  advancedManufactureEhcartData: any;
  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('IndustryMenu');
    this.getData();
  }
  /*获取数据*/
  getData() {
    this.industryMenuService.getDataByParams({}, 'enterpriseAdvancedManufacturingUrl').subscribe(res => {
      console.log('先进制造业数据', res);
      if (res.responseCode === '_200') {
        if (res.data.length) {
          const options = res.data;
          this.creatAdvancedEchart(options);
        }
      }
    });
  }
  /*绘制先进制造业图表*/
  creatAdvancedEchart(options) {
    const publicEchartData = this.foramtEchartData(options);
    // x轴：年份
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // y轴：总产值
    const GDP = {
      0: [20, 50, 90, 160, 180, 200],
      1: [42.3, 50, 160, 176.2, 177.5, 200],
      2: [60, 143.50, 186.2, 180, 290, 320],
      3: [80, 165.8, 180, 280, 300, 412.2]
    }
    const xAxisData = publicEchartData.xAxisData;
    const series = publicEchartData.series;
    const echartTitle = '先进制造业';
    const optionMain = {
      title: {
        text: echartTitle,
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
        /*formatter : '{b} 年<br/>{a}: {c} 亿元'
        + '<br/>{a1}: {c1} 亿元'
        + '<br/>{a2}: {c2} 亿元'*/
      },
      toolbox : {
        show : false,
        bottom : 15,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          // 'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
          magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore : {show: true},
          saveAsImage : {show: true},
          dataZoom: {show: true}
        },
      },
      legend : {
        data : [ '营收', '利润', '税收' ],
        left : 'center',
        top: '8%',
        textStyle : {
          color : '#fff'
        },
      },
      color: ['red', 'blue', 'yellow', 'white'],
      xAxis : [ {
        type : 'category',
        name : '年',
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
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        axisTick: {length: 6},
      } ],
      yAxis : [ {
        type : 'value',
        name : '万元',
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
    this.advancedManufactureEhcartData = optionMain;
  }
  /*格式化所需数据*/
  foramtEchartData(options) {
    const copyObjYear = {};
    /*将获取的数据根据时间聚合整理*/
    options.forEach(item => {
      const year = item.data_Supply_Time;
      if (year && copyObjYear[year]) {
        copyObjYear[year].business_income += Number(item.business_income);
        copyObjYear[year].operating_profit += Number(item.operating_profit);
        copyObjYear[year].tax_additional += Number(item.tax_additional);
      }else if (year) {
        copyObjYear[year] = {};
        copyObjYear[year].business_income = Number(item.business_income);
        copyObjYear[year].operating_profit = Number(item.operating_profit);
        copyObjYear[year].tax_additional = Number(item.tax_additional);
      }
    });
    console.log(copyObjYear)

    const xAxisData = [];
    const series = [];
    const legendData = [ '营收', '利润', '税收' ];
    const startYear = new Date().getFullYear() - 6;
    const endYear = startYear + 6;
    /*处理xAxisData数据*/
    for (let i = startYear; i < endYear ; i++) {
      xAxisData.push(i);
    }
    /*处理series数据*/
    for (let i = 0; i < legendData.length ; i++) {
      const itemObj = {
        name: legendData[i],
        type: 'line',
        data: new Array(xAxisData.length) // 不存在对应类型的数据时设置为0
      }
      for (let i = 0; i < itemObj.data.length; i++) {
        itemObj.data[i] = 0;
      }
      series.push(itemObj);
    }
    /*将提取出来的按行业类型合并的数据处理成所需的seriesData数据格式*/
    for (const item in copyObjYear) {
      if (copyObjYear[item]) {
        for (const data in copyObjYear[item]) {
          let index = xAxisData.indexOf(Number(item)); // 让series里data的数据位置和x轴坐标类型的数据对应。
          if (index < 0) {
            continue;
          }
          if (data === 'business_income') {
            /*营收*/
            series[0].data[index] = copyObjYear[item][data].toFixed(2);
          }else if (data === 'operating_profit') {
            /*盈利*/
            series[1].data[index] = copyObjYear[item][data].toFixed(2);
          }else if (data === 'tax_additional') {
            /*税收*/
            series[2].data[index] = copyObjYear[item][data].toFixed(2);
          }
        }
      }
    }
    return {xAxisData: xAxisData, series: series};
  }
}
