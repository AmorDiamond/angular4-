import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ADD_INDUSTRY_MAP_POLYGON } from '../../../../core/amap-ngrx/amap.actions';
import { Amap } from '../../../../core/amap-ngrx/amap.model';
import { Store } from '@ngrx/store';
import { IndustryMapFenbuService } from '../industry-map-fenbu.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Component({
  selector: 'app-customize-industry-fenbu',
  templateUrl: './customize-industry-fenbu.component.html',
  styleUrls: ['./customize-industry-fenbu.component.css']
})
export class CustomizeIndustryFenbuComponent implements OnInit, OnDestroy {

  constructor(private storeAmap: Store<Amap>, private industryMapFenbuService: IndustryMapFenbuService, private toastyService: ToastyService) { }
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
    },
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
      "center": "104.092199,30.552204",
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
      "center": "104.171399,30.552204",
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
  totalOutputValueEchart: any;
  enterpriseScaleEchart: any;
  countryBaseEchart: any;
  importantEnterpriseEchart: any;
  global00Echart: any;
  selectCustomizeIndustry: any;
  selectCustomizeIndustrySubscription: Subscription;
  industryTypeList = [];
  addCustomizeTypeList = [];
  selectIndustryTypeList: any = {};
  addCustomizeTypeValue: any;
  testNum = 0;
  ngOnInit() {
    const industryTypeData = {
      '主导产业': ['信息技术', '生物', '装备', '节能环保', '服务'],
      '新兴产业': ['信息网络', '电子核心', '生物医药', '高端软件', '生物医学', '航空装备', '先进环保']
    };
    for (const item in industryTypeData) {
      if (item) {
        this.industryTypeList.push(item);
        this.industryTypeList[item] = industryTypeData[item];
        /*industryTypeData[item].forEach((v, i) => {
          // this.selectIndustryTypeList.push({type: industryTypeData[item], checked: false});
          this.selectIndustryTypeList[industryTypeData[item]] = false;
        });*/
      }
    }

    this.storeAmap.dispatch({
      type: ADD_INDUSTRY_MAP_POLYGON,
      payload: {
        action: 'ADD_INDUSTRY_MAP_POLYGON',
        data: {type: 'customizeIndustry', data: this.provinces}
      }
    });
    /*再次加载时取消之前选中的*/
    this.industryMapFenbuService.changeSelectCustomizeIndustry('');
    this.selectCustomizeIndustrySubscription = this.industryMapFenbuService.getSelectCustomizeIndustry().subscribe(res => {
      this.selectCustomizeIndustry = res.options;
      let markers = [];
      if (this.selectCustomizeIndustry) {
        this.provinces.forEach((v, i) => {
          if (this.selectCustomizeIndustry == v.name) {
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
    this.selectCustomizeIndustrySubscription.unsubscribe();
  }
  changeSelectType(type) {
    // this.selectIndustryTypeList[type] ? this.selectIndustryTypeList[type] = this.selectIndustryTypeList[type] : this.selectIndustryTypeList[type] = false;
    // this.selectIndustryTypeList[type] = !this.selectIndustryTypeList[type];
    console.log(this.selectIndustryTypeList);
  }
  submitSelectType() {
    const markers = [];
    for (const item in this.selectIndustryTypeList) {
      if (this.selectIndustryTypeList[item]) {
        this.provinces.forEach((v, i) => {
          if (item == v.name) {
            markers.push(this.provinces[i]);
          }
        });
      }
    }
    this.storeAmap.dispatch({
      type: ADD_INDUSTRY_MAP_POLYGON,
      payload: {
        action: 'ADD_INDUSTRY_MAP_POLYGON',
        data: {type: 'customizeIndustry', data: markers, updated: true}
      }
    });
    this.creatTotalOutputValueEchart(markers);
    this.creatEnterpriseScaleEchart(markers);
    this.creatCountryBaseEchart(markers);
    this.creatImportantEnterpriseEchart(markers);
    this.creatGlobal00Echart(markers);
  }
  resetSelectType() {
    for (const item in this.selectIndustryTypeList) {
      if (item) {
        this.selectIndustryTypeList[item] = false;
      }
    }
    this.storeAmap.dispatch({
      type: ADD_INDUSTRY_MAP_POLYGON,
      payload: {
        action: 'ADD_INDUSTRY_MAP_POLYGON',
        data: {type: 'customizeIndustry', data: this.provinces, updated: true}
      }
    });
    this.industryMapFenbuService.changeSelectCustomizeIndustry('');
  }
  addCustomizeType() {
    if (this.addCustomizeTypeValue) {
      if (this.addCustomizeTypeList.indexOf(this.addCustomizeTypeValue) > -1) {
        this.addToast('已存在' + this.addCustomizeTypeValue + '产业！');
        this.addCustomizeTypeValue = '';
        return;
      }
      this.addCustomizeTypeList.push(this.addCustomizeTypeValue);
      const newColor = this.bgColor();
      const newName = this.addCustomizeTypeValue;
      this.testNum++;
      const testNum = this.testNum;
      /*新增自定义数据*/
      this.provinces.push({
        "name": newName,
        "center": "104.0"+testNum+"568,30.5"+testNum+"6697",
        "type": 0,
        "radius": 1500,
        "color": newColor,
        "GDP": [Number(testNum+""+100), 2700, 3000, Number(2+""+testNum+""+100), Number(3+""+testNum+""+100)],
        "companyNum": [Number(2+""+testNum), 27, Number(3+""+testNum), 24, 33],
        "nationalLevel": [Number(2+""+testNum), 27, Number(3+""+testNum), 24, 33],
        "keyCompany": [Number(2+""+testNum), 27, Number(3+""+testNum), 24, 33],
        "baiQiang": [Number(2+""+testNum), 27, Number(3+""+testNum), 24, 33]
      })
      this.addCustomizeTypeValue = '';
    }
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
  /*随机生成16进制颜色代码*/
  bgColor() {
    return '#'+Math.floor(Math.random()*0xffffff).toString(16);
  }
  addToast(msg) {
    // Just add default Toast with title only
    // this.toastyService.default('Hi there');
    // Or create the instance of ToastOptions
    const toastOptions: ToastOptions = {
      title: '提示',
      msg: msg,
      showClose: true,
      timeout: 2000,
      // theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.warning(toastOptions);
  }

}
