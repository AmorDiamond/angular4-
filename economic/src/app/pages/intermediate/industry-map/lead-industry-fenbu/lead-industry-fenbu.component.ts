import { Component, OnInit, OnDestroy } from '@angular/core';
import { Amap } from '../../../../core/amap-ngrx/amap.model';
import { Store } from '@ngrx/store';
import { ADD_INDUSTRY_MAP_POLYGON } from '../../../../core/amap-ngrx/amap.actions';
import { IndustryMapFenbuService } from '../industry-map-fenbu.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-lead-industry-fenbu',
  templateUrl: './lead-industry-fenbu.component.html',
  styleUrls: ['./lead-industry-fenbu.component.css']
})
export class LeadIndustryFenbuComponent implements OnInit, OnDestroy {

  constructor(private storeAmap: Store<Amap>, private industryMapFenbuService: IndustryMapFenbuService) { }

  /*主导数据*/
  provinces = [
    {
      "name": "信息技术",
      "center": "104.05568,30.586697",
      "type": 0,
      "radius": 1500,
      "color": "#ff9529",
      "GDP": [2100, 2700, 3000, 2400, 3300],
      "companyNum": [21, 27, 30, 24, 33],
      "nationalLevel": [21, 27, 30, 24, 33],
      "keyCompany": [21, 27, 30, 24, 33],
      "baiQiang": [21, 27, 30, 24, 33]
    },
    {
      "name": "生物",
      "center": "104.063923,30.57371",
      "type": 1,
      "radius": 1500,
      "color": "#7fa5ff",
      "GDP": [2100, 2800, 3200, 2500, 3300],
      "companyNum": [21, 28, 32, 25, 33],
      "nationalLevel": [21, 28, 32, 25, 33],
      "keyCompany": [21, 28, 32, 25, 33],
      "baiQiang": [21, 28, 32, 25, 33]
    },
    {
      "name": "装备",
      "center": "104.030421,30.61563",
      "type": 1,
      "radius": 1500,
      "color": "#FFD700",
      "GDP": [2100, 2500, 3300, 2700, 3200],
      "companyNum": [21, 25, 33, 27, 32],
      "nationalLevel": [21, 25, 33, 27, 32],
      "keyCompany": [21, 25, 33, 27, 32],
      "baiQiang": [21, 25, 33, 27, 32]
    },
    {
      "name": "节能环保",
      "center": "104.071199,30.543204",
      "type": 1,
      "radius": 1500,
      "color": "#00FF7F",
      "GDP": [2100, 2800, 3100, 2600, 3400],
      "companyNum": [21, 28, 31, 26, 34],
      "nationalLevel": [21, 28, 31, 26, 34],
      "keyCompany": [21, 28, 31, 26, 34],
      "baiQiang": [21, 28, 31, 26, 34]
    },
    {
      "name": "服务",
      "center": "104.081199,30.541204",
      "type": 1,
      "radius": 1500,
      "color": "#fbffe9",
      "GDP": [2100, 2400, 3200, 2400, 3700],
      "companyNum": [21, 20, 32, 24, 37],
      "nationalLevel": [21, 24, 32, 24, 37],
      "keyCompany": [21, 24, 32, 24, 37],
      "baiQiang": [21, 24, 32, 24, 37]
    }
  ];
  mapProvinces = [
    {
      "name": "信息技术",
      "center": "104.05568,30.586697",
      "type": 0,
      "radius": 1500,
      "color": "#ff9529"
    },
    {
      "name": "生物",
      "center": "104.063923,30.57371",
      "type": 1,
      "radius": 1500,
      "color": "#7fa5ff"
    },
    {
      "name": "装备",
      "center": "104.030421,30.61563",
      "type": 1,
      "radius": 1500,
      "color": "#EE9A00"
    },
    {
      "name": "节能环保",
      "center": "104.071199,30.543204",
      "type": 1,
      "radius": 1500,
      "color": "#00FF7F"
    },
    {
      "name": "服务",
      "center": "104.081199,30.541204",
      "type": 1,
      "radius": 1500,
      "color": "#fbffe9"
    }
  ];
  selectIndustryType: any;
  totalOutputValueEchart: any;
  enterpriseScaleEchart: any;
  countryBaseEchart: any;
  importantEnterpriseEchart: any;
  global00Echart: any;
  selectLeadIndustrySubscription: Subscription;
  ngOnInit() {
    this.storeAmap.dispatch({
      type: ADD_INDUSTRY_MAP_POLYGON,
      payload: {
        action: 'ADD_INDUSTRY_MAP_POLYGON',
        data: {type: 'leadIndustry', data: this.mapProvinces}
      }
    });
    /*再次加载时取消之前选中的*/
    this.industryMapFenbuService.changeSelectLeadIndustry('');
    /*监听地图上选中的类别*/
    this.selectLeadIndustrySubscription = this.industryMapFenbuService.getSelectLeadIndustry().subscribe(res => {
      this.selectIndustryType = res.options;

      let markers = [];
      if (this.selectIndustryType) {
        this.provinces.forEach((v, i) => {
          if (this.selectIndustryType == v.name) {
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
    /*let markers = [];
    if (this.selectIndustryType) {
      this.provinces.forEach((v, i) => {
        if (this.selectIndustryType == v.name) {
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
    this.creatGlobal00Echart(markers);*/
  }
  ngOnDestroy() {
    this.selectLeadIndustrySubscription.unsubscribe();
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
