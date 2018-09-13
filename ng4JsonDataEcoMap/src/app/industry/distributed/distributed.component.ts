import { Component, OnInit, OnDestroy } from '@angular/core';
import { DistributedPanelControlService } from './distributed-panel-control.service';
import { LandServiceService } from '../../land/land-service.service';
import { Subscription } from 'rxjs/Subscription';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {CHANGE_LOADING} from '../../core/loading-layer-ngrx/loading-layer.actions';
declare var AMap: any;

@Component({
  selector: 'app-distributed',
  templateUrl: './distributed.component.html',
  styleUrls: ['./distributed.component.css'],
  providers: [DistributedPanelControlService]
})
export class DistributedComponent implements OnInit, OnDestroy {

  constructor(private store: Store<any>,
              private router: Router,
              private http: HttpClient,
              private landService: LandServiceService,
              private distributedPanelControlService: DistributedPanelControlService) {
    this.store$ = this.store.pipe(select('gaodeMap'));
    this.loadLayerStore$ = this.store.pipe(select('loadingLayer'));
  }
  store$: any;
  loadLayerStore$: any;
  mapObj: any;
  subscription: Subscription;
  subscriptionColor: Subscription;
  subscriptionPanelControl: Subscription;
  subscriptionDrawPolygon: Subscription;
  panelControl = {overviewShow: true};
  colorListRight = '420px';
  polygonDrawLands = {lands: []};
  showSearchLayer = false;
  searchName: any;
  searchNameTitle: any;
  overviewData = {
    proportionEcharts:  null,
    livingArea: {area: 0, proportion: ''},
    electronArea: {area: 0, proportion: ''},
    makeArea: {area: 0, proportion: ''},
    otherArea: {area: 0, proportion: ''},
  }
  HighQualityListData: any = [];
  HighQualityEnterpriseListData: any = [];
  showRightPanel = false;
  hideRightPanel = true;
  searchEnterpriseLists: any = [];
  chooseSearchEnterpriseName: any;
  showBreakdownType = false;
  ngOnInit() {
    this.subscription = this.store$.subscribe(res => {
      this.mapObj = res.data.gaodeMap;
    });
    this.subscriptionPanelControl = this.distributedPanelControlService.getPanelControl().subscribe(res => {
      this.panelControl = res;
      if (res) {
        this.showRightPanel = false;
        this.hideRightPanel = true;
      }
    });
    this.subscriptionColor = this.distributedPanelControlService.getColorListControl().subscribe(res => {
      this.colorListRight = res;
    });
    this.subscriptionDrawPolygon = this.subscriptionDrawPolygon = this.distributedPanelControlService.getDrawPolygonLandsStyleStatus().subscribe(res => {
      if (res) {
        const defaultBorderColor = '#fff';
        const defaultStrokeWeight = this.landService.defaultStrokeWeight;
        for (let j = 0; j < this.polygonDrawLands.lands.length; j++) {
          if (this.polygonDrawLands.lands[j].getExtData().borderColor !== this.polygonDrawLands.lands[j].getOptions().strokeColor) {
            // if (this.polygonDrawLands.lands[j].getExtData().slected) {
            this.polygonDrawLands.lands[j].setOptions({
              strokeColor: defaultBorderColor,
              fillColor: this.polygonDrawLands.lands[j].getExtData().color,
              strokeWeight: defaultStrokeWeight
            });
            const oldExtData = this.polygonDrawLands.lands[j].getExtData(); // 先保存原始ExtData数据
            oldExtData.slected = false; // 改变之前选中的状态为false
            this.polygonDrawLands.lands[j].setExtData(oldExtData); // 更新之前选中的ExtData
            break;
          }
        }
      }
    });
    this.mapObj.clearMap();
    this.landService.creatWestAreaLandRangeCj(this.mapObj);
    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: true
      }
    });
    /*获取概况信息*/
    this.formatDistributedLandProporEchartsData();
    this.HighQualityListData = this.landService.getDistributedHighQualityListData();
    const time = new Date().getFullYear() - 1;
    /*判断是否存在按综合质量排名的企业列表*/
    if (this.HighQualityListData.length > 0) {
      this.searchIndustryCompanyList('生物医药', time);
    } else {
      // const url = '/v1/highQualityEvaluation/companyHighQuality2';
      const urlJson = '../../../assets/jsonData/companyHighQuality2.json';
      this.http.get(urlJson).subscribe(res => {
        this.HighQualityListData = res;
        this.landService.setDistributedHighQualityListData(res);
        this.searchIndustryCompanyList('生物医药', time);
      });
    }

    let dataPolygonDistributedLands = this.landService.getdataPolygonDistributedLands();
    if (dataPolygonDistributedLands.length > 0) {
      this.creatIndustryDistributedLandAgain(this.mapObj, dataPolygonDistributedLands);
    } else {
      this.landService.indexeDBmethod.byIndexGet('landData', 'dataPolygonDistributedLands', (res) => {
        const dbData = res;
        dataPolygonDistributedLands = dbData ? dbData.data : dataPolygonDistributedLands;
        if (dataPolygonDistributedLands.length > 0) {
          this.landService.setdataPolygonDistributedLands(dataPolygonDistributedLands);
          this.creatIndustryDistributedLandAgain(this.mapObj, dataPolygonDistributedLands);
        } else {
          const time = new Date().getFullYear() - 1;
          // creatEcoLand(map,time);
          const industryCat = ['生物医药', '电子信息', '先进制造'];
          let countNum = 0;
          const ecoLandCopy = [];
          const ecoLandList = [];
          for (let i = 0; i < industryCat.length; i++) {
            this.creatEcLandStep(this.mapObj, time, industryCat[i], (options) => {
              countNum++;
              ecoLandCopy.push(options);
              if (countNum === industryCat.length) {
                for (let i = 0; i < ecoLandCopy.length; i++) {
                  for (let j = 0; j < ecoLandCopy[i].length; j++) {
                    ecoLandList.push(ecoLandCopy[i][j]);
                  }
                }
                /*ecoLandList所有的梯度数据*/
                this.groupEcLandStep(this.mapObj, ecoLandList, () => {
                  this.searchIndustryCompanyList('生物医药', time);
                });
              }
              // map.setFitView();
              // map.setZoom(14);
            });
          }
        }
      });
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionColor.unsubscribe();
    this.subscriptionPanelControl.unsubscribe();
    this.subscriptionDrawPolygon.unsubscribe();
  }
  /*处理产业分布概况情况数据*/
  formatDistributedLandProporEchartsData() {
    /*生物医药面积*/
    const livingArea = 1512.70;
    /*电子信息面积*/
    const electronArea = 9317.34;
    /*先进制造面积*/
    const makeArea = 1548.33;
    /*总面积*/
    const totalArea = 17978.33;
    /*其他面积*/
    const otherArea = (totalArea - makeArea - electronArea - livingArea);
    this.overviewData.livingArea.area = livingArea;
    this.overviewData.electronArea.area = electronArea;
    this.overviewData.makeArea.area = makeArea;
    this.overviewData.otherArea.area = otherArea;

    this.overviewData.livingArea.proportion = ((livingArea / totalArea) * 100).toFixed(2);
    this.overviewData.electronArea.proportion = ((electronArea / totalArea) * 100).toFixed(2);
    this.overviewData.makeArea.proportion = ((makeArea / totalArea) * 100).toFixed(2);
    this.overviewData.otherArea.proportion = ((otherArea / totalArea) * 100).toFixed(2);
    const options = {
      legendData: ['生物总面积', '电子信息总面积', '先进制造总面积', '其他总面积'],
      seriesData: [
        {value: livingArea, name: '生物总面积'},
        {value: electronArea, name: '电子信息总面积'},
        {value: makeArea, name: '先进制造总面积'},
        {value: otherArea, name: '其他总面积'}
      ],
      title: '产业分布面积占比',
      seriesName: '面积占比',
      emId: 'chanye-fenbu-Proportion'
    };
    this.publicCreatLandAreaProportion(options);
  }
  /*绘制一个饼图图表*/
  publicCreatLandAreaProportion(options, type?) {
    const data = {legendData: options.legendData, seriesData: options.seriesData};
    const title = options.title;
    const seriesName = options.seriesName;
    /*options.legendData = type;
    options.serverData = [
      {value:28365, name:'工业用地'},
      {value:17628, name:'公共设施及其他'},
      {value:158.5, name:'科研用地'},
      {value:1162.6, name:'商服用地'},
      {value:4507, name:'住宅用地'},
      {value:8427.9, name:'储备用地'}
    ];*/

    const legendData = data.legendData;
    const seriesData = data.seriesData;
    const option = {
      // color: COLORS,
      title : {
        text: title,
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
        position: ['10%', '75%']
      },
      legend: {
        left: 'center',
        // data: ['国有企业','私营企业','外商投资企业','集体所有制企业','股份制企业'],
        data: legendData,
        textStyle: {
          color: '#333',
          fontSize: 14
        },
        top: 'bottom'
      },
      series : [
        {
          name: seriesName,
          type: 'pie',
          center : ['50%', '50%'],
          radius : '45%',
          /*data:[
              {value:335, name:'国有企业'},
              {value:1548, name:'私营企业'},
              {value:234, name:'外商投资企业'},
              {value:135, name:'集体所有制企业'},
              {value:154, name:'股份制企业'}
          ],*/
          data: seriesData,
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
    this.overviewData.proportionEcharts = option;
  }
  /*获取产业分布概况企业列表数据*/
  searchIndustryCompanyList(type, year) {
    const time = year;
    const tpl = '';
    const listTpl = '';
    const enterpriseType = type ? type : '生物医药';

    const lists = [];
    if (enterpriseType === '所有产业') {
      /*取出所选择时间的所有数据*/
      this.HighQualityListData.forEach(function(v, i){
        if (v.year === time) {
          lists.push(v);
        }
      });
    }else {
      /*取出所选择时间的以及所选择产业类型的数据*/
      this.HighQualityListData.forEach(function(v, i){
        if (Number(v.year) === time && v.companyIndustryType === enterpriseType) {
          lists.push(v);
        }
      });
    }
    this.HighQualityEnterpriseListData = lists;
  }
  /*产业分布--将已处理或缓存的数据绘制地图*/
  creatIndustryDistributedLandAgain(map, dataOptions) {
    // polygonEcoLands.lands=[];
    // /*请求新数据将保存的单一分类数据清除*/
    // dataPolygonEcoCateLands.living=[];
    // dataPolygonEcoCateLands.electron=[];
    // dataPolygonEcoCateLands.make=[];
    const defaultBorderColor = this.landService.defaultBorderColor;
    const defaultLandColor = this.landService.defaultLandColor;
    const selectedBorderColor = this.landService.selectedBorderColor;
    const defaultStrokeWeight = this.landService.defaultStrokeWeight;
    const selectedStrokeWeight = this.landService.selectedStrokeWeight;
    /*请求新数据将保存的单一分类数据清除*/
    this.polygonDrawLands.lands = [];
    const newpointers = dataOptions;
    /*1级*/
    const colors = ['#f61d1d', '#1139ff', '#51b706', '#c4ae8d', '#7d7dff'];
    const markerTextList = [];
    for (let i = 0; i < newpointers.length; i++) {
      let color = defaultLandColor;
      let borderColor = '#fff';
      let isIndustryLand = null;
      if (newpointers[i].actualUsers) {
        color = colors[3];
      }
      if ((newpointers[i].enterpriseType === '生物医药')) {
        // dataPolygonEcoCateLands.living.push(newpointers[i]);
        color = colors[0];
        isIndustryLand = true;
        // var color ="transparent"
      } else if (newpointers[i].enterpriseType === '电子信息') {
        // dataPolygonEcoCateLands.electron.push(newpointers[i]);
        color = colors[1];
        isIndustryLand = true;
      } else if (newpointers[i].enterpriseType === '先进制造') {
        // dataPolygonEcoCateLands.make.push(newpointers[i]);
        color = colors[2];
        isIndustryLand = true;
      }else {
        borderColor = defaultBorderColor;
      }
      const polygonOptions = {
        map: map,
        strokeColor: borderColor,
        // strokeColor: color,
        strokeWeight: defaultStrokeWeight,
        fillColor: color,
        fillOpacity: 0.8,
        /*strokeStyle: "dashed",
    strokeDasharray: [20,10],*/
        extData: {
          id: newpointers[i].id,
          ecoLv: newpointers[i].ecoLv,
          actualUsers: newpointers[i].actualUsers,
          pricepermeter: newpointers[i].pricepermeter,
          landCardNumber: newpointers[i].landCardNumber,
          landArea: newpointers[i].landArea,
          usageArea: newpointers[i].usageArea,
          /*按性质分类*/
          generalType: newpointers[i].generalType,
          enterpriseType: newpointers[i].enterpriseType,
          landUsrNature: newpointers[i].landUsrNature,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          color: color,
          borderColor: borderColor,
          isIndustryLand : isIndustryLand,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].positions;
      const polygonEcLand = new AMap.Polygon(polygonOptions);
      polygonEcLand.on('click', (e) => {
        /*看数据*/
        console.log(polygonEcLand.getExtData())
        if (!polygonEcLand.getExtData().slected) {
          const landArea = polygonEcLand.getExtData().landArea;
          const landUsrNature = polygonEcLand.getExtData().landUsrNature;
          const that = this;
          const unifiedLandMark = polygonEcLand.getExtData().unifiedLandMark;
          // 在地图上改变当前点击的多边形
          for (let i = 0; i < this.polygonDrawLands.lands.length; i++) {
            // if (polygonEcoLands.lands[i].getExtData().slected) {
            if (this.polygonDrawLands.lands[i].getExtData().borderColor !== this.polygonDrawLands.lands[i].getOptions().strokeColor) {
              this.polygonDrawLands.lands[i].setOptions({
                strokeColor: this.polygonDrawLands.lands[i].getExtData().borderColor,
                fillColor: this.polygonDrawLands.lands[i].getExtData().color,
                strokeWeight: defaultStrokeWeight
              });
              const oldExtData = this.polygonDrawLands.lands[i].getExtData(); // 先保存原始ExtData数据
              oldExtData.slected = false; // 改变之前选中的状态为false
              this.polygonDrawLands.lands[i].setExtData(oldExtData); // 更新之前选中的ExtData
              break;
            }
          }
          const newExtData = polygonEcLand.getExtData();
          newExtData.slected = true;
          polygonEcLand.setOptions({strokeColor: selectedBorderColor, strokeWeight: selectedStrokeWeight});
          polygonEcLand.setExtData(newExtData);
          const options = {
            // lanTitle: lanTitle,
            landArea: landArea,
            landUsrNature: landUsrNature,
            polygon: that
          };
          // landInfoWindowFn(map, options, "polygonEcLands");
          // viewIndustryLandPanel(this.getExtData())
          // this.getCompanyInfomations(polygonEcLand.getExtData().actualUsers);
          this.router.navigate(['industry/distributed/info', polygonEcLand.getExtData().actualUsers]);
        }
      })
      polygonEcLand.on('mouseover', function (e) {
        for (let i = 0; i < markerTextList.length; i++) {
          markerTextList[i].hide();
        }
        for (let i = 0; i < markerTextList.length; i++) {
          if (markerTextList[i].getExtData().landId === this.getExtData().id) {
            markerTextList[i].show();
          }
        }
      });
      polygonEcLand.on('mouseout', function (e) {
        // landInfoWindow.close()
        for (let i = 0; i < markerTextList.length; i++) {
          markerTextList[i].hide();
        }
      })
      // console.log(polygon)
      polygonEcLand.setPath(pointers);
      this.polygonDrawLands.lands.push(polygonEcLand);
      // localStorage.setItem('dataPolygonEcoCateLands', JSON.stringify(dataPolygonEcoCateLands));
      if ((newpointers[i].enterpriseType === '生物医药' || newpointers[i].enterpriseType === '电子信息' || newpointers[i].enterpriseType === '先进制造')) {
        const markerText = new AMap.Text({
          map: map,
          textAlign: 'center',
          text: '<div class="industry-fenbu-marker">' + polygonEcLand.getExtData().actualUsers + '</div>',
          position: polygonEcLand.getBounds().getCenter(),
          extData: {landId: polygonEcLand.getExtData().id}
        });
        markerText.on('click', (e) => {
          // 在地图上改变之前点击的多边形
          for (let i = 0; i < this.polygonDrawLands.lands.length; i++) {
            // if (polygonEcoLands.lands[i].getExtData().slected) {
            if (this.polygonDrawLands.lands[i].getExtData().borderColor !== this.polygonDrawLands.lands[i].getOptions().strokeColor) {
              this.polygonDrawLands.lands[i].setOptions({
                strokeColor: this.polygonDrawLands.lands[i].getExtData().borderColor,
                fillColor: this.polygonDrawLands.lands[i].getExtData().color,
                strokeWeight: defaultStrokeWeight
              });
              const oldExtData = this.polygonDrawLands.lands[i].getExtData(); // 先保存原始ExtData数据
              oldExtData.slected = false; // 改变之前选中的状态为false
              this.polygonDrawLands.lands[i].setExtData(oldExtData); // 更新之前选中的ExtData
              break;
            }
          }
          for (let i = 0; i < this.polygonDrawLands.lands.length; i++) {
            if (markerText.getExtData().landId === this.polygonDrawLands.lands[i].getExtData().id) {
              const newExtData = this.polygonDrawLands.lands[i].getExtData();
              newExtData.slected = true;
              this.polygonDrawLands.lands[i].setOptions({strokeColor: selectedBorderColor, strokeWeight: selectedStrokeWeight});
              this.polygonDrawLands.lands[i].setExtData(newExtData);

              // viewIndustryLandPanel(polygonEcoLands.lands[i].getExtData());
              // this.getCompanyInfomations(this.polygonDrawLands.lands[i].getExtData().actualUsers);
              this.router.navigate(['industry/distributed/info', this.polygonDrawLands.lands[i].getExtData().actualUsers]);
            }
          }
        });
        markerText.hide();
        markerTextList.push(markerText);
      }

    }
    map.setFitView();
    // map.panBy(-550, -40);
    map.setZoom(14);

    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: false
      }
    });
  }
  /*按分类分步获取园区经济梯度地块信息---产业分布菜单*/
  creatEcLandStep(map, time, type, callback) {
    const pointsArr = [];
    const choosePointsArr = [];
    const needPointsArr = [];
    // const url = '/v1/land/findCompanyByEnterpriseType?revenueTime=' + time + '&enterpriseType=' + type;
    const urlJson = '../../../assets/jsonData/findCompanyByEnterpriseType' + type + '.json';
    this.http.get(urlJson).subscribe((res: any) => {

      for (let i = 0; i < res.length; i++) {
        // pointsArr.push(res[i].points);
        const point_x_y = [];
        const pointItem: any = {id: '', position: '', enterpriseType: '', landArea: '', landUsrNature: ''};
        for (let j = 0; j < res[i].points.length; j++) {
          point_x_y.push([res[i].points[j].point_80_x, res[i].points[j].point_80_y]);
        }
        pointItem.id = res[i].id;
        pointItem.unifiedLandMark = res[i].unifiedLandMark;
        pointItem.rightHolder = res[i].rightHolder;
        pointItem.landIsLocated = res[i].landIsLocated;
        pointItem.enterpriseType = res[i].enterpriseType;
        pointItem.ecoLv = 1;
        pointItem.actualUsers = res[i].actualUsers;
        pointItem.pricepermeter = res[i].pricepermeter;
        pointItem.operatingIncome = res[i].operatingIncome;
        pointItem.landCardNumber = res[i].landCardNumber;
        /*按性质分类*/
        pointItem.generalType = res[i].generalType;
        /*实测面积*/
        pointItem.landArea = res[i].landArea;
        /*使用全面积*/
        pointItem.usageArea = res[i].usageArea;
        pointItem.landUsrNature = res[i].landUsrNature;
        pointItem.positions = point_x_y;
        pointItem.companyId = res[i].companyId;
        pointItem.companyIcon = res[i].companyIcon;
        pointItem.typeBreakdown = res[i].typeBreakdown;
        pointsArr.push(pointItem);
      }
      if (callback) {
        callback(pointsArr);
      }
    });

  }
  /*将分类分步获取园区经济梯度地块信息组装绘图---产业分布菜单*/
  groupEcLandStep(map, options, callback) {
    /*请求新数据将保存的地块对象清除*/
    this.polygonDrawLands.lands = [];
    /*请求新数据将保存的单一分类数据清除*/
    // dataPolygonEcoCateLands.living=[];
    // dataPolygonEcoCateLands.electron=[];
    // dataPolygonEcoCateLands.make=[];
    // dataPolygonEcoCateLands.other=[];
    // dataPolygonEcoCateLands.service=[];
    /*去除所有地块里含有经济等级的地块*/
    this.getParkAllPoints((allLandOptions) => {
      const allOptions = allLandOptions;
      for (let i = 0; i < options.length; i++) {
        for (let j = 0; j < allOptions.length; j++) {
          if (options[i].unifiedLandMark === allOptions[j].unifiedLandMark) {
            allOptions.splice(j, 1);
            break;
          }
        }
      }
      const dataPolygonEcoLands = allOptions.concat(options);

      // dataPolygonEcoLands = localStorage.setItem('dataPolygonEcoLands', JSON.stringify(dataPolygonEcoLands));
      this.landService.setdataPolygonDistributedLands(dataPolygonEcoLands);
      const indexedDBdata = {type: 'dataPolygonDistributedLands', data: dataPolygonEcoLands};
      this.landService.indexeDBmethod.add('landData', indexedDBdata);

      this.creatIndustryDistributedLandAgain(map, dataPolygonEcoLands);
    });
  }
  /*公共园区所有地块范围*/
  getParkAllPoints(callback) {
    const AllLandStart = +new Date();
    const pointsArr = [];
    // const url = '/v1/land/findAll';
    const urlJson = '../../../assets/jsonData/findAll.json';
    this.http.get(urlJson).subscribe((res: any) => {
      console.log('AllLandTime', (+new Date() - AllLandStart) / 1000);
      for (let i = 0; i < res.length; i++) {
        // pointsArr.push(res[i].points);
        const point_x_y = [];
        const pointItem: any = {id: '', position: '', inefficient: '', landArea: '', landUsrNature: ''};
        for (let j = 0; j < res[i].points.length; j++) {
          point_x_y.push([res[i].points[j].point_80_x, res[i].points[j].point_80_y]);
        }
        pointItem.id = res[i].id;
        pointItem.unifiedLandMark = res[i].unifiedLandMark;
        pointItem.rightHolder = res[i].rightHolder;
        pointItem.actualUsers = res[i].actualUsers;
        pointItem.landIsLocated = res[i].landIsLocated;
        pointItem.inefficient = res[i].inefficient;
        pointItem.isSingle = res[i].isSingle;
        pointItem.landCardNumber = res[i].landCardNumber;
        /*按性质分类*/
        pointItem.generalType = res[i].generalType;
        /*实测面积*/
        pointItem.landArea = res[i].landArea;
        /*使用全面积*/
        pointItem.usageArea = res[i].usageArea;
        pointItem.landUsrNature = res[i].landUsrNature;
        pointItem.positions = point_x_y;
        pointsArr.push(pointItem);
      }
      const dataPolygonAlls = pointsArr;
      if (callback) {
        callback(pointsArr);
      }else {
        return pointsArr;
      }
    });
  }
  /*搜索企业列表*/
  searchCompanyList() {
    this.showRightPanel = true;
    this.hideRightPanel = false;
    this.showSearchLayer = false;
    this.panelControl.overviewShow = false;
    this.colorListRight = '580px';
    this.searchNameTitle = this.searchName;
    const url = '/v1/company/findCompanyLikeName?name=' + this.searchName;
    this.http.get(url).subscribe(res => {
      this.searchName = '';
      this.searchEnterpriseLists = res;
    });
  }
  /*判断是否回车*/
  getEnterCode(event) {
    if (event.keyCode === 13 && this.searchName) {
      this.searchCompanyList();
    }
  }
  /*去企业详情*/
  goEnterpriseInfo(name) {
    this.showRightPanel = false;
    this.hideRightPanel = true;
    this.router.navigate(['/industry/distributed/info', name]);
  }
  /*点击搜索的企业列表标识地块*/
  markLandForCompany(name) {
    const defaultStrokeWeight = this.landService.defaultStrokeWeight;
    const selectedBorderColor = this.landService.selectedBorderColor;
    const selectedStrokeWeight = this.landService.selectedStrokeWeight;
    const company = name;
    this.chooseSearchEnterpriseName = company;
    // 在地图上改变之前点击的多边形
    for (let i = 0; i < this.polygonDrawLands.lands.length; i++) {
      if (this.polygonDrawLands.lands[i].getExtData().borderColor !== this.polygonDrawLands.lands[i].getOptions().strokeColor) {
        this.polygonDrawLands.lands[i].setOptions({
          strokeColor: this.polygonDrawLands.lands[i].getExtData().borderColor,
          fillColor: this.polygonDrawLands.lands[i].getExtData().color,
          strokeWeight: defaultStrokeWeight
        });
        const oldExtData = this.polygonDrawLands.lands[i].getExtData(); // 先保存原始ExtData数据
        oldExtData.slected = false; // 改变之前选中的状态为false
        this.polygonDrawLands.lands[i].setExtData(oldExtData) // 更新之前选中的ExtData
        // break;
      }
    }

    for (let i = 0; i < this.polygonDrawLands.lands.length; i++) {
      if (this.polygonDrawLands.lands[i].getExtData().actualUsers === company) {
        const newExtData = this.polygonDrawLands.lands[i].getExtData();
        // newExtData.slected = true;
        this.polygonDrawLands.lands[i].setOptions({strokeColor: selectedBorderColor, strokeWeight: selectedStrokeWeight});
        this.polygonDrawLands.lands[i].setExtData(newExtData);

        const centerBounds = this.polygonDrawLands.lands[i].getBounds();
        // map.setCenter(centerPositon);
        this.mapObj.setBounds(centerBounds);
      }
    }
  }
  /*点击产业类型判断绘制地块*/
  creatChooseTypeLand(cateType) {
    this.showBreakdownType = !this.showBreakdownType;
    const category = cateType;
    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: true
      }
    });
    this.mapObj.clearMap();
    this.landService.creatWestAreaLandRangeCj(this.mapObj);
    let dataPolygonDistributedLands = this.landService.getdataPolygonDistributedLands();
    if (dataPolygonDistributedLands.length > 0) {
      if (this.showBreakdownType) {
        this.creatBreakdownTypeLand(this.mapObj, category, dataPolygonDistributedLands);
      }else {
        this.creatIndustryDistributedLandAgain(this.mapObj, dataPolygonDistributedLands);
      }
    } else {
      this.landService.indexeDBmethod.byIndexGet('landData', 'dataPolygonDistributedLands', (res) => {
        const dbData = res;
        dataPolygonDistributedLands = dbData ? dbData.data : dataPolygonDistributedLands;
        if (dataPolygonDistributedLands.length > 0) {
          this.landService.setdataPolygonDistributedLands(dataPolygonDistributedLands);
          if (this.showBreakdownType) {
            this.creatBreakdownTypeLand(this.mapObj, category, dataPolygonDistributedLands);
          }else {
            this.creatIndustryDistributedLandAgain(this.mapObj, dataPolygonDistributedLands);
          }
        }
      });
    }
  }
  /*绘制下级类型地块*/
  creatBreakdownTypeLand(map, category, dataPolygon) {
    const defaultLandColor = this.landService.defaultLandColor;
    const defaultBorderColor = this.landService.defaultBorderColor;
    const defaultStrokeWeight = this.landService.defaultStrokeWeight;
    const selectedBorderColor = this.landService.selectedBorderColor;
    const selectedStrokeWeight = this.landService.selectedStrokeWeight;
    this.polygonDrawLands.lands = [];
    const newpointers = dataPolygon;
    /*1级*/
    const colors = ['#1261ff', '#12bcff', '#88f3ff', '#aad8dc', '#c4ae8d'];
    for (let i = 0; i < newpointers.length; i++) {

      let color = defaultLandColor;
      let borderColor = '#fff';
      let isIndustryLand = null;

      if (category === newpointers[i].enterpriseType) {
        if ((newpointers[i].typeBreakdown === '网络通信')) {
          color = colors[0];
          isIndustryLand = true;
          // var color ="transparent"
        } else if (newpointers[i].typeBreakdown === '集成电路') {
          color = colors[1];
          isIndustryLand = true;
        } else if (newpointers[i].typeBreakdown === '智能终端') {
          color = colors[2];
          isIndustryLand = true;
        } else if (newpointers[i].typeBreakdown === '新型显示') {
          color = colors[3];
          isIndustryLand = true;
        }else {
          borderColor = defaultBorderColor;
        }
      }else {
        borderColor = defaultBorderColor;
      }
      const polygonOptions = {
        map: map,
        strokeColor: borderColor,
        // strokeColor: color,
        strokeWeight: defaultStrokeWeight,
        fillColor: color,
        fillOpacity: 0.8,
        /*strokeStyle: "dashed",
    strokeDasharray: [20,10],*/
        extData: {
          id: newpointers[i].id,
          ecoLv: newpointers[i].ecoLv,
          actualUsers: newpointers[i].actualUsers,
          pricepermeter: newpointers[i].pricepermeter,
          landCardNumber: newpointers[i].landCardNumber,
          landArea: newpointers[i].landArea,
          usageArea: newpointers[i].usageArea,
          /*按性质分类*/
          generalType: newpointers[i].generalType,
          enterpriseType: newpointers[i].enterpriseType,
          landUsrNature: newpointers[i].landUsrNature,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          color: color,
          borderColor: borderColor,
          isIndustryLand : isIndustryLand,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].positions;
      const polygonEcLand = new AMap.Polygon(polygonOptions);
      polygonEcLand.on('click', (e) => {
        /*看数据*/
        console.log(polygonEcLand.getExtData())
        if (!polygonEcLand.getExtData().slected) {
          const landArea = polygonEcLand.getExtData().landArea;
          const landUsrNature = polygonEcLand.getExtData().landUsrNature;
          const that = polygonEcLand;
          const unifiedLandMark = polygonEcLand.getExtData().unifiedLandMark;
          // 在地图上改变当前点击的多边形
          for (let i = 0; i < this.polygonDrawLands.lands.length; i++) {
            // if (polygonEcoLands.lands[i].getExtData().slected) {
            if (this.polygonDrawLands.lands[i].getExtData().borderColor !== this.polygonDrawLands.lands[i].getOptions().strokeColor) {
              this.polygonDrawLands.lands[i].setOptions({
                strokeColor: this.polygonDrawLands.lands[i].getExtData().borderColor,
                fillColor: this.polygonDrawLands.lands[i].getExtData().color,
                strokeWeight: defaultStrokeWeight
              });
              const oldExtData = this.polygonDrawLands.lands[i].getExtData(); // 先保存原始ExtData数据
              oldExtData.slected = false; // 改变之前选中的状态为false
              this.polygonDrawLands.lands[i].setExtData(oldExtData) // 更新之前选中的ExtData
              // break;
            }
          }
          const newExtData = polygonEcLand.getExtData();
          newExtData.slected = true;
          polygonEcLand.setOptions({strokeColor: selectedBorderColor, strokeWeight: selectedStrokeWeight});
          polygonEcLand.setExtData(newExtData);
          const options = {
            landArea: landArea,
            landUsrNature: landUsrNature,
            polygon: that
          };
          // landInfoWindowFn(map, options, "polygonEcLands");
          this.router.navigate(['industry/distributed/info', polygonEcLand.getExtData().actualUsers]);
        }
      });
      // console.log(polygon)
      polygonEcLand.setPath(pointers);
      this.polygonDrawLands.lands.push(polygonEcLand);

    }
    map.setFitView();
    // map.panBy(-550, -40);
    map.setZoom(14);
    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: false
      }
    });
  }
  /*改变右侧内容面板显隐*/
  changeRightPanelShow() {
    this.showRightPanel = !this.showRightPanel;
    this.panelControl.overviewShow = this.showRightPanel ?  false : true;
    this.colorListRight = this.showRightPanel ? '580px' : '420px';
  }
}
