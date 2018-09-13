import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select} from '@ngrx/store';
import { gaodeAmap } from '../../core/map-obj-ngrx/amap.model';
import { HttpClient } from '@angular/common/http';
import { LandServiceService } from '../land-service.service';
import { InefficientPanelControlServiceService } from './inefficient-panel-control-service.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { CHANGE_LOADING } from '../../core/loading-layer-ngrx/loading-layer.actions';

declare var AMap: any;

@Component({
  selector: 'app-inefficient',
  templateUrl: './inefficient.component.html',
  styleUrls: ['./inefficient.component.css'],
  providers: [InefficientPanelControlServiceService]
})
export class InefficientComponent implements OnInit, OnDestroy {

  constructor(private http: HttpClient, private store: Store<gaodeAmap>,
              private loadLayerStore: Store<any>,
              private landService: LandServiceService,
              private inefficientPanelControlService: InefficientPanelControlServiceService,
              private router: Router) {
    this.store$ = this.store.pipe(select('gaodeMap'));
    this.loadLayerStore$ = this.loadLayerStore.pipe(select('loadingLayer'));
  }
  store$: any;
  loadLayerStore$: any;
  mapObj: any;
  dixiaoforgongyeEcharts: any;
  dixiaoforwestEcharts: any;
  /*未开发用地--已开发工业用地*/
  dixiaoforgongyeData = {
    unDevelop: {area: 1030.04, propor: (1030.04 / 4415 * 100).toFixed(2)},
    develop: {area: 4415 - 1030.04, propor: ((4415 - 1030.04) / 4415 * 100).toFixed(2)}
  };
  /*未开发用地--已开发西区用地*/
  dixiaoforwestData = {
    unDevelop: {area: 1030.04, propor: (1030.04 / 60249 * 100).toFixed(2)},
    develop: {area: 60249 - 1030.04, propor: ((60249 - 1030.04) / 60249 * 100).toFixed(2)}
  };
  /*低效用地占西区总面积占比*/
  dixiaoAreaforwestAreaPropor = ((4415 / 60249) * 100).toFixed(2);
  dixiaoAreaforgongyeAreaPropor = ((4415 / 28365) * 100).toFixed(2);
  subscription: Subscription;
  subscriptionColor: Subscription;
  subscriptionDrawPolygon: Subscription;
  panelControl = {overviewShow: true};
  colorListRight = '420px';
  polygonDrawLands = {lands: []};
  ngOnInit() {
    this.store$.subscribe(res => {
      console.log(res);
      this.mapObj = res.data.gaodeMap;
    });

    this.subscription = this.inefficientPanelControlService.getPanelControl().subscribe(res => {
      console.log(res);
      this.panelControl = res;
    });
    this.subscriptionColor = this.inefficientPanelControlService.getColorListControl().subscribe(res => {
      this.colorListRight = res;
    });

    this.subscriptionDrawPolygon = this.inefficientPanelControlService.getDrawPolygonLandsStyleStatus().subscribe(res => {
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
    this.mapObj.clearMap();
    this.landService.creatWestAreaLandRangeCj(this.mapObj);
    this.creatLandAreaPropor({}, ['未开发用地', '已开发工业用地']);
    this.creatLandAreaPropor2({}, ['未开发用地', '已开发西区用地']);
    const dataPolygonNatureLands = this.landService.getdataPolygonNatureLands();
    const dataPolygonInefficientLands = this.landService.getdataPolygonInefficientLands();

    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: true
      }
    });
    /*判断是否已存在土地用途(土地低效用地)数据*/
    if (dataPolygonNatureLands.length > 0 || dataPolygonInefficientLands.length > 0) {
      this.creatInefficientLand(this.mapObj, dataPolygonNatureLands.length > 0 ? dataPolygonNatureLands : dataPolygonInefficientLands);
    }else {
      this.landService.indexeDBmethod.byIndexGet('landData', 'dataPolygonNatureLands', (res) => {
        const dataPolygon = res ? res.data : [];
        /*判断indexedDB是否存在数据*/
        if (dataPolygon.length > 0) {
          /*土地用途和低效用地使用的是同样的地块数据*/
          this.landService.setdataPolygonInefficientLands(dataPolygon);
          this.landService.setdataPolygonNatureLands(dataPolygon);
          this.creatInefficientLand(this.mapObj, dataPolygon);
        }else {
          this.getInefficientLandData();
        }
      });
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionColor.unsubscribe();
    this.subscriptionDrawPolygon.unsubscribe();
  }
  /*获取低效用地地块数据*/
  getInefficientLandData() {
    // const url = '/v1/land/findAllHasType';
    const urlJson = '../../assets/jsonData/findAllHasType.json';
    const pointsArr = [];
    this.http.get(urlJson).subscribe((res: any) => {
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
        pointItem.landCardNumber = res[i].landCardNumber;
        pointItem.landIsLocated = res[i].landIsLocated;
        pointItem.inefficient = res[i].inefficient;
        pointItem.generalType = res[i].generalType;
        /*实测面积*/
        pointItem.landArea = res[i].landArea;
        /*使用全面积*/
        pointItem.usageArea = res[i].usageArea;
        pointItem.landUsrNature = res[i].landUsrNature;
        pointItem.governmentInvestment = res[i].governmentInvestment;
        pointItem.positions = point_x_y;
        pointsArr.push(pointItem);
      }

      this.landService.setdataPolygonInefficientLands(pointsArr);
      const indexedDBdata = {type: 'dataPolygonInefficientLands', data: pointsArr};
      this.landService.indexeDBmethod.add('landData', indexedDBdata);
      this.creatInefficientLand(this.mapObj, pointsArr);
    });
  }
  /*绘制土地低效用地*/
  creatInefficientLand(map, dataOptions) {
    const defaultBorderColor = '#ddba8a';
    const defaultLandColor = 'transparent';
    const selectedColor = '#41bb9a';
    const selectedBorderColor = '#0fd80f';
    const defaultStrokeWeight = 2;
    const selectedStrokeWeight = 4;
    const defualtFillOpacity = 1;
    const colors = ['#07fff7', '#a57c52', '#2a8ab8', '#ff7eff', '#ff0000', '#ffd041', 'transparent'];
    const newpointers = dataOptions;
    let color;
    for (let i = 0; i < newpointers.length; i++) {
      if (newpointers[i].generalType === '储备用地' && newpointers[i].inefficient) {
        color = colors[0];
      }else if (newpointers[i].generalType === '工业用地' && newpointers[i].inefficient) {
        color = colors[1];
      }else if (newpointers[i].generalType === '公共设施及其他用地' && newpointers[i].inefficient) {
        color = colors[2];
      }else if (newpointers[i].generalType === '科研用地' && newpointers[i].inefficient) {
        color = colors[3];
      }else if (newpointers[i].generalType === '商服用地' && newpointers[i].inefficient) {
        color = colors[4];
      }else if (newpointers[i].generalType === '住宅用地' && newpointers[i].inefficient) {
        color = colors[5];
      }else {
        color = colors[6];
      }
      /*if(newpointers[i].generalType == "储备用地"){
        color =colors[2];
        // var color ="transparent"
      }else{
        if(newpointers[i].inefficient){
          color =colors[1];
        }else{
          color =colors[0];
        }
      }*/

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
        console.log(polygonNatureLand.getExtData())
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
          this.router.navigate(['land/inefficient/info', polygonNatureLand.getExtData().unifiedLandMark]);
        }
      })
      polygonNatureLand.on('mouseover', function(e){
      })
      polygonNatureLand.on('mouseout', function(e){
        // landInfoWindow.close()
      })
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
  creatLandAreaPropor(dataOptions, type) {
    const COLORS = ['#a57c52', '#2a8ab8', '#ff7eff', '#ff0000', '#ffd041', '#07fff7'];
    const options = {legendData: [], serverData: []};
    options.legendData = type;
    options.serverData = [
      {value: 1030.04, name: '未开发用地'},
      {value: (4415 - 1030.04), name: '已开发工业用地'}
    ];

    const legendData = options.legendData;
    const serverData = {serverData: options.serverData};
    this.dixiaoforgongyeEcharts = {
      title : {
        text: '低效用地占比',
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
        position: ['20%', '82%']
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
          name: '低效用地占比',
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
  creatLandAreaPropor2(dataOptions, type) {
    const COLORS = ['#a57c52', '#2a8ab8', '#ff7eff', '#ff0000', '#ffd041', '#07fff7'];
    const options = {legendData: [], serverData: []};
    options.legendData = type;
    options.serverData = [
      {value: 1030.04, name: '未开发用地'},
      {value: (60249 - 1030.04), name: '已开发西区用地'}
    ];

    const legendData = options.legendData;
    const serverData = {serverData: options.serverData};
    this.dixiaoforwestEcharts = {
      title : {
        text: '低效与西区用地占比',
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
        position: ['20%', '82%']
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
          name: '低效用地占比',
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
}
