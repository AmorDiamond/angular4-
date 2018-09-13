import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { ADD_POLYGON } from '../../core/store-ngrx/amap.actions';
import { LandServiceService } from '../land-service.service';
import { UsePanelControlServiceService } from './use-panel-control-service.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { CHANGE_LOADING } from '../../core/loading-layer-ngrx/loading-layer.actions';


declare var AMap: any;

@Component({
  selector: 'app-use',
  templateUrl: './use.component.html',
  styleUrls: ['./use.component.css'],
  providers: [UsePanelControlServiceService]
})
export class UseComponent implements OnInit, OnDestroy {

  constructor(private http: HttpClient, private store: Store<any>,
              private landService: LandServiceService,
              private usePanelControlService: UsePanelControlServiceService,
              private router: Router,
              private routeInfo: ActivatedRoute) {
    this.store$ = this.store.pipe(select('gaodeMap'));
    this.loadLayerStore$ = this.store.pipe(select('loadingLayer'));
  }
  store$: any;
  loadLayerStore$: any;
  chartOption: any;
  echartsUrl = '';
  mapObj: any;
  dataPolygonPurposeCateLands = {'工业用地': [], '公共设施及其他用地': [], '科研用地': [], '商服用地': [], '住宅用地': [], '储备用地': []};
  polygonDrawLands = {lands: []};
  dataPolygonNatureLands: any;
  subscription: Subscription;
  subscriptionColor: Subscription;
  subscriptionDrawPolygon: Subscription;
  subscriptionNatureChooseColor: Subscription;
  panelControl = {overviewShow: true};
  colorListRight = '420px';
  colorListChooseStatus = {
    '工业用地': true,
    '公共设施及其他用地': true,
    '科研用地': true,
    '商服用地': true,
    '住宅用地': true,
    '储备用地': true
  };
  routeSubscription: Subscription;
  ngOnInit() {

    /*监听路由变化，避免切换路由数据不刷新*/
    this.routeSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        console.log('NavigationEnd:', event);
        /*判断回到土地用途路由*/
        if (event.url === '/land/use') {
          this.formatNatureLandData();
          /*恢复被点击的用地性质色块样式*/
          this.colorListChooseStatus = {
            '工业用地': true,
            '公共设施及其他用地': true,
            '科研用地': true,
            '商服用地': true,
            '住宅用地': true,
            '储备用地': true
          };
        }
      });

    this.store$.subscribe((res) => {
      this.mapObj = res.data.gaodeMap;
    });
    this.subscription = this.usePanelControlService.getPanelControl().subscribe(res => {
      console.log(res);
      this.panelControl = res;
    });
    this.subscriptionColor = this.usePanelControlService.getColorListControl().subscribe(res => {
      this.colorListRight = res;
    });
    this.subscriptionNatureChooseColor = this.usePanelControlService.getNatureColorListChooseStatus().subscribe(res => {
      // console.log(res);
      this.colorListChooseStatus = {
        '工业用地': res['工业用地'],
        '公共设施及其他用地': res['公共设施及其他用地'],
        '科研用地': res['科研用地'],
        '商服用地': res['商服用地'],
        '住宅用地': res['住宅用地'],
        '储备用地': res['储备用地']
      };
      // this.colorListChooseStatus = res;
      this.formatChooseNatureLandData();
    });
    this.subscriptionDrawPolygon = this.usePanelControlService.getDrawPolygonLandsStyleStatus().subscribe(res => {
      if (res) {
        const defaultBorderColor = this.landService.defaultBorderColor;
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
    /*this.getLnadData((res) => {
      this.store$.dispatch({
        type: ADD_POLYGON,
        payload: {
          action: 'ADD_POLYGON',
          data: res
        }
      });
    });*/
    /*绘制土地用途地块*/
    this.formatNatureLandData();
    this.creatLandAreaPropor({}, ['工业用地', '公共设施及其他', '科研用地', '商服用地', '住宅用地', '储备用地']);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionColor.unsubscribe();
    this.subscriptionDrawPolygon.unsubscribe();
  }
  getLnadData() {
    // const landUrl = '/v1/land/findAllHasType';
    const landUrlJson = '../ ../assets/jsonData/findAllHasType.json';
    const pointsArr = [];
    this.http.get(landUrlJson).subscribe((res: any) => {
      // console.log(res);
      for (let i = 0; i < res.length; i++) {
        if (!(res[i].generalType === '公共设施及其他用地' && res[i].unifiedLandMark.indexOf('5+2区域属性') > -1)) {
          // pointsArr.push(res[i].points);
          const point_x_y = [];
          // const pointItem = {id: '', position: '', inefficient: '', landArea: '', landUsrNature: ''};
          // const pointItem = {};
          const pointItem: any = {};
          for (let j = 0; j < res[i].points.length; j++) {
            point_x_y.push([res[i].points[j].point_80_x, res[i].points[j].point_80_y]);
          }
          pointItem.id = res[i].id;
          pointItem.unifiedLandMark = res[i].unifiedLandMark;
          pointItem.rightHolder = res[i].rightHolder;
          pointItem.actualUsers = res[i].actualUsers;
          pointItem.landCardNumber = res[i].landCardNumber;
          pointItem.landIsLocated = res[i].landIsLocated;
          pointItem.inefficient = res[i].inefficient;
          pointItem.generalType = res[i].generalType;
          /*实测面积*/
          pointItem.landArea = res[i].landArea;
          /*使用全面积*/
          pointItem.usageArea = res[i].usageArea;
          pointItem.landUsrNature = res[i].landUsrNature;
          pointItem.theRealFunction = res[i].theRealFunction;
          pointItem.governmentInvestment = res[i].governmentInvestment;
          pointItem.positions = point_x_y;
          pointsArr.push(pointItem);
        }
      }
      this.dataPolygonNatureLands = pointsArr;
      this.landService.setdataPolygonNatureLands(pointsArr);
      const indexedDBdata = {type: 'dataPolygonNatureLands', data: pointsArr};
      this.landService.indexeDBmethod.add('landData', indexedDBdata);
      this.creatNatureLandAgain(this.mapObj, pointsArr);
    });
  }
  /*处理土地用途地块数据用于绘制地块*/
  formatNatureLandData() {
    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: true
      }
    });
    const dataPolygonNatureLands = this.landService.getdataPolygonNatureLands();
    const dataPolygonInefficientLands = this.landService.getdataPolygonInefficientLands();

    this.mapObj.clearMap();
    this.landService.creatWestAreaLandRangeCj(this.mapObj, true);
    /*判断是否已存在土地用地数据*/
    if (dataPolygonNatureLands.length > 0 || dataPolygonInefficientLands.length > 0) {
      this.creatNatureLandAgain(this.mapObj, dataPolygonNatureLands.length > 0 ? dataPolygonNatureLands : dataPolygonInefficientLands);
    }else {
      this.landService.indexeDBmethod.byIndexGet('landData', 'dataPolygonNatureLands', (res) => {
        const dataPolygon = res ? res.data : [];
        this.dataPolygonNatureLands = dataPolygon;
        /*判断indexedDB是否存在数据*/
        if (dataPolygon.length > 0) {
          /*土地用途和低效用地使用的是同样的地块数据*/
          this.landService.setdataPolygonNatureLands(dataPolygon);
          this.landService.setdataPolygonInefficientLands(dataPolygon);
          this.creatNatureLandAgain(this.mapObj, dataPolygon);
        }else {
          this.getLnadData();
        }
      });
    }
  }
  /*土地用途--将已处理或缓存的数据绘制地图*/
  creatNatureLandAgain(map, dataOptions) {

    const defaultBorderColor = this.landService.defaultBorderColor;
    const defaultLandColor = this.landService.defaultLandColor;
    const selectedColor = this.landService.selectedColor;
    const selectedBorderColor = this.landService.selectedBorderColor;
    const defaultStrokeWeight = this.landService.defaultStrokeWeight;
    const selectedStrokeWeight = this.landService.selectedStrokeWeight;
    const defualtFillOpacity = this.landService.defualtFillOpacity;
    const colors = ['#07fff7', '#a57c52', '#2a8ab8', '#ff7eff', '#ff0000', '#ffd041', '#2a8ab8'];
    /*请求新数据将保存的单一分类数据清除(切换时间会再次请求)*/
    this.dataPolygonPurposeCateLands['工业用地'] = [];
    this.dataPolygonPurposeCateLands['公共设施及其他用地'] = [];
    this.dataPolygonPurposeCateLands['科研用地'] = [];
    this.dataPolygonPurposeCateLands['商服用地'] = [];
    this.dataPolygonPurposeCateLands['住宅用地'] = [];
    this.dataPolygonPurposeCateLands['储备用地'] = [];
    const newpointers = dataOptions;

    // landMenuInfoWindow(newpointers);
    let color;
    for (let i = 0; i < newpointers.length; i++) {

      if (newpointers[i].generalType === '储备用地') {
        // 保存的单一分类数据
        this.dataPolygonPurposeCateLands[newpointers[i].generalType].push(newpointers[i]);
        color = colors[0];
      }else if (newpointers[i].generalType === '工业用地') {
        // 保存的单一分类数据
        this.dataPolygonPurposeCateLands[newpointers[i].generalType].push(newpointers[i]);
        color = colors[1];
      }else if (newpointers[i].generalType === '公共设施及其他用地') {
        // 保存的单一分类数据
        this.dataPolygonPurposeCateLands[newpointers[i].generalType].push(newpointers[i]);
        color = colors[2];
      }else if (newpointers[i].generalType === '科研用地') {
        // 保存的单一分类数据
        this.dataPolygonPurposeCateLands[newpointers[i].generalType].push(newpointers[i]);
        color = colors[3];
      }else if (newpointers[i].generalType === '商服用地') {
        // 保存的单一分类数据
        this.dataPolygonPurposeCateLands[newpointers[i].generalType].push(newpointers[i]);
        color = colors[4];
      }else if (newpointers[i].generalType === '住宅用地') {
        // 保存的单一分类数据
        this.dataPolygonPurposeCateLands[newpointers[i].generalType].push(newpointers[i]);
        color = colors[5];
      }else {
        color = colors[6];
      }

      const polygonOptions = {
        map: map,
        strokeColor: defaultBorderColor,
        // strokeColor: color,
        strokeWeight: defaultStrokeWeight,
        fillColor: color,
        fillOpacity: defualtFillOpacity,
        /*strokeStyle: "dashed",
        strokeDasharray: [20,10],*/
        extData: {
          id: newpointers[i].id,
          inefficient: newpointers[i].inefficient,
          type: newpointers[i].type,
          landType: newpointers[i].landType,
          landCardNumber: newpointers[i].landCardNumber,
          landArea: newpointers[i].landArea,
          usageArea: newpointers[i].usageArea,
          /*按性质分类*/
          generalType: newpointers[i].generalType,
          landUsrNature: newpointers[i].landUsrNature,
          actualUsers: newpointers[i].actualUsers,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          theRealFunction: newpointers[i].theRealFunction,
          governmentInvestment: newpointers[i].governmentInvestment,
          color: color,
          borderColor: defaultBorderColor,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].positions;
      const polygonNatureLand = new AMap.Polygon(polygonOptions);
      polygonNatureLand.on('click', (e) => {
        /*看数据*/
        console.log(polygonNatureLand.getExtData());
        if (!polygonNatureLand.getExtData().slected) {
          const lanTitle = '';
          const landArea = polygonNatureLand.getExtData().landArea;
          const landUsrNature = polygonNatureLand.getExtData().landUsrNature;
          const that = polygonNatureLand;
          const unifiedLandMark = polygonNatureLand.getExtData().unifiedLandMark;

          // 在地图上改变当前点击的多边形
          for (let j = 0; j < this.polygonDrawLands.lands.length; j++) {
            if (this.polygonDrawLands.lands[j].getExtData().slected) {
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
          const newExtData = polygonNatureLand.getExtData();
          newExtData.slected = true;
          polygonNatureLand.setOptions({strokeColor: selectedBorderColor, strokeWeight: selectedStrokeWeight});
          polygonNatureLand.setExtData(newExtData);
          const options = {lanTitle: lanTitle, landArea: landArea, landUsrNature: landUsrNature, polygon: that};
          // landInfoWindowFn(map,options,"polygonNatureLands");
          /*单独请求低效用地数据*/
          // if (this.getExtData().inefficient) {
          //   getInefficientLandData(unifiedLandMark);
          // }
          // viewLandPanel(this.getExtData());
          this.router.navigate(['land/use/info', polygonNatureLand.getExtData().unifiedLandMark]);
        }
      });
      polygonNatureLand.on('mouseover', function(e){
      });
      polygonNatureLand.on('mouseout', function(e){
        // landInfoWindow.close()
      });
      // console.log(polygon)
      polygonNatureLand.setPath(pointers);
      this.polygonDrawLands.lands.push(polygonNatureLand);
    }
    map.setFitView();
    map.setZoom(14);

    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: false
      }
    });
  }
  /*概况用地性质占比图表*/
  creatLandAreaPropor(dataOptions, type) {
    const COLORS = ['#a57c52', '#2a8ab8', '#ff7eff', '#ff0000', '#ffd041', '#07fff7'];
    const options = {legendData: [], serverData: []};
    options.legendData = type;
    options.serverData = [
      {value: 28365, name: '工业用地'},
      {value: 17628, name: '公共设施及其他'},
      {value: 158.5, name: '科研用地'},
      {value: 1162.6, name: '商服用地'},
      {value: 4507, name: '住宅用地'},
      {value: 8427.9, name: '储备用地'}
    ];

    const legendData = options.legendData;
    const serverData = {serverData: options.serverData};
    this.chartOption = {
      color: COLORS,
      title : {
        text: '用地性质占比',
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
          name: '用地性质占比',
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
  }
  /*跳转到绘制所选择的用地性质地块路由*/
  goChooseNatureLand(type) {
    this.colorListChooseStatus[type] = !this.colorListChooseStatus[type];
    this.usePanelControlService.changeNatureColorListChooseStatus(this.colorListChooseStatus);
    this.mapObj.clearMap();
    this.landService.creatWestAreaLandRangeCj(this.mapObj);
    this.formatChooseNatureLandData();
    // this.router.navigate(['/land/use/naTurePropor'], {
    //   queryParams: {
    //     '工业用地': this.colorListChooseStatus['工业用地'],
    //     '公共设施及其他用地': this.colorListChooseStatus['公共设施及其他用地'],
    //     '科研用地': this.colorListChooseStatus['科研用地'],
    //     '商服用地': this.colorListChooseStatus['商服用地'],
    //     '住宅用地': this.colorListChooseStatus['住宅用地'],
    //     '储备用地': this.colorListChooseStatus['储备用地']
    //   }
    // });
    this.router.navigate(['/land/use/naTurePropor']);
  }
  /*绘制所选择用地性质的地块*/
  creatChooseNatureLandAgain(map, dataOptions, chooseType) {
    // console.log(chooseType);
    const defaultBorderColor = this.landService.defaultBorderColor;
    const defaultLandColor = this.landService.defaultLandColor;
    const selectedColor = this.landService.selectedColor;
    const selectedBorderColor = this.landService.selectedBorderColor;
    const defaultStrokeWeight = this.landService.defaultStrokeWeight;
    const selectedStrokeWeight = this.landService.selectedStrokeWeight;
    const defualtFillOpacity = this.landService.defualtFillOpacity;
    const colors = ['#07fff7', '#a57c52', '#2a8ab8', '#ff7eff', '#ff0000', '#ffd041', '#2a8ab8'];
    /*请求新数据将保存的单一分类数据清除(切换时间会再次请求)*/
    const newpointers = dataOptions;

    // landMenuInfoWindow(newpointers);
    let color;
    for (let i = 0; i < newpointers.length; i++) {
      for (let k = 0; k < chooseType.length; k++) {
        // console.log(chooseType[k]);
        if (newpointers[i].generalType === chooseType[k]) {
          if (newpointers[i].generalType === '储备用地') {
            // 保存的单一分类数据
            color = colors[0];
          }else if (newpointers[i].generalType === '工业用地') {
            // 保存的单一分类数据
            color = colors[1];
          }else if (newpointers[i].generalType === '公共设施及其他用地') {
            // 保存的单一分类数据
            color = colors[2];
          }else if (newpointers[i].generalType === '科研用地') {
            // 保存的单一分类数据
            color = colors[3];
          }else if (newpointers[i].generalType === '商服用地') {
            // 保存的单一分类数据
            color = colors[4];
          }else if (newpointers[i].generalType === '住宅用地') {
            // 保存的单一分类数据
            color = colors[5];
          }else {
            color = colors[6];
          }

          const polygonOptions = {
            map: map,
            strokeColor: defaultBorderColor,
            // strokeColor: color,
            strokeWeight: defaultStrokeWeight,
            fillColor: color,
            fillOpacity: defualtFillOpacity,
            /*strokeStyle: "dashed",
            strokeDasharray: [20,10],*/
            extData: {
              id: newpointers[i].id,
              inefficient: newpointers[i].inefficient,
              type: newpointers[i].type,
              landType: newpointers[i].landType,
              landCardNumber: newpointers[i].landCardNumber,
              landArea: newpointers[i].landArea,
              usageArea: newpointers[i].usageArea,
              /*按性质分类*/
              generalType: newpointers[i].generalType,
              landUsrNature: newpointers[i].landUsrNature,
              actualUsers: newpointers[i].actualUsers,
              unifiedLandMark: newpointers[i].unifiedLandMark,
              landIsLocated: newpointers[i].landIsLocated,
              rightHolder: newpointers[i].rightHolder,
              theRealFunction: newpointers[i].theRealFunction,
              governmentInvestment: newpointers[i].governmentInvestment,
              color: color,
              borderColor: defaultBorderColor,
              slected: false
            }
          };
          // 外多边形坐标数组和内多边形坐标数组
          const pointers = newpointers[i].positions;
          const polygonNatureLand = new AMap.Polygon(polygonOptions);
          polygonNatureLand.on('click', (e) => {
            /*看数据*/
            console.log(polygonNatureLand.getExtData());
            if (!polygonNatureLand.getExtData().slected) {
              const lanTitle = '';
              const landArea = polygonNatureLand.getExtData().landArea;
              const landUsrNature = polygonNatureLand.getExtData().landUsrNature;
              const that = polygonNatureLand;
              const unifiedLandMark = polygonNatureLand.getExtData().unifiedLandMark;

              // 在地图上改变当前点击的多边形
              for (let j = 0; j < this.polygonDrawLands.lands.length; j++) {
                if (this.polygonDrawLands.lands[j].getExtData().slected) {
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
              const newExtData = polygonNatureLand.getExtData();
              newExtData.slected = true;
              polygonNatureLand.setOptions({strokeColor: selectedBorderColor, strokeWeight: selectedStrokeWeight});
              polygonNatureLand.setExtData(newExtData);
              const options = {lanTitle: lanTitle, landArea: landArea, landUsrNature: landUsrNature, polygon: that};
              // landInfoWindowFn(map,options,"polygonNatureLands");
              /*单独请求低效用地数据*/
              // if (this.getExtData().inefficient) {
              //   getInefficientLandData(unifiedLandMark);
              // }
              // viewLandPanel(this.getExtData());
              this.router.navigate(['land/use/info', polygonNatureLand.getExtData().unifiedLandMark]);
            }
          });
          polygonNatureLand.on('mouseover', function(e){
          });
          polygonNatureLand.on('mouseout', function(e){
            // landInfoWindow.close()
          });
          // console.log(polygon)
          polygonNatureLand.setPath(pointers);
          this.polygonDrawLands.lands.push(polygonNatureLand);
        }
      }
    }
    map.setFitView();
    map.setZoom(14);
  }
  /*处理所选择用地性质的地块数据用于绘制地块*/
  formatChooseNatureLandData() {
    const chooseType = [];
    for (const i in this.colorListChooseStatus) {
      if (this.colorListChooseStatus[i]) {
        chooseType.push(i);
      }
    }

    const dataPolygonNatureLands = this.landService.getdataPolygonNatureLands();
    const dataPolygonInefficientLands = this.landService.getdataPolygonInefficientLands();

    this.mapObj.clearMap();
    this.landService.creatWestAreaLandRangeCj(this.mapObj);
    /*判断是否已存在土地用地数据*/
    if (dataPolygonNatureLands.length > 0 || dataPolygonInefficientLands.length > 0) {
      this.creatChooseNatureLandAgain(this.mapObj, dataPolygonNatureLands.length > 0 ? dataPolygonNatureLands : dataPolygonInefficientLands, chooseType);
    }else {
      this.landService.indexeDBmethod.byIndexGet('landData', 'dataPolygonNatureLands', (res) => {
        const dataPolygon = res ? res.data : [];
        this.dataPolygonNatureLands = dataPolygon;
        /*判断indexedDB是否存在数据*/
        if (dataPolygon.length > 0) {
          /*土地用途和低效用地使用的是同样的地块数据*/
          this.creatChooseNatureLandAgain(this.mapObj, dataPolygon, chooseType);
        }
      });
    }
  }
}
