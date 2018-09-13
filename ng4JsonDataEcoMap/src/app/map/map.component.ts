import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Amap } from '../core/store-ngrx/amap.model';
import { gaodeAmap } from '../core/map-obj-ngrx/amap.model';
import { SAVE_MAP } from '../core/map-obj-ngrx/amap.actions';
import { LandServiceService } from '../land/land-service.service';

declare var AMap: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  tagState$: any;
  mapTagState$: any;
  constructor(private http: HttpClient,
              private store: Store<Amap>,
              private gaodeStore: Store<gaodeAmap>,
              private landService: LandServiceService) {
    this.tagState$ = this.store.pipe(select('amap'));
    this.mapTagState$ = this.gaodeStore.pipe(select('gaodeMap'));
  }
  dataPolygonPurposeCateLands = {'工业用地': [], '公共设施及其他用地': [], '科研用地': [], '商服用地': [], '住宅用地': [], '储备用地': []};
  polygonNatureLands = {lands: []};
  dataPolygonNatureLands: any;
  map: any;
  action: any;
  ngOnInit() {
    /*本地储存配置*/
    const myDB = {
      name: 'test',
      version: 1,
      db: null
    };
    this.landService.openDB(myDB.name, myDB.version, (res) => {
      this.landService.getVersionNum();
    });
    this.action = {
      'openInfo': (data) => {
      },
      'ADD_MARKER': (data) => {
        console.log(data);
        /*function do something*/
        data.forEach((v, i) => {
          console.log(v);
        });
      },
      'ADD_MARKER_MID': (data) => {
      },
      'ADD_POLYGON': (data) => {
        console.log(data);
      },
      'ADD_BUILD_MARKER': (data) => {
      },
      'CLEAR_MARKER': (data) => {
      },
      'CHANGE': (data) => {
        console.log('change', data);
      }
    };
    this.tagState$.subscribe((state: Amap) => {
      console.log(state)
      if (state.action) {
        /*执行上方this.action里定义的方法*/
        this.action[state.action](state.data);
      }
    });
    this.map = new AMap.Map('gaodemap-container', {
      resizeEnable: true,
      rotateEnable: true,
      pitchEnable: true,
      zoom: 12,
      pitch: 0,
      rotation: 0,
      buildingAnimation: true, // 楼块出现是否带动画
      expandZoomRange: true,
      zooms: [3, 20],
      center: [103.922278, 30.77348],
      mapStyle: 'amap://styles/85b57e445abed7a5fd9357eabb732d94',
      features: ['road']
    });
    /*储存高德地图对象*/
    this.mapTagState$.dispatch({
      type: SAVE_MAP,
      payload: {
        data: {'gaodeMap': this.map}
      }
    });
    /*map.plugin('AMap.Geolocation', function () {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: false, // 是否使用高精度定位，默认:true
        timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
        convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        // 显示定位按钮，默认：true
        buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true,      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      map.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', function(res){
        console.log(res);
      }); // 返回定位信息
      AMap.event.addListener(geolocation, 'error', function(err){
        console.log(err);
      });      // 返回定位出错信息
    });*/

  }

}
