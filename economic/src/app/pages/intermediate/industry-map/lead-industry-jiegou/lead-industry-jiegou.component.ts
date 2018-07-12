import { Component, OnInit } from '@angular/core';
import { ADD_INDUSTRY_MAP_POLYGON } from '../../../../core/amap-ngrx/amap.actions';
import { Store } from '@ngrx/store';
import { Amap } from '../../../../core/amap-ngrx/amap.model';

@Component({
  selector: 'app-lead-industry-jiegou',
  templateUrl: './lead-industry-jiegou.component.html',
  styleUrls: ['./lead-industry-jiegou.component.css']
})
export class LeadIndustryJiegouComponent implements OnInit {

  constructor(private storeAmap: Store<Amap>) { }
  jiduOutputValueEchart: any;
  importExportValueEchart: any;
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
    this.creatImportExportValueEchart();
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
//                backgroundColor : '#000',
//                color : [ 'blue', 'yellow', 'white', 'green', 'pink' ],
      title: {
        show: false,
        text: '企业类型的数量占比',
        x: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)",
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['国有企业', '私营企业', '外商投资企业', '集体所有制企业', '股份制企业'],
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        top: '10%'
      },
      series: [
        {
          name: '企业类型的数量占比',
          type: 'pie',
          radius: '45%',
          center: ['65%', '60%'],
          data: [
            {value: 335, name: '国有企业'},
            {value: 1548, name: '私营企业'},
            {value: 234, name: '外商投资企业'},
            {value: 135, name: '集体所有制企业'},
            {value: 154, name: '股份制企业'}
          ],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          lableLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.jiduOutputValueEchart = option_jdzcz;
  }
  creatImportExportValueEchart() {
    const year = ['2012','2013','2014','2015','2016','2017'];
    const GDP = {
      0: [60, 63, 78, 95, 156, 186],
      1: [36, 40, 34, 62, 75, 100],
      2: [30, 35, 62, 80, 90, 120],
      3: [40, 58, 80, 80, 100, 122],
      4: [56, 44, 67, 86, 98, 145]
    };
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
        }
      },
      legend: {
        data: [ '国有企业', '私营企业', '外商投资企业', '集体所有制企业', '股份制企业'],
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
//                color: ['yellow', 'white', 'green', 'pink'],
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
            fontSize: 12
          },
          interval: 0
        },
        axisTick: {length: 6}
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
        name : '国有企业',
        type : 'line',
        data : GDP[0],
        smooth:true,
      }, {
        name : '私营企业',
        type : 'line',
        smooth:true,
        data : GDP[1]
      }, {
        name : '外商投资企业',
        type : 'line',
        smooth:true,
        data : GDP[2]
      }, {
        name : '集体所有制企业',
        type : 'line',
        smooth:true,
        data : GDP[3]
      }, {
        name : '股份制企业',
        type : 'line',
        smooth:true,
        data : GDP[4]
      }]
    };
    this.importExportValueEchart = option_jckze;
  }

}
