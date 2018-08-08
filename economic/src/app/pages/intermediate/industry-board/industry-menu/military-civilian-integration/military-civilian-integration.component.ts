import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-military-civilian-integration',
  templateUrl: './military-civilian-integration.component.html',
  styleUrls: ['./military-civilian-integration.component.css']
})
export class MilitaryCivilianIntegrationComponent implements OnInit {

  constructor() { }
  militaryCivilianEchartData: any;
  ngOnInit() {
    this.getData();
  }
  /*获取数据*/
  getData() {
    // x轴：年份
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // y轴：总产值
    const GDP = {
      0: [20, 50, 90, 160, 180, 200],
      1: [42.3, 50, 160, 176.2, 177.5, 200],
      2: [60, 143.50, 186.2, 180, 290, 320],
      3: [80, 165.8, 180, 280, 300, 412.2]
    }
    const echartTitle = '军民融合业';
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
        show : true,
        bottom : 15,
        feature : {
          mark : {show: true},
          // dataView : {show: true, readOnly: false},
          //'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）
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
      name : '亿元',
      color: ['red','blue','yellow','white'],
      xAxis : [ {
        type : 'category',
        name : '年',
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
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        axisTick: {length:6},
      } ],
      yAxis : [ {
        type : 'value',
        name : '亿元',
        min : 0,
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
        name : '营收',
        type : 'line',
        data : GDP[0]
      }, {
        name : '利润',
        type : 'line',
        data : GDP[1]
      }, {
        name : '税收',
        type : 'line',
        data : GDP[2]
      } ]
    };
    this.militaryCivilianEchartData = optionMain;
  }

}
