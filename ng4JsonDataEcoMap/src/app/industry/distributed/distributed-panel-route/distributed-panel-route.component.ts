import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { DistributedPanelControlService } from '../distributed-panel-control.service';
import { CHANGE_LOADING } from '../../../core/loading-layer-ngrx/loading-layer.actions';
import { HttpClient } from '@angular/common/http';
import { Store,select } from '@ngrx/store';

@Component({
  selector: 'app-distributed-panel-route',
  templateUrl: './distributed-panel-route.component.html',
  styleUrls: ['./distributed-panel-route.component.css']
})
export class DistributedPanelRouteComponent implements OnInit, OnDestroy {

  constructor(private routeInfo: ActivatedRoute,
              private distributedPanelControlService: DistributedPanelControlService,
              private http: HttpClient,
              private loadLayerStore: Store<any>) {
    this.loadLayerStore$ = this.loadLayerStore.pipe(select('loadingLayer'));
  }
  routeSubscription: Subscription;
  loadLayerStore$: any;
  companyName: any;
  showRightPanel = false;
  inefficientLandData = null;
  showCompanyDetailTab = 1;
  showCompanyDetail = true;
  panelControl = {overviewShow: true}
  landData: any;
  companyData: any;
  companyEvaluateEcharts: any;
  companyChanzhiEnergyEcharts: any;
  landUsePurposeData = {
    landEcharts: null,
    noUseProportions: '',
    useProportions: '',
    chooseLandTypeName: ''
  };
  ngOnInit() {
    /*监听路由变化，避免切换路由数据不刷新*/
    this.routeSubscription = this.routeInfo.params.subscribe((params: Params) => {
      this.companyName = params['name'];
      this.showRightPanel = true;
      console.log(this.showRightPanel);
      this.distributedPanelControlService.changePanelControl(false);
      this.distributedPanelControlService.changeColorListControl('580px');
      this.inefficientLandData = null;
      this.getCompanyInfo(this.companyName);
      // this.restPanelShowControl();
    });
  }
  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.distributedPanelControlService.changePanelControl(true);
    this.distributedPanelControlService.resetDrawPolygonLandsStyleStatus();
    this.distributedPanelControlService.changeColorListControl('420px');
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
  /*初始化界面显隐控制*/
  restPanelShowControl() {
    /*恢复显示企业详情基本信息*/
    this.showCompanyDetailTab = 1;
    /*隐藏企业详情面板*/
    this.showCompanyDetail = false;
    /*显示地块数据信息*/
    this.panelControl.overviewShow = true;
  }

}
