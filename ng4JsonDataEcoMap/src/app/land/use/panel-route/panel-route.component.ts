import { Component, OnInit, OnDestroy } from '@angular/core';
import {Route, ActivatedRoute, Params} from '@angular/router';
import { UsePanelControlServiceService } from '../use-panel-control-service.service';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import { LandServiceService } from '../../land-service.service';
import { Store, select } from '@ngrx/store';
import { CHANGE_LOADING } from '../../../core/loading-layer-ngrx/loading-layer.actions';

@Component({
  selector: 'app-panel-route',
  templateUrl: './panel-route.component.html',
  styleUrls: ['./panel-route.component.css']
})
export class PanelRouteComponent implements OnInit, OnDestroy {

  constructor(private routeInfo: ActivatedRoute,
              private usePanelControlService: UsePanelControlServiceService,
              private landService: LandServiceService,
              private http: HttpClient,
              private loadLayerStore: Store<any>) {
    this.loadLayerStore$ = loadLayerStore.pipe(select('loadingLayer'));
  }
  loadLayerStore$: any;
  routeSubscription: Subscription;
  landId: any;
  showRightPanel = true;
  showCompanyDetail = false;
  showCompanyDetailTab = 1;
  landData: any;
  inefficientLandData: any;
  companyData: any;
  companyEvaluateEcharts: any;
  companyChanzhiEnergyEcharts: any;
  landUsePurposeData = {
    aboutNowType: {
      title: '',
      landEcharts: {},
      otherProportion: '',
      nowProportion: ''
    },
    aboutWestLand: {
      title: '',
      landEcharts: {},
      otherProportion: '',
      nowProportion: ''
    },
    chooseLandTypeName: ''
  };
  ngOnInit() {
    // this.landId = this.routeInfo.snapshot.params['id'];
    /*监听路由变化，避免切换路由数据不刷新*/
    this.routeSubscription = this.routeInfo.params.subscribe((params: Params) => {
      this.landId = params['id'];
      this.showRightPanel = true;
      console.log(this.showRightPanel);
      this.usePanelControlService.changePanelControl(false);
      this.usePanelControlService.changeColorListControl('580px');
      this.inefficientLandData = null;
      this.getLandInfo(this.landId);
      this.restPanelShowControl();
    });
  }
  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.usePanelControlService.changePanelControl(true);
    // this.usePanelControlService.resetDrawPolygonLandsStyleStatus();
    this.usePanelControlService.changeColorListControl('420px');
  }
  /*获取地块数据*/
  getLandInfo(markId) {

    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: true
      }
    });
    // const url = '/v1/land/findOneByMark?mark=' + markId;
    const urlJson = '../../../assets/jsonData/findOneByMark1.json';
    this.http.get(urlJson).subscribe((res: any) => {
      console.log(res.land);
      this.landData = res.land;
      /*判断是否储备用地,获取占比图表*/
      if (res.land.landUsrNature && res.land.landUsrNature !== '储备用地') {
        const dataPolygonNatureLands = this.landService.getdataPolygonNatureLands();
        const dataPolygonInefficientLands = this.landService.getdataPolygonInefficientLands();
        /*判断是否已存在土地用地数据--在组装用地占比数据需要使用所有地块的数据计算*/
        if (dataPolygonNatureLands.length > 0 || dataPolygonInefficientLands.length > 0) {
          const dataPolygon = dataPolygonNatureLands.length > 0 ? dataPolygonNatureLands : dataPolygonInefficientLands;
          this.getLandUseAreaData(res.land, dataPolygon);
        }else {
          this.landService.indexeDBmethod.byIndexGet('landData', 'dataPolygonNatureLands', (result) => {
            const dataPolygon = result ? result.data : [];
            /*判断indexedDB是否存在数据*/
            if (dataPolygon.length > 0) {
              this.getLandUseAreaData(res.land, dataPolygon);
            }
          });
        }
      }
      /*判断是否低效用地*/
      if (res.land.inefficient) {
        this.getInefficientLandInfo(res.land.unifiedLandMark);
      }
    });
  }
  /*处理地块用途占比数据渲染图表*/
  getLandUseAreaData(options, allLandData) {
    const landData = options;
    landData.landUsrNature = landData.generalType ? landData.generalType : landData.landUsrNature;

      // const dataPolygonInefficientLands = this.landService.getdataPolygonInefficientLands();
      // const allLand = dataPolygonNatureLands.length > 0 ? dataPolygonNatureLands : dataPolygonInefficientLands;
      const allLand = allLandData;
      // var allUseLand = [];
      let allUseLandArea = 0; // 所有已使用地块面积
      let otherTypeUseLandArea = 0; // 其他已使用地块面积
      const nowTypeLandNum = []; // 当前类型地块数量
      let nowTypeLandArea = 0; // 当前类型地块的所有面积
      let nowLandArea = 0; // 当前地块的面积
      let otherSingleUseLandArea = 0; // 当前类型其他面积
      if (landData.inefficient) {
        allLand.forEach(function(v, i){
          // if(v.generalType != "储备用地"){
          // allUseLand.push(v);
          if (v.inefficient) {
            allUseLandArea += Number(v.landArea);
          }
          // }
          if (v.generalType === landData.landUsrNature && v.inefficient) {
            nowTypeLandNum.push(v);
            nowTypeLandArea += Number(v.landArea);
          }
        });
      }else {
        allLand.forEach(function(v, i){
          // if(v.generalType != "储备用地"){
          // allUseLand.push(v);
          allUseLandArea += Number(v.landArea);
          // }
          if (v.generalType === landData.landUsrNature) {
            nowTypeLandNum.push(v);
            nowTypeLandArea += Number(v.landArea);
          }
        });
      }
      /*避免点击的地块不是低效用地，导致该类型地块无数据*/
      if (nowTypeLandNum.length > 0) {
        nowTypeLandNum.forEach(function(v, i){
          if (v.id === landData.id) {
            nowLandArea = Number(v.landArea);
          }
        });
      }else {
        nowLandArea = 0;
        nowTypeLandArea = 0;
      }
      console.log(allUseLandArea);
      // allUseLandArea = (allUseLandArea / 666).toFixed(2);
      // nowTypeLandArea = (nowTypeLandArea / 666).toFixed(2);
      // nowLandArea = (nowLandArea / 666).toFixed(2);
      allUseLandArea = Number((allUseLandArea / 666).toFixed(2));
      nowTypeLandArea = Number((nowTypeLandArea / 666).toFixed(2));
      nowLandArea = Number((nowLandArea / 666).toFixed(2));
      otherTypeUseLandArea = (allUseLandArea - nowLandArea);
      otherSingleUseLandArea = (nowTypeLandArea - nowLandArea);
      const otherTypeProportion = (otherTypeUseLandArea / allUseLandArea) * 100;
      const nowTypeProportion = (nowLandArea / allUseLandArea) * 100;
      const otherSingleProportion = (otherSingleUseLandArea / nowTypeLandArea) * 100;
      const nowSigleProportion = (nowLandArea / nowTypeLandArea) * 100;
      let leftText = '';
      let rightText = '';
      if (landData.inefficient) {
        leftText = '地块占低效总比';
        rightText = '地块占本类低效占比';
      }else {
        leftText = '所选地块占西区土地占比';
        rightText = '所选地块占本类土地占比';
      }
      this.landUsePurposeData.aboutNowType.title = rightText;
      this.landUsePurposeData.aboutNowType.otherProportion = otherSingleProportion.toFixed(2) + '%';
      this.landUsePurposeData.aboutNowType.nowProportion = nowSigleProportion.toFixed(2) + '%';
      this.landUsePurposeData.aboutWestLand.title = leftText;
      this.landUsePurposeData.aboutWestLand.otherProportion = otherTypeProportion.toFixed(2) + '%';
      this.landUsePurposeData.aboutWestLand.nowProportion = nowTypeProportion.toFixed(2) + '%';
      this.landUsePurposeData.chooseLandTypeName = landData.landUsrNature;

    this.creatLandPropor({legendData: ['所选地块', '其他西区用地'], serverData: [{value: nowLandArea, name: '所选地块'}, {value: otherTypeUseLandArea, name: '其他西区用地'}
      ]});
    this.creatLandPropor2({legendData: ['所选地块', `其他${landData.landUsrNature}`], serverData: [{value: nowLandArea, name: '所选地块'}, {value: otherSingleUseLandArea, name: `其他${landData.landUsrNature}`}
      ]});

    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: false
      }
    });
  }
  /*创建地块占比饼图*/
  creatLandPropor(options) {
    const legendData = options.legendData;
    const serverData = {serverData: options.serverData};
    const option = {
      // color: COLORS,
      title : {
        // text: '用地性质占比',
        x: 'center',
        textStyle: {
          color: '#333',
          fontSize: 16
        },
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        position: ['-10%', '65%']
      },
      legend: {
        left: 'center',
        // data: ['国有企业','私营企业','外商投资企业','集体所有制企业','股份制企业'],
        data: legendData,
        textStyle: {
          color: '#333',
          fontSize: 14
        },
        // top: '10%'
      },
      series : [
        {
          name: '用地性质占比',
          type: 'pie',
          center : ['50%', '40%'],
          radius : '45%',
          /*data:[
              {value:335, name:'国有企业'},
              {value:1548, name:'私营企业'},
              {value:234, name:'外商投资企业'},
              {value:135, name:'集体所有制企业'},
              {value:154, name:'股份制企业'}
          ],*/
          data: serverData.serverData,
          label: {
            normal: {
              show: true
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
    this.landUsePurposeData.aboutWestLand.landEcharts = option;
  }
  /*创建地块占比饼图*/
  creatLandPropor2(options) {
    const legendData = options.legendData;
    const serverData = {serverData: options.serverData};
    const option = {
      // color: COLORS,
      title : {
        // text: '用地性质占比',
        x: 'center',
        textStyle: {
          color: '#333',
          fontSize: 16
        },
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        position: ['50%', '65%']
      },
      legend: {
        left: 'center',
        // data: ['国有企业','私营企业','外商投资企业','集体所有制企业','股份制企业'],
        data: legendData,
        textStyle: {
          color: '#333',
          fontSize: 14
        },
        // top: '10%'
      },
      series : [
        {
          name: '用地面积占比',
          type: 'pie',
          center : ['50%', '40%'],
          radius : '45%',
          /*data:[
              {value:335, name:'国有企业'},
              {value:1548, name:'私营企业'},
              {value:234, name:'外商投资企业'},
              {value:135, name:'集体所有制企业'},
              {value:154, name:'股份制企业'}
          ],*/
          data: serverData.serverData,
          label: {
            normal: {
              show: true
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
    this.landUsePurposeData.aboutNowType.landEcharts = option;
  }
  /*获取低效用地数据*/
  getInefficientLandInfo(unifiedLandMark) {
    const url = '/v1/land/findOneByMark?mark=' + unifiedLandMark;
    this.http.get(url).subscribe((res: any) => {
      const inefficientData = res.low[0];
      /*如果有低效用地信息*/
      if (inefficientData && inefficientData.length > 0) {
        this.inefficientLandData = inefficientData;
      }
    });
  }
  /*获取公司详情*/
  getCompanyInfo(name) {
    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: true
      }
    });
    // const url = '/v1/company/findCompanyByName?name=' + name;
    const urlJson = '../../../assets/jsonData/findCompanyByName.json';
    this.http.get(urlJson).subscribe((res: any) => {
      console.log(res);
      this.showCompanyDetail = true;
      this.showRightPanel = false;
      this.companyData = res.company;
      this.creatCompanyEvaluateEcharts(res.obj);
      this.creatCompanyChanzhiEnergyEcharts(res.company.chains);

      this.loadLayerStore$.dispatch({
        type: CHANGE_LOADING,
        payload: {
          status: false
        }
      });
    });
    this.getCompanyPatents(name);
    this.getCompanyRelyUnit(name);
  }
  /*组装企业综合评价图表数据*/
  creatCompanyEvaluateEcharts(options) {
    const legendData = [];
    const indicatorData = [];
    const seriesData = [];
    const copyObj = {};
    /*获取数据里的年份,避免数据没有年份*/
    for (const v in options) {
      if (v) {
        for (const i in options[v]) {
          if (!copyObj[i]) {
            copyObj[i] = [];
          }
        }
      }
    }

    for (const value in options) {
      /*给没有年份的数据赋值0*/
      if (value) {
        for (const year in copyObj) {
          if (!options[value][year]) {
            options[value][year] = 0;
          }
        }
        /*根据年份分组数据*/
        for (const i in options[value]) {
          if (i) {
            copyObj[i].push(options[value][i]);
            legendData.push(i);
          }
        }
        indicatorData.push({name: value, min: 0});
      }
    }
    /*将分组处理的数据处理为图表数据*/
    for (const i in copyObj) {
      if (i) {
        seriesData.push({value: copyObj[i], name: i});
      }
    }
    const option = {
      title: {
        text: '企业综合评价',
        left: 'center'
      },
      tooltip: {
        position: ['20%', '80%'],
      },
      legend: {
        data: legendData,
        top: '10%'
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: indicatorData,
        radius: '50%',
        center: ['50%', '60%']
      },
      series: [{
        name: '企业综合评价',
        type: 'radar',
        // areaStyle: {normal: {}},
        data : seriesData
      }]
    };
    // 使用刚指定的配置项和数据显示图表。
    this.companyEvaluateEcharts = option;
  }
  /*组装企业经济能耗图表数据*/
  creatCompanyChanzhiEnergyEcharts(options) {
    const legendData = ['营业收入', '产值', '能耗'];
    let xAxisData = [];
    const seriesData = [
      {
        name: '营业收入',
        type: 'line',
        data: []
      },
      {
        name: '产值',
        type: 'line',
        data: []
      },
      {
        name: '能耗',
        type: 'line',
        yAxisIndex: 1,
        data: []
      }
    ];
    // const tu1 = JSON.parse(options.income);
    const tu1 = options;
    // tu1.sort(compareFn('year'));
    for (let i = 0; i < tu1.length; i++) {
      if (tu1[i].year !== String(new Date().getFullYear())) {
        seriesData[0].data.push(tu1[i].mainIncome);
        seriesData[1].data.push(tu1[i].outputValue);
        seriesData[2].data.push(tu1[i].energyConsumption);
        xAxisData.push(tu1[i].year);
      }
    }
    /*7年*/
    /*if (seriesData[0].data.length > 7) {
      seriesData[0].data = seriesData[0].data.slice(seriesData[0].data.length - 7, seriesData[0].data.length);
      xAxisData = xAxisData.slice(xAxisData.length - 7, xAxisData.length);
    }*/
    if (xAxisData.length > 7) {
      xAxisData = xAxisData.slice(xAxisData.length - 7, xAxisData.length);
    }
    for (let i = 0; i < seriesData.length; i++) {
      if (seriesData[i].data.length > 7) {
        seriesData[i].data = seriesData[i].data.slice(seriesData[i].data.length - 7, seriesData[i].data.length);
      }
    }
    /*for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }*/

    const option = {
      title: {
        text: '经济与能耗',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: legendData,
        left: 'center',
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      },
      yAxis: [{
        name: '万',
        type: 'value'
      }, {
        name: '吨煤',
        type: 'value'
      }],
      series: seriesData
    };
    // 使用刚指定的配置项和数据显示图表。
    this.companyChanzhiEnergyEcharts = option;
  }
  /*获取企业专利数据*/
  getCompanyPatents(name) {
    // const url = '/v1/company/findCompanyParam?companyName=' + name;
    const urlJson = '../../../assets/jsonData/findCompanyParam.json';
    this.http.get(urlJson).subscribe((res: any) => {
      this.companyData.patentsInfo = res.patent;
    });
  }
  /*获取企业所属机构数据*/
  getCompanyRelyUnit(name) {
    const url = '/v1/researchInstitutions/getByRelyUnit?companyName=' + name;
    this.http.get(url).subscribe((res: any) => {
      this.companyData.companyRelyUnit = res;
    });
  }
  /*改变右侧内容面板显隐*/
  changeRightPanelShow() {
    this.showRightPanel = !this.showRightPanel;
    const type = this.showRightPanel ?  false : true;
    this.usePanelControlService.changePanelControl(type);
    const colorListRight = this.showRightPanel ? '580px' : '420px';
    this.usePanelControlService.changeColorListControl(colorListRight);
  }
  /*初始化界面显隐控制*/
  restPanelShowControl() {
    /*恢复显示企业详情基本信息*/
    this.showCompanyDetailTab = 1;
    /*隐藏企业详情面板*/
    this.showCompanyDetail = false;
    /*显示地块数据信息*/
    this.showRightPanel = true;
  }

}
