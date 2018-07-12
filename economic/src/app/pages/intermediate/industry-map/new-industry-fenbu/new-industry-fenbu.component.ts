import { Component, OnInit, OnDestroy } from '@angular/core';
import { IndustryMapFenbuService } from '../industry-map-fenbu.service';
import { Subscription } from 'rxjs/Subscription';
import { ADD_INDUSTRY_MAP_POLYGON } from '../../../../core/amap-ngrx/amap.actions';
import { Amap } from '../../../../core/amap-ngrx/amap.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-industry-fenbu',
  templateUrl: './new-industry-fenbu.component.html',
  styleUrls: ['./new-industry-fenbu.component.css']
})
export class NewIndustryFenbuComponent implements OnInit, OnDestroy {

  constructor(private storeAmap: Store<Amap>, private industryMapFenbuService: IndustryMapFenbuService) { }
  /*新兴数据*/
  provinces = [
    {
      "name": "信息网络",
      "center": "104.071199,30.546204",
      "type": 1,
      "radius": 1500,
      "color": "#ADD8E6",
      "GDP": [2700, 2900, 3500, 3400, 3700],
      "companyNum": [27, 29, 35, 34, 37],
      "nationalLevel": [27, 29, 35, 34, 37],
      "keyCompany": [27, 29, 35, 34, 30],
      "baiQiang": [27, 29, 35, 30, 37]
    },
    {
      "name": "电子核心",
      "center": "104.071199,30.524204",
      "type": 1,
      "radius": 1500,
      "color": "#1E90FF",
      "GDP": [2200, 2700, 3000, 2400, 3200],
      "companyNum": [22, 27, 30, 24, 32],
      "nationalLevel": [22, 27, 30, 20, 32],
      "keyCompany": [22, 27, 30, 24, 32],
      "baiQiang": [22, 27, 30, 24, 32]
    },
    {
      "name": "生物医药",
      "center": "104.071199,30.554204",
      "type": 1,
      "radius": 1500,
      "color": "#00ff60",
      "GDP": [2100, 2700, 3200, 2300, 3300],
      "companyNum": [21, 20, 32, 23, 33],
      "nationalLevel": [21, 27, 32, 23, 33],
      "keyCompany": [21, 27, 32, 23, 33],
      "baiQiang": [21, 27, 32, 23, 33]
    },
    {
      "name": "高端软件",
      "center": "104.071199,30.552204",
      "type": 1,
      "radius": 1500,
      "color": "#ff6b00",
      "GDP": [2100, 2700, 3300, 2300, 3300],
      "companyNum": [21, 27, 33, 23, 33],
      "nationalLevel": [21, 27, 33, 23, 33],
      "keyCompany": [21, 27, 33, 23, 33],
      "baiQiang": [21, 27, 33, 23, 33]
    },
    {
      "name": "生物医学",
      "center": "104.071199,30.552204",
      "type": 1,
      "radius": 1500,
      "color": "#dbff00",
      "GDP": [2100, 2400, 3100, 2600, 3300],
      "companyNum": [21, 24, 31, 26, 33],
      "nationalLevel": [21, 24, 31, 26, 33],
      "keyCompany": [21, 24, 31, 26, 33],
      "baiQiang": [21, 24, 31, 26, 33]
    },
    {
      "name": "航空装备",
      "center": "104.071199,30.552204",
      "type": 1,
      "radius": 1500,
      "color": "#08c2ff",
      "GDP": [2100, 2700, 2800, 2400, 3100],
      "companyNum": [21, 27, 28, 24, 31],
      "nationalLevel": [21, 27, 28, 24, 31],
      "keyCompany": [21, 27, 28, 24, 31],
      "baiQiang": [21, 27, 28, 24, 31]
    },
    {
      "name": "先进环保",
      "center": "104.071199,30.452204",
      "type": 1,
      "radius": 1500,
      "color": "#00FFFF",
      "GDP": [2100, 2800, 3000, 2600, 3100],
      "companyNum": [21, 28, 30, 26, 31],
      "nationalLevel": [21, 28, 30, 26, 31],
      "keyCompany": [21, 28, 30, 26, 31],
      "baiQiang": [21, 28, 30, 26, 31]
    }
  ];
  mapProvinces = [
    {
      "name": "信息网络",
      "center": "104.071199,30.546204",
      "type": 1,
      "radius": 1500,
      "color": "#ADD8E6"
    },
    {
      "name": "电子核心",
      "center": "104.071199,30.524204",
      "type": 1,
      "radius": 1500,
      "color": "#1E90FF"
    },
    {
      "name": "生物医药",
      "center": "104.071199,30.554204",
      "type": 1,
      "radius": 1500,
      "color": "#00ff60"
    },
    {
      "name": "高端软件",
      "center": "104.071199,30.552204",
      "type": 1,
      "radius": 1500,
      "color": "#ff6b00"
    },
    {
      "name": "生物医学",
      "center": "104.092199,30.552204",
      "type": 1,
      "radius": 1500,
      "color": "#dbff00"
    },
    {
      "name": "航空装备",
      "center": "104.171399,30.552204",
      "type": 1,
      "radius": 1500,
      "color": "#08c2ff"
    },
    {
      "name": "先进环保",
      "center": "104.071199,30.452204",
      "type": 1,
      "radius": 1500,
      "color": "#00FFFF"
    }
  ];
  totalOutputValueEchart: any;
  enterpriseScaleEchart: any;
  countryBaseEchart: any;
  importantEnterpriseEchart: any;
  global00Echart: any;
  selectNewIndustry: any;
  selectNewIndustrySubscription: Subscription;
  ngOnInit() {
    this.storeAmap.dispatch({
      type: ADD_INDUSTRY_MAP_POLYGON,
      payload: {
        action: 'ADD_INDUSTRY_MAP_POLYGON',
        data: {type: 'newIndustry', data: this.mapProvinces}
      }
    });
    /*再次加载时取消之前选中的*/
    this.industryMapFenbuService.changeSelectNewIndustry('');
    this.selectNewIndustrySubscription = this.industryMapFenbuService.getSelectNewIndustry().subscribe(res => {
      this.selectNewIndustry = res.options;
      let markers = [];
      if (this.selectNewIndustry) {
        this.provinces.forEach((v, i) => {
          if (this.selectNewIndustry == v.name) {
            markers.push(this.provinces[i]);
          }
        });
      }else {
        markers = this.provinces;
      }
      this.creatTotalOutputValueEchart(markers);
      this.creatEnterpriseScaleEchart(markers);
      this.creatCountryBaseEchart(markers);
      this.creatImportantEnterpriseEchart(markers);
      this.creatGlobal00Echart(markers);
    });
  }
  ngOnDestroy() {
    this.selectNewIndustrySubscription.unsubscribe();
  }
  creatTotalOutputValueEchart(options) {
    const year = ['2012', '2013', '2014', '2015', '2016'];
    const serie = [];
    const colors = [];
    const legends = [];
    options.forEach((v, i) => {
      legends.push(v.name);
      colors.push(v.color);
      const item = {
        name: v.name,
        type: 'line',
        data: v.GDP
      }
      serie.push(item);
    })
    const option_Zcz = {
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
        data: legends,
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: colors,
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
      series: serie
    };
    this.totalOutputValueEchart = option_Zcz;
  }
  creatEnterpriseScaleEchart(options) {
    const year = ['2012', '2013', '2014', '2015', '2016'];
    const serie = [];
    const colors = []
    const legends = []
    options.forEach((v, i) => {
      legends.push(v.name);
      colors.push(v.color);
      const item = {
        name: v.name,
        type: 'line',
        data: v.GDP
      }
      serie.push(item);
    })
    const option_qygm = {
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
        formatter: '{b} 年<br/>{a}: {c} 家'
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
        data: legends,
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: colors,
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
        name: '企业规模（家）',
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
      series: serie
    };
    this.enterpriseScaleEchart = option_qygm;
  }
  creatCountryBaseEchart(options) {
    const year = ['2012', '2013', '2014', '2015', '2016'];
    const serie = [];
    const colors = []
    const legends = []
    options.forEach((v, i) => {
      legends.push(v.name);
      colors.push(v.color);
      const item = {
        name: v.name,
        type: 'line',
        data: v.GDP
      }
      serie.push(item);
    })
    const option_gjjjd = {
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
        formatter: '{b} 年<br/>{a}: {c} 个'
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
        data: legends,
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: colors,
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
        name: '数量（个）',
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
      series: serie
    };
    this.countryBaseEchart = option_gjjjd;
  }
  creatImportantEnterpriseEchart(options) {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const serie = [];
    const colors = []
    const legends = []
    options.forEach((v, i) => {
      legends.push(v.name);
      colors.push(v.color);
      const item = {
        name: v.name,
        type: 'line',
        data: v.GDP
      }
      serie.push(item);
    })
    const option_zdqy = {
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
        formatter: '{b} 年<br/>{a}: {c} 家'
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
        data: legends,
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: colors,
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
        name: '数量（家）',
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
      series: serie
    };
    this.importantEnterpriseEchart = option_zdqy;
  }
  creatGlobal00Echart(options) {
    const year = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const serie = [];
    const colors = []
    const legends = []
    options.forEach((v, i) => {
      legends.push(v.name);
      colors.push(v.color);
      const item = {
        name: v.name,
        type: 'line',
        data: v.GDP
      }
      serie.push(item);
    })
    const option_qqbqrz = {
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
        text: '全球百强',
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
        formatter: '{b} 年<br/>{a}: {c} 家'
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
        data: legends,
        right: '10%',
        textStyle: {
          color: '#fff'
        },
//                    orient: 'vertical',
//                    right: 10,
//                    top: 20,
//                    bottom: 20,
      },
      color: colors,
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
        name: '数量（家）',
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
      series: serie
    };
    this.global00Echart = option_qqbqrz;
  }

}
