import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store, select } from '@ngrx/store';
import { Amap } from '../../core/amap-ngrx/amap.model';
import { ViewEncapsulation } from '@angular/core';
import { MicrocosmicService } from '../../pages/microcosmic/microcosmic.service';
import { IntermediateService } from '../../pages/intermediate/intermediate.service';
import { Router } from '@angular/router';
import { IndustryMapFenbuService } from '../../pages/intermediate/industry-map/industry-map-fenbu.service';

declare var AMap: any;
declare var AMapUI: any;
// declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-map',
  template: `<div id='t-amap' class='t-amap'></div>`,
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  tagState$: Observable<Amap>;
  constructor(private store: Store<Amap>,
    private router: Router,
    private microcosmicService: MicrocosmicService,
    private intermediateService: IntermediateService,
    private industryMapFenbuService: IndustryMapFenbuService
  ) {
    this.tagState$ = this.store.pipe(select('amap'));
  }

  AMAPOBJ: any;
  amap: any;
  action: any;
  dataPolygonTopCateLands: any = {};
  dataPolygonEcoCateLands: any = {};
  topRank: any;
  defaultBorderColor = "#8ee3a2";
  defaultLandColor = "transparent";
  dataPolygonAlls: any;
  nowPolygonType: any;
  pointSimplifierIns: any;


  ngOnInit() {
    // this.tagState$.subscribe((state: Amap) => {
    //   console.log(this.AMAPOBJ);
    // });
    setTimeout(() => {
      const map = new AMap.Map('t-amap', {
        features: ['bg', 'road', 'building']
      });
      this.AMAPOBJ = map;
      this.AMAPOBJ.on('click', e => {
        let lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];
        const geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getAddress(lnglatXY, function(status, result) {
          console.log(lnglatXY, status, result)
          if (status === 'complete' && result.info === 'OK') {
            let address = result.regeocode.formattedAddress; //返回地址描述
            console.log(address);
          }
        });
      });
      this.action = {
        'openInfo': (data) => {
          const infoWindow = new AMap.InfoWindow({
            content: data.contentArray.join('<br/>')  // 使用默认信息窗体框样式，显示信息内容
          });
          infoWindow.open(map, map.getCenter());
        },
        'ADD_MARKER': (data) => {
          data.forEach((item, index) => {
            const marker = new AMap.Marker({
              position: item.center.split(','),
              title: item.name,
              map: map,
              content: `<div class="mapMarker"><span>${item.name}</span></div>`
            });
            marker.on('click', () => {
              console.log(marker.getTitle());
              // console.log(marker.F.title);
              this.microcosmicService.changeData(marker.getTitle());
            });
          });
          map.setFitView();
          // map.panBy(-580, 10);
        },
        'ADD_MARKER_MID': (data) => {
          /*判断是否存在海量点layer，有就清空显示*/
          if (this.pointSimplifierIns) {
            this.pointSimplifierIns.setData();
          }
          data.forEach((item, index) => {
            const marker = new AMap.Marker({
              position: item.center.split(','),
              title: item.name,
              map: map,
              content: `<div class="mapMarker"><span>${item.name}</span></div>`
            });
            marker.on('click', (e) => {
              console.log(marker.F.title);
              console.log(e);
              marker.setContent(`<div class="mapMarker active"><span>${item.name}</span></div>`);
              this.intermediateService.changeParkName(marker.F.title);
              /*点击中观园区进入园区数据看板*/
              this.router.navigate(['/int/industryBoard/parkMenu/registMoney']);
            });
          });
          map.setFitView();
          // map.setZoom(12);
          map.panBy(-580, 10);
        },
        'ADD_POLYGON': (datas) => {
          map.clearMap();
          const data = datas.type ? datas.type : datas;
          const time = datas.time ? datas.time : '';
          const getNew = datas.flag ? datas.flag : false;
          const polygonres = this.intermediateService.getSavePolygonLands(data);
          console.log(polygonres);
            if ( data === 'dataPolygonNatureLands' ) {
              if (polygonres.length < 1) {
              const PolygonData = this.intermediateService.getLandNaturePolygon()
                .subscribe(res => {
                  this.creatNaturePolygon(map, res);
                  this.intermediateService.changePolygonLands(data, res);
                  map.setFitView();
                  map.panBy(-540, 10);
                });
              }else {
                this.creatNaturePolygon(map, polygonres);
              }
            }else if ( data === 'dataPolygonSingleLands') {
              if (polygonres.length < 1) {
                this.intermediateService.getSingleFloorPolygon().subscribe(res => {
                  this.creatSingleFloorPolygon(map, res);
                  this.intermediateService.changePolygonLands(data, res);
                  map.setFitView();
                  map.panBy(-540, 10);
                });
              }else {
                this.creatSingleFloorPolygon(map, polygonres);
              }
            }else if ( data === 'dataPolygonEcoTopLands') {
              if (getNew || !polygonres || polygonres.length < 1) {
                this.intermediateService.getEcoTopPolygon(time).subscribe(results => {
                  const landsData = this.formatEcoTopLandsData(results);
                  this.creatEcoTopPolygon(map, landsData);
                  this.intermediateService.changePolygonLands(data, landsData);
                  map.setFitView();
                  map.panBy(-540, 10);
                });
              }else {
                this.creatEcoTopPolygon(map, polygonres);
              }
            }else if ( data === 'dataPolygonEcoOutputLands') {
              if (getNew || !polygonres || polygonres.length < 1) {
                this.intermediateService.getEcoOutputPolygon(time).subscribe(results => {
                  const landsData = this.formatEcoOutputLandsData(results);
                  this.creatEcoOutputPolygon(map, landsData);
                  this.intermediateService.changePolygonLands(data, landsData);
                  map.setFitView();
                  map.panBy(-540, 10);
                });
              }else {
                this.creatEcoOutputPolygon(map, polygonres);
              }
            }else if ( data === 'dataPolygonInefficientLands') {
              if (!polygonres || polygonres.length < 1) {
                this.intermediateService.getInefficientLandPolygon().subscribe(res => {
                  this.creatInefficientLandPolygon(map, res);
                  this.intermediateService.changePolygonLands(data, res);
                  map.setFitView();
                  map.panBy(-540, 10);
                });
              }else {
                this.creatInefficientLandPolygon(map, polygonres);
              }
            }
        },
        'ADD_SINGLE_POLYGON': (datas) => {
          map.clearMap();
          const data = datas.type;
          const industryStatus = datas.industry;
          if ( data === 'dataPolygonEcoSingleLands' ) {
            const polygonData = this.formatEcoOutputCateLandSingle(industryStatus);
            this.creatEcCateLandSingle(map, polygonData);
            map.setFitView();
            map.panBy(-540, 10);
          }else if ( data === 'dataPolygonTopSingleLands') {
            const polygonData = this.formatTopCateLandSingle(industryStatus);
            this.creatTopCateLandSingle(map, polygonData);
            map.setFitView();
            map.panBy(-540, 10);
          }
        },
        'ADD_INDUSTRY_MAP_POLYGON': (data) => {
          const type = data.type;
          const options = data.data ? data.data : '';
          const updated = data.updated ? data.updated : false;
          if (this.nowPolygonType == type && !updated) {
            map.setFitView();
            map.panBy(-580, 10);
            return;
          }
          this.nowPolygonType = type;
          map.clearMap();
          console.log('map', this.pointSimplifierIns);
          /*判断是否存在海量点layer，有就清空显示*/
          if (this.pointSimplifierIns) {
            this.pointSimplifierIns.setData();
          }
          if (type == 'parkIndustry') {
            this.creatParkIndustryFenbu(map);
          }else if (type == 'leadIndustry') {
            this.creatLeadIndustryFenbuMap(map, options);
            console.log('map', map.getLayers());
          }else if (type == 'newIndustry') {
            this.creatNewIndustryFenbuMap(map, options);
          }else if (type == 'customizeIndustry') {
            this.creatCustomizeIndustryFenbuMap(map, options);
          }
          map.setFitView();
          map.panBy(-580, 10);
        },
        'ADD_BUILD_MARKER': (data) => {
          this.parkBuildInfo(map, data);
          map.off('zoomend', function (e) {
            console.log(e);
          });
        },
        'CLEAR_MARKER': (data) => {
          map.clearMap();
        }
      };
      this.tagState$.subscribe((state: Amap) => {
        if (state.action) {
          this.action[state.action](state.data);
        }
      });
      map.plugin('AMap.Geolocation', () => {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
          convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          viewMode: '3D',
          zoom: '12',
          showButton: false,        // 显示定位按钮，默认：true
          buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true     // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
      });
      /*AMap.event.addListener(map, 'zoomend', function(){
        const zoom = map.getZoom();
        const markers = map.getAllOverlays('marker');
        if (zoom <= 12) {
            markers.forEach(function(item, index) {
                item.show();
            });
        } else {
            markers.forEach(function(item, index) {
                item.hide();
            });
        }
        // map.getAllOverlays('marker')[0].hide()
    });*/
    }, 200);

  }
  creatNaturePolygon(map, res) {
    const _that = this;
    const colors = ['#fff', '#a57c52', '#2a8ab8', '#ff7eff', '#ff0000', '#ffdf7e', '#ffd041'];
    const selectedColor = '#41bb9a';
    const defaultBorderColor = '#8ee3a2';
    const defaultLandColor = 'transparent';
    const pointsArr = [];
    for (let i = 0; i < res.length; i++) {
      // pointsArr.push(res[i].points);
      const point_x_y = [];
      const pointItem = {
        id: '',
        inefficient: '',
        landArea: '',
        landUsrNature: '',
        unifiedLandMark: '',
        rightHolder: '',
        landCardNumber: '',
        landIsLocated: '',
        generalType: '',
        usageArea: '',
        position: []
      };
      for (let j = 0; j < res[i].points.length; j++) {
        point_x_y.push([res[i].points[j].point_80_x, res[i].points[j].point_80_y]);
      }
      pointItem.id = res[i].id;
      pointItem.unifiedLandMark = res[i].unifiedLandMark;
      pointItem.rightHolder = res[i].rightHolder;
      pointItem.landCardNumber = res[i].landCardNumber;
      pointItem.landIsLocated = res[i].landIsLocated;
      pointItem.inefficient = res[i].inefficient;
      pointItem.generalType = res[i].generalType;
      /*实测面积*/
      pointItem.landArea = res[i].landArea;
      /*使用全面积*/
      pointItem.usageArea = res[i].usageArea;
      pointItem.landUsrNature = res[i].landUsrNature;
      pointItem.position = point_x_y;
      pointsArr.push(pointItem);
    }

    // this.intermediateService.changePolygonNatureLands(pointsArr);
    // dataPolygonNatureLands = pointsArr;
    const newpointers = pointsArr;
    // -----
    let color;
    for (let i = 0; i < newpointers.length; i++) {

      if (newpointers[i].generalType === '储备用地') {
        color = colors[0];
        // var color ='transparent'
      } else if (newpointers[i].generalType === '工业用地') {
        color = colors[1];
      } else if (newpointers[i].generalType === '公共设施及其他用地') {
        color = colors[2];
      } else if (newpointers[i].generalType === '科研用地') {
        color = colors[3];
      } else if (newpointers[i].generalType === '商服用地') {
        color = colors[4];
      } else if (newpointers[i].generalType === '住宅用地') {
        color = colors[5];
      } else {
        color = colors[6];
      }

      const polygonOptions = {
        map: map,
        strokeColor: '#fff',
        // strokeColor: color,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.8,
        /*strokeStyle: 'dashed',
        strokeDasharray: [20,10],*/
        extData: {
          id: newpointers[i].id,
          type: newpointers[i].type,
          landType: newpointers[i].landType,
          landCardNumber: newpointers[i].landCardNumber,
          landArea: newpointers[i].landArea,
          usageArea: newpointers[i].usageArea,
          /*按性质分类*/
          generalType: newpointers[i].generalType,
          landUsrNature: newpointers[i].landUsrNature,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          color: color,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].position;
      const polygonNatureLand = new AMap.Polygon(polygonOptions);
      polygonNatureLand.on('click', function (e) {
        /*看数据*/
        console.log(this.getExtData());
        if (!this.getExtData().slected) {
          // var lanTitle = idustryParkName;
          const landArea = this.getExtData().landArea;
          const landUsrNature = this.getExtData().landUsrNature;
          const that = this;
          const unifiedLandMark = this.getExtData().unifiedLandMark;
          // chooseLanId = unifiedLandMark;
          // $('.industry-menu .menu-row:last-child li:first-child').click();
          // $('.industry-menu .menu-row:last-child li:first-child').siblings().hide();
          // 在地图上改变当前点击的多边形
          /*for(var i=0;i<polygonNatureLands.lands.length;i++){
            if(polygonNatureLands.lands[i].getExtData().slected){
              polygonNatureLands.lands[i].setOptions({strokeColor:'#fff',fillColor:polygonNatureLands.lands[i].getExtData().color});
              var oldExtData = polygonNatureLands.lands[i].getExtData();//先保存原始ExtData数据
              oldExtData.slected = false;//改变之前选中的状态为false
              polygonNatureLands.lands[i].setExtData(oldExtData)//更新之前选中的ExtData
              break;
            }
          }*/
          // 在地图上改变之前点击的多边形
          const selectedLand = _that.intermediateService.getSelectedLand();
          if (selectedLand) {
            selectedLand.setOptions({strokeColor: '#fff', fillColor: selectedLand.getExtData().color});
            const oldExtData = selectedLand.getExtData(); // 先保存原始ExtData数据
            oldExtData.slected = false; // 改变之前选中的状态为false
            selectedLand.setExtData(oldExtData); // 更新之前选中的ExtData
          }
          // 保存当前点击的多边形
          _that.intermediateService.changeSelectedLand(this);
          const newExtData = this.getExtData();
          newExtData.slected = true;
          this.setOptions({strokeColor: selectedColor, fillColor: selectedColor});
          this.setExtData(newExtData);
          // var options = {lanTitle:lanTitle,landArea:landArea,landUsrNature:landUsrNature,polygon:that};
          // landInfoWindowFn(map,options,'polygonNatureLands');
          // viewLandPanel(this.getExtData())
        }
      });
      polygonNatureLand.on('mouseover', function (e) {
      });
      polygonNatureLand.on('mouseout', function (e) {
        // landInfoWindow.close()
      });
      // console.log(polygon)
      polygonNatureLand.setPath(pointers);
      // polygonNatureLands.lands.push(polygonNatureLand);
    }
  }
  creatSingleFloorPolygon(map, res) {
    const _that = this;
    const selectedColor = '#41bb9a';
    const defaultBorderColor = '#8ee3a2';
    const defaultLandColor = 'transparent';
    const pointsArr = [];
    for (let i = 0; i < res.length; i++) {
      const point_x_y = [];
      const pointItem = {id: '',
        unifiedLandMark: '',
        rightHolder: '',
        landIsLocated: '',
        actualUsers: '',
        isFloor: '',
        landCardNumber: '',
        generalType: '',
        position: [],
        inefficient: '',
        landArea: '',
        usageArea: '',
        landUsrNature: ''};
      for (let j = 0; j < res[i].points.length; j++) {
        point_x_y.push([res[i].points[j].point_80_x, res[i].points[j].point_80_y]);
      }
      pointItem.id = res[i].id;
      pointItem.unifiedLandMark = res[i].unifiedLandMark;
      pointItem.rightHolder = res[i].rightHolder;
      pointItem.landIsLocated = res[i].landIsLocated;
      pointItem.inefficient = res[i].inefficient;
      pointItem.actualUsers = res[i].actualUsers;
      pointItem.isFloor = res[i].isFloor;
      pointItem.landCardNumber = res[i].landCardNumber;
      /*按性质分类*/
      pointItem.generalType = res[i].generalType;
      /*实测面积*/
      pointItem.landArea = res[i].landArea;
      /*使用全面积*/
      pointItem.usageArea = res[i].usageArea;
      pointItem.landUsrNature = res[i].landUsrNature;
      pointItem.position = point_x_y;
      pointsArr.push(pointItem);
    }
    // dataPolygons = pointsArr;
    const newpointers = pointsArr;
    // -----

    let color;
    for (let i = 0; i < newpointers.length; i++) {
      const borderColor = defaultBorderColor;
      if ((newpointers[i].actualUsers)) {
        color = '#4747f1';
        // var color ="transparent"
      }else if (newpointers[i].isFloor) {
        color = '#f9b620';
      }else {
        color = '#8fd9dd';
      }
      const polygonOptions = {
        map: map,
        strokeColor: '#fff',
        // strokeColor: color,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.8,
        /*strokeStyle: "dashed",
        strokeDasharray: [20,10],*/
        extData: {
          id: newpointers[i].id,
          landCardNumber: newpointers[i].landCardNumber,
          landArea: newpointers[i].landArea,
          usageArea: newpointers[i].usageArea,
          /*按性质分类*/
          generalType: newpointers[i].generalType,
          landUsrNature: newpointers[i].landUsrNature,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          color: color,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].position;
      /*var pathArray = [
          pointers.outer,
          pointers.inner,
          pointers.inner2
      ];*/
      const polygon = new AMap.Polygon(polygonOptions);
      polygon.on('click', function(e){
        /*看数据*/
        console.log(this.getExtData())
        if (!this.getExtData().slected) {
          // const lanTitle = idustryParkName;
          const landArea = this.getExtData().landArea;
          const landUsrNature = this.getExtData().landUsrNature;
          const that = this;
          const unifiedLandMark = this.getExtData().unifiedLandMark;
          // chooseLanId = unifiedLandMark;
          // $(".industry-menu .menu-row:last-child li:first-child").click();
          // $(".industry-menu .menu-row:last-child li:first-child").siblings().hide();
          // 在地图上改变当前点击的多边形
         /* for (let i = 0; i<polygons.lands.length; i++){
            if(polygons.lands[i].getExtData().slected){
              polygons.lands[i].setOptions({strokeColor:"#fff",fillColor:polygons.lands[i].getExtData().color});
              var oldExtData = polygons.lands[i].getExtData();//先保存原始ExtData数据
              oldExtData.slected = false;//改变之前选中的状态为false
              polygons.lands[i].setExtData(oldExtData)//更新之前选中的ExtData
              break;
            }
          }*/
          // 在地图上改变之前点击的多边形
          const selectedLand = _that.intermediateService.getSelectedLand();
          if (selectedLand) {
            selectedLand.setOptions({strokeColor: '#fff', fillColor: selectedLand.getExtData().color});
            const oldExtData = selectedLand.getExtData(); // 先保存原始ExtData数据
            oldExtData.slected = false; // 改变之前选中的状态为false
            selectedLand.setExtData(oldExtData); // 更新之前选中的ExtData
          }
          // 保存当前点击的多边形
          _that.intermediateService.changeSelectedLand(this);
          const newExtData = this.getExtData();
          newExtData.slected = true;
          this.setOptions({strokeColor: selectedColor, fillColor: selectedColor});
          this.setExtData(newExtData);
          // var options = {lanTitle:lanTitle,landArea:landArea,landUsrNature:landUsrNature,polygon:that};
          // landInfoWindowFn(map,options,"polygons");
          // viewLandPanel(this.getExtData())
        }

      })
      polygon.on('mouseover', function(e){
        // console.log(e)
        // var lanTitle = idustryParkName;
        // var landArea = this.getExtData().landArea;
        // var landUsrNature = this.getExtData().landUsrNature;
        // var that = this;
        // var options = {lanTitle:lanTitle,landArea:landArea,landUsrNature:landUsrNature,polygon:that}
        // landInfoWindowFn(map,options);
      })
      polygon.on('mouseout', function(e){
        // landInfoWindow.close()
      })
      // console.log(polygon)
      polygon.setPath(pointers);
      // polygons.lands.push(polygon);

    }
  }
  formatEcoTopLandsData(options) {
    const pointsArr = [];
    const allLandsDataPointsArr = [];
    for(let n=0; n<options.length-1; n++){
      const last = options[n].last;
      const top = options[n].top;
      for (let i=0;i<last.length;i++){
        // pointsArr.push(res[i].points);
        const point_x_y = [];
        const pointItem: any = {id:"",position:"",inefficient:"",landArea:"",landUsrNature:""};
        for(let j=0;j<last[i].points.length;j++){
          point_x_y.push([last[i].points[j].point_80_x,last[i].points[j].point_80_y]);
        }
        pointItem.type = "last";
        pointItem.landType = last[i].enterpriseType;
        pointItem.id = last[i].id;
        pointItem.unifiedLandMark = last[i].unifiedLandMark;
        pointItem.rightHolder = last[i].rightHolder;
        pointItem.landIsLocated = last[i].landIsLocated;
        pointItem.inefficient = last[i].inefficient;
        pointItem.actualUsers = last[i].actualUsers;
        pointItem.pricepermeter = last[i].pricepermeter;
        pointItem.landCardNumber = last[i].landCardNumber;
        /*按性质分类*/
        pointItem.generalType = last[i].generalType;
        /*实测面积*/
        pointItem.landArea = last[i].landArea;
        /*使用全面积*/
        pointItem.usageArea = last[i].usageArea;
        pointItem.landUsrNature = last[i].landUsrNature;
        pointItem.position = point_x_y;
        pointsArr.push(pointItem);
      }

      for (let l=0;l<top.length;l++){
        // pointsArr.push(res[i].points);
        var point_x_y = [];
        var pointItem: any = {id:"",position:"",inefficient:"",landArea:"",landUsrNature:""};
        for(var m=0;m<top[l].points.length;m++){
          point_x_y.push([top[l].points[m].point_80_x,top[l].points[m].point_80_y]);
        }
        pointItem.id = top[l].id;
        pointItem.type = "top";
        pointItem.landType = top[l].enterpriseType;
        pointItem.unifiedLandMark = top[l].unifiedLandMark;
        pointItem.rightHolder = top[l].rightHolder;
        pointItem.landIsLocated = top[l].landIsLocated;
        pointItem.inefficient = top[l].inefficient;
        pointItem.actualUsers = top[l].actualUsers;
        pointItem.pricepermeter = top[l].pricepermeter;
        pointItem.landCardNumber = top[l].landCardNumber;
        /*按性质分类*/
        pointItem.generalType = top[l].generalType;
        /*实测面积*/
        pointItem.landArea = top[l].landArea;
        /*使用全面积*/
        pointItem.usageArea = top[l].usageArea;
        pointItem.landUsrNature = top[l].landUsrNature;
        pointItem.position = point_x_y;
        pointsArr.push(pointItem);
      }
    }

    const allLandsData = options[options.length - 1];
    for(let i=0;i<allLandsData.length;i++){
      // pointsArr.push(res[i].points);
      const point_x_y = [];
      const pointItem: any = {id:"",position:"",inefficient:"",landArea:"",landUsrNature:""};
      for(var j=0;j<allLandsData[i].points.length;j++){
        point_x_y.push([allLandsData[i].points[j].point_80_x,allLandsData[i].points[j].point_80_y]);
      }
      pointItem.id = allLandsData[i].id;
      pointItem.unifiedLandMark = allLandsData[i].unifiedLandMark;
      pointItem.rightHolder = allLandsData[i].rightHolder;
      pointItem.actualUsers = allLandsData[i].actualUsers;
      pointItem.landIsLocated = allLandsData[i].landIsLocated;
      pointItem.inefficient = allLandsData[i].inefficient;
      pointItem.isSingle = allLandsData[i].isSingle;
      pointItem.landCardNumber = allLandsData[i].landCardNumber;
      /*按性质分类*/
      pointItem.generalType = allLandsData[i].generalType;
      /*实测面积*/
      pointItem.landArea = allLandsData[i].landArea;
      /*使用全面积*/
      pointItem.usageArea = allLandsData[i].usageArea;
      pointItem.landUsrNature = allLandsData[i].landUsrNature;
      pointItem.position = point_x_y;
      allLandsDataPointsArr.push(pointItem);
    }
    this.dataPolygonAlls = allLandsDataPointsArr;
    const allOptions = allLandsDataPointsArr;
    for (let i = 0; i < pointsArr.length; i++) {
      for (let j = 0; j < allOptions.length; j++) {
        if (pointsArr[i].unifiedLandMark == allOptions[j].unifiedLandMark) {
          allOptions.splice(j, 1);
          break;
        }
      }
    }
    const dataPolygonTopLands = allOptions.concat(pointsArr);
    return dataPolygonTopLands;
  }
  creatEcoTopPolygon(map, res) {
    const _that = this;
    const selectedColor = '#41bb9a';
    /*请求新数据将保存的单一分类数据清除*/
    this.dataPolygonTopCateLands.living = [];
    this.dataPolygonTopCateLands.electron = [];
    this.dataPolygonTopCateLands.yiqi = [];
    this.dataPolygonTopCateLands.other = [];
    this.dataPolygonTopCateLands.service = [];
    /*请求新数据将保存的排名清除*/
    this.topRank = {生物医药: [], 电子信息: [], 精密制造: [], 其他: [], 服务业: []};
    const newpointers = res;
    const colors = ["#ff7e9f","#ff7e00","#a57c52","#7d7dff","#ff0000","#ffdf7e"];
    // var colors2 = ["#ff4141","#65e372","#4745ff","#dd7f34"];
    const colors3 = ["#994b5e","#994c00","#59432d","#4b4b99","#990000"];
    let color;
    let borderColor;
    for (let i = 0; i < newpointers.length; i++) {
      color = this.defaultLandColor;
      borderColor = "#fff";
      if (newpointers[i].landType == "生物医药") {
        /*保存单独信息供筛选*/
        this.dataPolygonTopCateLands.living.push(newpointers[i]);
        if (newpointers[i].type == "top") {
          color = colors3[0];
        }else if (newpointers[i].type == "last"){
          color = colors[0];
        }
        // var color ="transparent"
      }else if( newpointers[i].landType == "电子信息"){
        this.dataPolygonTopCateLands.electron.push(newpointers[i]);
        if(newpointers[i].type == "top"){
          color =colors3[1];
        }else if(newpointers[i].type == "last"){
          color =colors[1];
        }
      }else if(newpointers[i].landType == "精密制造"){
        this.dataPolygonTopCateLands.yiqi.push(newpointers[i]);
        if(newpointers[i].type == "top"){
          color =colors3[2];
        }else if(newpointers[i].type == "last"){
          color =colors[2];
        }
      }else if(newpointers[i].landType == "其他"){
        this.dataPolygonTopCateLands.other.push(newpointers[i]);
        if(newpointers[i].type == "top"){
          color =colors3[3];
        }else if(newpointers[i].type == "last"){
          color =colors[3];
        }
      }else if(newpointers[i].landType == "服务业"){
        this.dataPolygonTopCateLands.service.push(newpointers[i]);
        if(newpointers[i].type == "top"){
          color =colors3[4];
        }else if(newpointers[i].type == "last"){
          color =colors[4];
        }
      }else{
        borderColor = this.defaultBorderColor;
      }

      const polygonOptions = {
        map: map,
        strokeColor: borderColor,
        // strokeColor: color,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.8,
        /*strokeStyle: "dashed",
        strokeDasharray: [20,10],*/
        extData: {
          id: newpointers[i].id,
          type: newpointers[i].type,
          landType: newpointers[i].landType,
          actualUsers: newpointers[i].actualUsers,
          pricepermeter: newpointers[i].pricepermeter,
          landCardNumber: newpointers[i].landCardNumber,
          landArea: newpointers[i].landArea,
          usageArea: newpointers[i].usageArea,
          /*按性质分类*/
          generalType: newpointers[i].generalType,
          landUsrNature: newpointers[i].landUsrNature,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          color: color,
          borderColor: borderColor,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].position;
      const polygonTopLand = new AMap.Polygon(polygonOptions);
      polygonTopLand.on("click",function(e){
        /*看数据*/
        console.log(this.getExtData())
        if(!this.getExtData().slected){
          const landArea = this.getExtData().landArea;
          const landUsrNature = this.getExtData().landUsrNature;
          const that = this;
          const unifiedLandMark = this.getExtData().unifiedLandMark;
          // $(".industry-menu .menu-row:last-child li:first-child").click();
          // $(".industry-menu .menu-row:last-child li:first-child").siblings().hide();
          //在地图上改变当前点击的多边形
          /*for(var i=0;i<polygonTopLands.lands.length;i++){
            if(polygonTopLands.lands[i].getExtData().slected){
              polygonTopLands.lands[i].setOptions({strokeColor:polygonTopLands.lands[i].getExtData().borderColor,fillColor:polygonTopLands.lands[i].getExtData().color});
              var oldExtData = polygonTopLands.lands[i].getExtData();//先保存原始ExtData数据
              oldExtData.slected = false;//改变之前选中的状态为false
              polygonTopLands.lands[i].setExtData(oldExtData)//更新之前选中的ExtData
              break;
            }
          }*/

          // 在地图上改变之前点击的多边形
          const selectedLand = _that.intermediateService.getSelectedLand();
          if (selectedLand) {
            selectedLand.setOptions({strokeColor: '#fff', fillColor: selectedLand.getExtData().color});
            const oldExtData = selectedLand.getExtData(); // 先保存原始ExtData数据
            oldExtData.slected = false; // 改变之前选中的状态为false
            selectedLand.setExtData(oldExtData); // 更新之前选中的ExtData
          }
          // 保存当前点击的多边形
          _that.intermediateService.changeSelectedLand(this);
          const newExtData = this.getExtData();
          newExtData.slected = true;
          this.setOptions({strokeColor: selectedColor, fillColor: selectedColor});
          this.setExtData(newExtData);
        }
      })
      polygonTopLand.on("mouseover",function(e){
      })
      polygonTopLand.on("mouseout",function(e){
        // landInfoWindow.close()
      })
      // console.log(polygon)
      polygonTopLand.setPath(pointers);
      /*将TOP10的排名使用marker显示*/
      if(newpointers[i].type == "top"){
        const landType = newpointers[i].landType;
        this.topRank[landType].push(newpointers[i]);
        const index = this.topRank[landType].length;
        const text = new AMap.Text({
          text: index,
          map: map,
          position: [polygonTopLand.getBounds().getCenter().getLng(), polygonTopLand.getBounds().getCenter().getLat()]
        })
        text.setMap(map);
      }
      // polygonTopLands.lands.push(polygonTopLand);
    }
  }
  formatEcoOutputLandsData(options) {
    const landsData = options;
    const pointsArr = [];
    const allLandsDataPointsArr = [];
    for (let n=0; n<landsData.length - 1; n++) {
      const firstLv = landsData[n].firstGradient;
      const secondLv = landsData[n].secondGradient;
      const thirdLv = landsData[n].thirdGradient;
      // console.log(res)
      for(let i=0;i<firstLv.length;i++){
        // pointsArr.push(res[i].points);
        var point_x_y = [];
        var pointItem: any = {id:"",position:"",enterpriseType:"",landArea:"",landUsrNature:""};
        for(var j=0;j<firstLv[i].points.length;j++){
          point_x_y.push([firstLv[i].points[j].point_80_x,firstLv[i].points[j].point_80_y]);
        }
        pointItem.id = firstLv[i].id;
        pointItem.unifiedLandMark = firstLv[i].unifiedLandMark;
        pointItem.rightHolder = firstLv[i].rightHolder;
        pointItem.landIsLocated = firstLv[i].landIsLocated;
        pointItem.enterpriseType = firstLv[i].enterpriseType;
        pointItem.ecoLv = 1;
        pointItem.actualUsers = firstLv[i].actualUsers;
        pointItem.pricepermeter = firstLv[i].pricepermeter;
        pointItem.landCardNumber = firstLv[i].landCardNumber;
        /*按性质分类*/
        pointItem.generalType = firstLv[i].generalType;
        /*实测面积*/
        pointItem.landArea = firstLv[i].landArea;
        /*使用全面积*/
        pointItem.usageArea = firstLv[i].usageArea;
        pointItem.landUsrNature = firstLv[i].landUsrNature;
        pointItem.position = point_x_y;
        pointsArr.push(pointItem);
      }
      for(var i=0;i<secondLv.length;i++){
        // pointsArr.push(res[i].points);
        var point_x_y = [];
        var pointItem: any = {id:"",position:"",enterpriseType:"",landArea:"",landUsrNature:""};
        for(var j=0;j<secondLv[i].points.length;j++){
          point_x_y.push([secondLv[i].points[j].point_80_x,secondLv[i].points[j].point_80_y]);
        }
        pointItem.id = secondLv[i].id;
        pointItem.unifiedLandMark = secondLv[i].unifiedLandMark;
        pointItem.rightHolder = secondLv[i].rightHolder;
        pointItem.landIsLocated = secondLv[i].landIsLocated;
        pointItem.enterpriseType = secondLv[i].enterpriseType;
        pointItem.ecoLv = 2;
        pointItem.actualUsers = secondLv[i].actualUsers;
        pointItem.pricepermeter = secondLv[i].pricepermeter;
        pointItem.landCardNumber = secondLv[i].landCardNumber;
        /*按性质分类*/
        pointItem.generalType = secondLv[i].generalType;
        /*实测面积*/
        pointItem.landArea = secondLv[i].landArea;
        /*使用全面积*/
        pointItem.usageArea = secondLv[i].usageArea;
        pointItem.landUsrNature = secondLv[i].landUsrNature;
        pointItem.position = point_x_y;
        pointsArr.push(pointItem);
      }
      for(var i=0;i<thirdLv.length;i++){
        // pointsArr.push(res[i].points);
        var point_x_y = [];
        var pointItem: any = {id:"",position:"",enterpriseType:"",landArea:"",landUsrNature:""};
        for(var j=0;j<thirdLv[i].points.length;j++){
          point_x_y.push([thirdLv[i].points[j].point_80_x,thirdLv[i].points[j].point_80_y]);
        }
        pointItem.id = thirdLv[i].id;
        pointItem.unifiedLandMark = thirdLv[i].unifiedLandMark;
        pointItem.rightHolder = thirdLv[i].rightHolder;
        pointItem.landIsLocated = thirdLv[i].landIsLocated;
        pointItem.enterpriseType = thirdLv[i].enterpriseType;
        pointItem.ecoLv = 3;
        pointItem.actualUsers = thirdLv[i].actualUsers;
        pointItem.pricepermeter = thirdLv[i].pricepermeter;
        pointItem.landCardNumber = thirdLv[i].landCardNumber;
        /*按性质分类*/
        pointItem.generalType = thirdLv[i].generalType;
        /*实测面积*/
        pointItem.landArea = thirdLv[i].landArea;
        /*使用全面积*/
        pointItem.usageArea = thirdLv[i].usageArea;
        pointItem.landUsrNature = thirdLv[i].landUsrNature;
        pointItem.position = point_x_y;
        pointsArr.push(pointItem);
      }
    }

    const allLandsData = landsData[landsData.length - 1];
    for(let i=0;i<allLandsData.length;i++){
      // pointsArr.push(res[i].points);
      const point_x_y = [];
      const pointItem: any = {id:"",position:"",inefficient:"",landArea:"",landUsrNature:""};
      for(var j=0;j<allLandsData[i].points.length;j++){
        point_x_y.push([allLandsData[i].points[j].point_80_x,allLandsData[i].points[j].point_80_y]);
      }
      pointItem.id = allLandsData[i].id;
      pointItem.unifiedLandMark = allLandsData[i].unifiedLandMark;
      pointItem.rightHolder = allLandsData[i].rightHolder;
      pointItem.actualUsers = allLandsData[i].actualUsers;
      pointItem.landIsLocated = allLandsData[i].landIsLocated;
      pointItem.inefficient = allLandsData[i].inefficient;
      pointItem.isSingle = allLandsData[i].isSingle;
      pointItem.landCardNumber = allLandsData[i].landCardNumber;
      /*按性质分类*/
      pointItem.generalType = allLandsData[i].generalType;
      /*实测面积*/
      pointItem.landArea = allLandsData[i].landArea;
      /*使用全面积*/
      pointItem.usageArea = allLandsData[i].usageArea;
      pointItem.landUsrNature = allLandsData[i].landUsrNature;
      pointItem.position = point_x_y;
      allLandsDataPointsArr.push(pointItem);
    }
    this.dataPolygonAlls = allLandsDataPointsArr;
    const allOptions = allLandsDataPointsArr;

    for (let i = 0; i < pointsArr.length; i++) {
      for (let j = 0; j < allOptions.length; j++) {
        if (pointsArr[i].unifiedLandMark == allOptions[j].unifiedLandMark) {
          allOptions.splice(j, 1);
          break;
        }
      }
    }
    const dataPolygonEcoLands = allOptions.concat(pointsArr);
    return dataPolygonEcoLands;
  }
  creatEcoOutputPolygon(map, res) {
    const _that = this;
    /*请求新数据将保存的单一分类数据清除*/
    this.dataPolygonEcoCateLands.living = [];
    this.dataPolygonEcoCateLands.electron = [];
    this.dataPolygonEcoCateLands.yiqi = [];
    this.dataPolygonEcoCateLands.other = [];
    this.dataPolygonEcoCateLands.service = [];
    const newpointers = res;
    //-----
    /*1级*/
    const colors = ["#ff7e9f", "#ff7e00", "#a57c52", "#7d7dff", "#ff0000"];
    /*2级*/
    const colors2 = ["#b3576e", "#b35900", "#59432d", "#5e5ebf", "#b30000"];
    /*3级*/
    const colors3 = ["#66323f", "#4d2600", "#0d0a06", "#3e3e7e", "#660000"];
    let color = this.defaultLandColor;
    let borderColor = "#fff";
    for (var i = 0; i < newpointers.length; i++) {
      color = this.defaultLandColor;
      borderColor = "#fff";
      if ((newpointers[i].enterpriseType == "生物医药")) {
        this.dataPolygonEcoCateLands.living.push(newpointers[i]);
        if (newpointers[i].ecoLv == 1) {
          color = colors[0];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[0];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[0];
        }
        // var color ="transparent"
      } else if (newpointers[i].enterpriseType == "电子信息") {
        this.dataPolygonEcoCateLands.electron.push(newpointers[i]);
        if (newpointers[i].ecoLv == 1) {
          color = colors[1];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[1];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[1];
        }
      } else if (newpointers[i].enterpriseType == "精密制造") {
        this.dataPolygonEcoCateLands.yiqi.push(newpointers[i]);
        if (newpointers[i].ecoLv == 1) {
          color = colors[2];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[2];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[2];
        }
      } else if (newpointers[i].enterpriseType == "其他") {
        this.dataPolygonEcoCateLands.other.push(newpointers[i]);
        if (newpointers[i].ecoLv == 1) {
          color = colors[3];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[3];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[3];
        }
      } else if (newpointers[i].enterpriseType == "服务业") {
        this.dataPolygonEcoCateLands.service.push(newpointers[i]);
        if (newpointers[i].ecoLv == 1) {
          color = colors[4];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[4];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[4];
        }
      }else{
        borderColor = this.defaultBorderColor;
      }
      const polygonOptions = {
        map: map,
        strokeColor: borderColor,
        // strokeColor: color,
        strokeWeight: 2,
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
          landUsrNature: newpointers[i].landUsrNature,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          color: color,
          borderColor: borderColor,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].position;
      /*var pathArray = [
      pointers.outer,
      pointers.inner,
      pointers.inner2
  ];*/
      const polygonEcLand = new AMap.Polygon(polygonOptions);
      polygonEcLand.on("click", function (e) {
        /*看数据*/
        console.log(this.getExtData())
        if (!this.getExtData().slected) {
          const landArea = this.getExtData().landArea;
          const landUsrNature = this.getExtData().landUsrNature;
          const that = this;
          const unifiedLandMark = this.getExtData().unifiedLandMark;
          // 在地图上改变之前点击的多边形
          const selectedLand = _that.intermediateService.getSelectedLand();
          if (selectedLand) {
            selectedLand.setOptions({strokeColor: '#fff', fillColor: selectedLand.getExtData().color});
            const oldExtData = selectedLand.getExtData(); // 先保存原始ExtData数据
            oldExtData.slected = false; // 改变之前选中的状态为false
            selectedLand.setExtData(oldExtData); // 更新之前选中的ExtData
          }
          // 保存当前点击的多边形
          _that.intermediateService.changeSelectedLand(this);
          const newExtData = this.getExtData();
          newExtData.slected = true;
          this.setOptions({strokeColor: this.selectedColor, fillColor: this.selectedColor});
          this.setExtData(newExtData);
        }
      })
      polygonEcLand.on("mouseover", function (e) {
        // console.log(e)
        // var lanTitle = idustryParkName;
        // var landArea = this.getExtData().landArea;
        // var landUsrNature = this.getExtData().landUsrNature;
        // var that = this;
        // var options = {lanTitle:lanTitle,landArea:landArea,landUsrNature:landUsrNature,polygon:that}
        // landInfoWindowFn(map,options);
      })
      polygonEcLand.on("mouseout", function (e) {
        // landInfoWindow.close()
      })
      // console.log(polygon)
      polygonEcLand.setPath(pointers);

    }
  }
  creatInefficientLandPolygon(map, res) {
    const _that = this;
    const pointsArr = [];
    for(let i=0;i<res.length;i++){
      // pointsArr.push(res[i].points);
      const point_x_y = [];
      const pointItem: any = {id:"",position:"",inefficient:"",landArea:"",landUsrNature:""};
      for(let j=0;j<res[i].points.length;j++){
        point_x_y.push([res[i].points[j].point_80_x,res[i].points[j].point_80_y]);
      }
      pointItem.id = res[i].id;
      pointItem.unifiedLandMark = res[i].unifiedLandMark;
      pointItem.rightHolder = res[i].rightHolder;
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
      pointItem.position = point_x_y;
      pointsArr.push(pointItem);
    }
    const dataPolygonInefficients = pointsArr;
    const newpointers = pointsArr;
    //-----

    for(let i=0;i<newpointers.length;i++){
      // if((newpointers[i].zb<0.6)){
      let color;
      if((newpointers[i].inefficient == true)){
        color ="#4747f1"
        // var color ="transparent"
      }else{
        color ="#f9b620"
      }
      const polygonOptions = {
        map: map,
        strokeColor: '#fff',
        // strokeColor: color,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.8,
        /*strokeStyle: "dashed",
        strokeDasharray: [20,10],*/
        extData: {
          id: newpointers[i].id,
          landCardNumber: newpointers[i].landCardNumber,
          landArea: newpointers[i].landArea,
          usageArea: newpointers[i].usageArea,
          /*按性质分类*/
          generalType: newpointers[i].generalType,
          landUsrNature: newpointers[i].landUsrNature,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          inefficient: newpointers[i].inefficient,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          color: color,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].position;
      /*var pathArray = [
          pointers.outer,
          pointers.inner,
          pointers.inner2
      ];*/
      const polygon = new AMap.Polygon(polygonOptions);
      polygon.on("click",function(e){
        /*看数据*/
        console.log(this.getExtData())
        if(!this.getExtData().slected){
          const landArea = this.getExtData().landArea;
          const landUsrNature = this.getExtData().landUsrNature;
          const that = this;
          const unifiedLandMark = this.getExtData().unifiedLandMark;
          // $(".industry-menu .menu-row:last-child li:first-child").click();
          // $(".industry-menu .menu-row:last-child li:first-child").siblings().hide();
          /*$.ajax({
              url:"/v1/land/findOneByMark",
              type:"GET",
              dataType:"json",
              data:{mark:unifiedLandMark},
              success:function(res){
                  console.log(res)
                  $(".industry-menu .menu-row:last-child li:first-child").click();
              },error:function(err){
                  console.log(err)
              }
          })*/
          // 在地图上改变之前点击的多边形
          const selectedLand = _that.intermediateService.getSelectedLand();
          if (selectedLand) {
            selectedLand.setOptions({strokeColor: '#fff', fillColor: selectedLand.getExtData().color});
            const oldExtData = selectedLand.getExtData(); // 先保存原始ExtData数据
            oldExtData.slected = false; // 改变之前选中的状态为false
            selectedLand.setExtData(oldExtData); // 更新之前选中的ExtData
          }
          // 保存当前点击的多边形
          _that.intermediateService.changeSelectedLand(this);
          const newExtData = this.getExtData();
          newExtData.slected = true;
          this.setOptions({strokeColor: this.selectedColor, fillColor: this.selectedColor});
          this.setExtData(newExtData);
          // landInfoWindowFn(map,options,"polygonInefficients");
          /*单独请求低效用地数据*/
          if(this.getExtData().inefficient){
            /*$.ajax({
              url: "/v1/land/findOneByMark",
              type:"GET",
              dataType:"json",
              data:{mark:unifiedLandMark},
              success:function(res){
                console.log(res);
                var inefficientData = res.low[0];
                if(inefficientData.length>0){
                  var tpl = `<div class="flex">
                                            <div class="flex-cell">
                                            <div class="land-info">
                                                <table class="table table-bordered">
                                                    <tbody><tr>
                                                        <td class="nowrap land-row-title">用地单位:</td><td class="two-row">${inefficientData[1]}</td>
                                                        <td class="nowrap land-row-title">土地位置:</td><td>${inefficientData[2]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="nowrap land-row-title">土地面积:</td><td class="two-row">${inefficientData[3]}亩</td>
                                                        <td class="nowrap land-row-title">已开发土地面积:</td><td>${inefficientData[4]}亩</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="nowrap land-row-title">未开发土地面积:</td><td class="two-row">${inefficientData[5]}亩</td>
                                                        <td class="nowrap land-row-title">协议签订时间:</td><td>${inefficientData[7]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="nowrap land-row-title">项目总投资或固定资产:</td><td class="two-row">${inefficientData[8]}</td>
                                                        <td class="nowrap land-row-title">协议约定建设规模（平方米）:</td><td>${inefficientData[9]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="nowrap land-row-title">约定动工时间（年月日）:</td><td class="two-row">${inefficientData[10]}</td>
                                                        <td class="nowrap land-row-title">约定竣工时间（年月日）:</td><td>${inefficientData[11]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="nowrap land-row-title">项目首期建成时间（年月日）:</td><td class="two-row">${inefficientData[12]}</td>
                                                        <td class="nowrap land-row-title">实际建成规模（平方米）:</td><td>${inefficientData[13]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="nowrap land-row-title">未建成面积（平方米）:</td><td class="two-row">${inefficientData[14]}</td>
                                                        <td class="nowrap land-row-title">企业2015年年产值（万元）:</td><td>${inefficientData[15]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="nowrap land-row-title">企业2015年年销售收入（万元）:</td><td class="two-row">${inefficientData[16]}</td>
                                                        <td class="nowrap land-row-title">是否有下一步用地需求:</td><td>${inefficientData[17]}</td>
                                                    </tr>
                                                </tbody></table>
                                            </div>
                                        </div>
                                        </div>`;
                  $(".land-panel-con").append(tpl);
                  $(".land-panel .land-panel-con").mCustomScrollbar("update");
                }

              },error:function(err){
                console.log(err)
              }

            })*/
          }
        }

      })
      polygon.on("mouseover",function(e){
        // console.log(e)
        // var lanTitle = idustryParkName;
        // var landArea = this.getExtData().landArea;
        // var landUsrNature = this.getExtData().landUsrNature;
        // var that = this;
        // var options = {lanTitle:lanTitle,landArea:landArea,landUsrNature:landUsrNature,polygon:that}
        // landInfoWindowFn(map,options);
      })
      polygon.on("mouseout",function(e){
        // landInfoWindow.close()
      })
      // console.log(polygon)
      polygon.setPath(pointers);

    }
  }
  /*将所选择类别的TOP经济地块数据处理*/
  formatTopCateLandSingle(options) {
    const polygonData = [];
    for (const item in options) {
      if (!options[item]) {
        polygonData.push(...this.dataPolygonTopCateLands[item]);
      }
    }
    return polygonData;
  }
  /*将分类TOP经济地块单独信息绘图*/
  creatTopCateLandSingle(map, options) {
    const _that = this;
    const allOptions = this.dataPolygonAlls;
    /*请求新数据将保存的排名清除*/
    this.topRank = {生物医药: [], 电子信息: [], 精密制造: [], 其他: [], 服务业: []};
    /*去除所有地块里含有经济等级的地块*/
    for (let i = 0; i < options.length; i++) {
      for (let j = 0; j < allOptions.length; j++) {
        if (options[i].unifiedLandMark == allOptions[j].unifiedLandMark) {
          allOptions.splice(j, 1);
          break;
        }
      }
    }
    const newpointers = allOptions.concat(options);
    const colors = ["#ff7e9f","#ff7e00","#a57c52","#7d7dff","#ff0000","#ffdf7e"];
    // var colors2 = ["#ff4141","#65e372","#4745ff","#dd7f34"];
    const colors3 = ["#994b5e","#994c00","#59432d","#4b4b99","#990000"];
    let color = this.defaultLandColor;
    let borderColor = "#fff";
    for(let i=0;i<newpointers.length;i++){
      color = this.defaultLandColor;
      borderColor = "#fff";
      if(newpointers[i].landType == "生物医药"){
        if(newpointers[i].type == "top"){
          color =colors3[0];
        }else if(newpointers[i].type == "last"){
          color =colors[0];
        }
        // var color ="transparent"
      }else if(newpointers[i].landType == "电子信息"){
        if(newpointers[i].type == "top"){
          color =colors3[1];
        }else if(newpointers[i].type == "last"){
          color =colors[1];
        }
      }else if(newpointers[i].landType == "精密制造"){
        if(newpointers[i].type == "top"){
          color =colors3[2];
        }else if(newpointers[i].type == "last"){
          color =colors[2];
        }
      }else if(newpointers[i].landType == "其他"){
        if(newpointers[i].type == "top"){
          color =colors3[3];
        }else if(newpointers[i].type == "last"){
          color =colors[3];
        }
      }else if(newpointers[i].landType == "服务业"){
        if(newpointers[i].type == "top"){
          color =colors3[4];
        }else if(newpointers[i].type == "last"){
          color =colors[4];
        }
      }else{
        borderColor = this.defaultBorderColor;
      }

      const polygonOptions = {
        map: map,
        strokeColor: borderColor,
        // strokeColor: color,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.8,
        /*strokeStyle: "dashed",
        strokeDasharray: [20,10],*/
        extData: {
          id: newpointers[i].id,
          type: newpointers[i].type,
          landType: newpointers[i].landType,
          actualUsers: newpointers[i].actualUsers,
          pricepermeter: newpointers[i].pricepermeter,
          landCardNumber: newpointers[i].landCardNumber,
          landArea: newpointers[i].landArea,
          usageArea: newpointers[i].usageArea,
          /*按性质分类*/
          generalType: newpointers[i].generalType,
          landUsrNature: newpointers[i].landUsrNature,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          color: color,
          borderColor: borderColor,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].position;
      const polygonTopLand = new AMap.Polygon(polygonOptions);
      polygonTopLand.on("click",function(e){
        /*看数据*/
        console.log(this.getExtData())
        if(!this.getExtData().slected){
          const landArea = this.getExtData().landArea;
          const landUsrNature = this.getExtData().landUsrNature;
          const that = this;
          const unifiedLandMark = this.getExtData().unifiedLandMark;
          // $(".industry-menu .menu-row:last-child li:first-child").click();
          // $(".industry-menu .menu-row:last-child li:first-child").siblings().hide();

          // 在地图上改变之前点击的多边形
          const selectedLand = _that.intermediateService.getSelectedLand();
          if (selectedLand) {
            selectedLand.setOptions({strokeColor: '#fff', fillColor: selectedLand.getExtData().color});
            const oldExtData = selectedLand.getExtData(); // 先保存原始ExtData数据
            oldExtData.slected = false; // 改变之前选中的状态为false
            selectedLand.setExtData(oldExtData); // 更新之前选中的ExtData
          }
          // 保存当前点击的多边形
          _that.intermediateService.changeSelectedLand(this);
          const newExtData = this.getExtData();
          newExtData.slected = true;
          this.setOptions({strokeColor: this.selectedColor, fillColor: this.selectedColor});
          this.setExtData(newExtData);
        }
      })
      polygonTopLand.on("mouseover",function(e){
      })
      polygonTopLand.on("mouseout",function(e){
        // landInfoWindow.close()
      })
      // console.log(polygon)
      polygonTopLand.setPath(pointers);
      /*将TOP10的排名使用marker显示*/
      if (newpointers[i].type == "top") {
        const landType = newpointers[i].landType;
        this.topRank[landType].push(newpointers[i]);
        const index = this.topRank[landType].length;
        const text = new AMap.Text({
          text: index,
          map: map,
          position: [polygonTopLand.getBounds().getCenter().getLng(), polygonTopLand.getBounds().getCenter().getLat()]
        })
        text.setMap(map);
      }
    }
  }

  /*将所选择类别的经济产出地块数据处理*/
  formatEcoOutputCateLandSingle(options) {
    const polygonData = [];
    for (const item in options) {
      if (!options[item]) {
        polygonData.push(...this.dataPolygonEcoCateLands[item]);
      }
    }
    console.log(polygonData)
    return polygonData;
  }
  /*将分类经济梯度(经济产出)地块单独信息绘图*/
  creatEcCateLandSingle(map, options) {
    const _that = this;
    const allOptions = this.dataPolygonAlls;
    for (let i = 0; i < options.length; i++) {
      for (let j = 0; j < allOptions.length; j++) {
        if (options[i].unifiedLandMark == allOptions[j].unifiedLandMark) {
          allOptions.splice(j, 1);
          break;
        }
      }
      // dataPolygonEcoCateLands.living=[];
      // dataPolygonEcoCateLands.electron=[];
      // dataPolygonEcoCateLands.yiqi=[];
      // dataPolygonEcoCateLands.other=[];
      // dataPolygonEcoCateLands.service=[];
    }
    const newpointers = allOptions.concat(options);
    //-----
    /*1级*/
    const colors = ["#ff7e9f", "#ff7e00", "#a57c52", "#7d7dff", "#ff0000"];
    /*2级*/
    const colors2 = ["#b3576e", "#b35900", "#59432d", "#5e5ebf", "#b30000"];
    /*3级*/
    const colors3 = ["#66323f", "#4d2600", "#0d0a06", "#3e3e7e", "#660000"];
    let color = this.defaultLandColor;
    let borderColor = "#fff";
    for (var i = 0; i < newpointers.length; i++) {
      color = this.defaultLandColor;
      borderColor = "#fff";
      if ((newpointers[i].enterpriseType == "生物医药")) {
        if (newpointers[i].ecoLv == 1) {
          color = colors[0];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[0];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[0];
        }
        // var color ="transparent"
      } else if (newpointers[i].enterpriseType == "电子信息") {
        if (newpointers[i].ecoLv == 1) {
          color = colors[1];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[1];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[1];
        }
      } else if (newpointers[i].enterpriseType == "精密制造") {
        if (newpointers[i].ecoLv == 1) {
          color = colors[2];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[2];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[2];
        }
      } else if (newpointers[i].enterpriseType == "其他") {
        if (newpointers[i].ecoLv == 1) {
          color = colors[3];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[3];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[3];
        }
      } else if (newpointers[i].enterpriseType == "服务业") {
        if (newpointers[i].ecoLv == 1) {
          color = colors[4];
        } else if (newpointers[i].ecoLv == 2) {
          color = colors2[4];
        } else if (newpointers[i].ecoLv == 3) {
          color = colors3[4];
        }
      }else {
        borderColor = this.defaultBorderColor;
      }
      const polygonOptions = {
        map: map,
        strokeColor: borderColor,
        // strokeColor: color,
        strokeWeight: 2,
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
          landUsrNature: newpointers[i].landUsrNature,
          unifiedLandMark: newpointers[i].unifiedLandMark,
          landIsLocated: newpointers[i].landIsLocated,
          rightHolder: newpointers[i].rightHolder,
          color: color,
          borderColor: borderColor,
          slected: false
        }
      };
      // 外多边形坐标数组和内多边形坐标数组
      const pointers = newpointers[i].position;
      /*var pathArray = [
      pointers.outer,
      pointers.inner,
      pointers.inner2
  ];*/
      const polygonEcLand = new AMap.Polygon(polygonOptions);
      polygonEcLand.on("click", function (e) {
        /*看数据*/
        console.log(this.getExtData())
        if (!this.getExtData().slected) {
          const landArea = this.getExtData().landArea;
          const landUsrNature = this.getExtData().landUsrNature;
          const that = this;
          const unifiedLandMark = this.getExtData().unifiedLandMark;
          // $(".industry-menu .menu-row:last-child li:first-child").click();
          // $(".industry-menu .menu-row:last-child li:first-child").siblings().hide();
          /*$.ajax({
          url:"/v1/land/findOneByMark",
          type:"GET",
          dataType:"json",
          data:{mark:unifiedLandMark},
          success:function(res){
              console.log(res)
              $(".industry-menu .menu-row:last-child li:first-child").click();
          },error:function(err){
              console.log(err)
          }
      })*/
          // 在地图上改变之前点击的多边形
          const selectedLand = _that.intermediateService.getSelectedLand();
          if (selectedLand) {
            selectedLand.setOptions({strokeColor: '#fff', fillColor: selectedLand.getExtData().color});
            const oldExtData = selectedLand.getExtData(); // 先保存原始ExtData数据
            oldExtData.slected = false; // 改变之前选中的状态为false
            selectedLand.setExtData(oldExtData); // 更新之前选中的ExtData
          }
          // 保存当前点击的多边形
          _that.intermediateService.changeSelectedLand(this);
          const newExtData = this.getExtData();
          newExtData.slected = true;
          this.setOptions({strokeColor: this.selectedColor, fillColor: this.selectedColor});
          this.setExtData(newExtData);
        }
      })
      polygonEcLand.on("mouseover", function (e) {
        // console.log(e)
        // var lanTitle = idustryParkName;
        // var landArea = this.getExtData().landArea;
        // var landUsrNature = this.getExtData().landUsrNature;
        // var that = this;
        // var options = {lanTitle:lanTitle,landArea:landArea,landUsrNature:landUsrNature,polygon:that}
        // landInfoWindowFn(map,options);
      })
      polygonEcLand.on("mouseout", function (e) {
        // landInfoWindow.close()
      })
      // console.log(polygon)
      polygonEcLand.setPath(pointers);

    }
  }
  /*楼宇信息*/
  parkBuildInfo(map, parkName) {
    const _that = this;
    AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'],
      function(MarkerList, SimpleMarker, SimpleInfoWindow) {

        const defaultIconStyle = {
            src: '../assets/images/build_position_icon.png',
            style: {
              width: '40px',
              height: '50px'
            }
          }, // 默认的图标样式
          // hoverIconStyle = 'green', //鼠标hover时的样式
          hoverIconStyle = {
            src: '../assets/images/build_position_icon.png',
            style: {
              width: '60px',
              height: '70px'
            }
          }, // 鼠标hover时的样式
          selectedIconStyle = {
            src: '../assets/images/build_position_icon.png',
            style: {
              width: '60px',
              height: '70px'
            }
          } // 选中时的图标样式
        ;
        const iconOffset = {
          defaultOffset: new AMap.Pixel(-20, -35), // 默认的图标样式
          hoverOffset: new AMap.Pixel(-28, -50), // 鼠标hover时的样式
          selectedOffset: new AMap.Pixel(-28, -50) // 选中时的图标样式
        };
        const markerList = new MarkerList({
          map: map,
          // ListElement对应的父节点或者ID
          listContainer: 'myList', // document.getElementById("myList"),
          // 选中后显示

          // 从数据中读取位置, 返回lngLat
          getPosition: function(item) {
            // return [item.longitude, item.latitude];
            return item.position;
          },
          // 数据ID，如果不提供，默认使用数组索引，即index
          getDataId: function(item, index) {

            return item.id;
          },
          getInfoWindow: function(data, context, recycledInfoWindow) {
            const tpl = '<div class="build-info-window"><%- data.name %><div>';
            // MarkerList.utils.template支持underscore语法的模板
            const content = MarkerList.utils.template(tpl, {
              data: data
            });
            if (recycledInfoWindow) {

              // recycledInfoWindow.setInfoTitle(data.name);
              // recycledInfoWindow.setInfoBody(data.address);
              recycledInfoWindow.setContent(content);

              return recycledInfoWindow;
            }

            // return new SimpleInfoWindow({
            //     /*infoTitle: data.name,
            //     infoBody: data.address,*/
            //     offset: new AMap.Pixel(0, -37),
            //     content: content
            // });
            return new AMap.InfoWindow({
              /*infoTitle: data.name,
              infoBody: data.address,*/
              offset: new AMap.Pixel(-15, -37),
              content: content
            });
          },
          // 构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
          getMarker: function(data, context, recycledMarker) {

            const label = String.fromCharCode('A'.charCodeAt(0) + context.index);

            if (recycledMarker) {
              recycledMarker.setIconLabel(label);
              return;
            }

            return new SimpleMarker({
              containerClassNames: 'build-marker',
              iconStyle: defaultIconStyle,
              // iconLabel: label,
              // 设置基点偏移
              offset: iconOffset.defaultOffset
            });
          },
          // 构造列表元素，与getMarker类似，可以是函数，返回一个dom元素，或者模板 html string
          getListElement: function(data, context, recycledListElement) {
            // console.log(data,context,recycledListElement)
            const label = String.fromCharCode('A'.charCodeAt(0) + context.index);

            // 使用模板创建
            const innerHTML = MarkerList.utils.template(
              '<div class="poi-info-left">' +
              '    <h5 class="poi-title"><span class="fa fa-building-o build-name-icon"></span>' +
              '        <%- data.name %>' +
              '    </h5>' +
              '</div>' +
              '<div class="clear"></div>', {
                data: data,
                label: label
              });

            if (recycledListElement) {
              recycledListElement.innerHTML = innerHTML;
              return recycledListElement;
            }

            return '<li class="poibox">' +
              innerHTML +
              '</li>';
          },
          // 列表节点上监听的事件
          listElementEvents: ['click', 'mouseenter', 'mouseleave'],
          // marker上监听的事件
          markerEvents: ['click', 'mouseover', 'mouseout'],
          // makeSelectedEvents:false,
          selectedClassNames: 'selected',
          autoSetFitView: false
        });

        // window.markerList = markerList;

        markerList.on('selectedChanged', function(event, info) {
          // $("#myList").hide();
          map.panBy(-580, 40);
          // $("#myList").slideUp("fast");
          // $(".build-arrow").removeClass("active");
          if (info.selected) {
            _that.intermediateService.getBuildCompanyList(info.selected.data.id);
            _that.intermediateService.changeShowHideData('showBuildMarkerEl', false, info.selected.data.name, info.selected.data.id);
            // $(".choose-park-buid-name").html(info.selected.data.name);
            // chooseBuildName = info.selected.data.name;
            // chooseBuildId = info.selected.data.id;

            /*if($(".industry-menu .menu-row:last-child li.active").length){
                $(".industry-menu .menu-row:last-child li.active").click();
            }else{
                $(".industry-menu .menu-row:last-child li:first-child").click();
            }*/
            console.log(info);

            if (info.selected.marker) {
              // 更新为选中样式
              info.selected.marker.setIconStyle(selectedIconStyle);
              info.selected.marker.setOffset(iconOffset.selectedOffset);
            }

            // 选中并非由列表节点上的事件触发，将关联的列表节点移动到视野内
            if (!info.sourceEventInfo.isListElementEvent) {

              if (info.selected.listElement) {
                // scrollListElementIntoView($(info.selected.listElement));
              }
            }
          }

          if (info.unSelected && info.unSelected.marker) {
            // 更新为默认样式
            info.unSelected.marker.setIconStyle(defaultIconStyle);
            info.unSelected.marker.setOffset(iconOffset.defaultOffset);
          }
        });

        markerList.on('listElementMouseenter markerMouseover', function(event, record) {

          if (record && record.marker) {

            forcusMarker(record.marker);

            // this.openInfoWindowOnRecord(record);

            // 非选中的id
            if (!this.isSelectedDataId(record.id)) {
              // 设置为hover样式
              record.marker.setIconStyle(hoverIconStyle);
              record.marker.setOffset(iconOffset.hoverOffset);
              // this.closeInfoWindow();
            }
          }
        });

        markerList.on('listElementMouseleave markerMouseout', function(event, record) {

          if (record && record.marker) {

            if (!this.isSelectedDataId(record.id)) {
              // 恢复默认样式
              record.marker.setIconStyle(defaultIconStyle);
              record.marker.setOffset(iconOffset.defaultOffset);
            }
          }
        });

        // 数据输出完成
        markerList.on('renderComplete', function(event, records) {
          map.setFitView();
          map.panBy(-580, 40);

        });

        // markerList.on('*', function(type, event, res) {
        //     console.log(type, event, res);
        // });

        // 加载数据
        function loadData(src, callback) {
          console.log(src)
          /*$.getJSON(src, function(data) {
              console.log(data.result)
  for(var i=0;i<data.result.length;i++){
                  if(parkName == data.result[i].name){

                      //渲染数据
                      markerList.render(data.result[i].info);
                  }
  }
          // markerList._dataSrc = src;

          //渲染数据
          // markerList.render(data);
          // markerList.render(testData);

          if (callback) {
              callback(null, data);
          }
          });*/
          // markerList.render(testData);
          /*$.ajax({
            // url:"/v1/company/getLet",
            url:"/v1/floor/findAll",
            type:"GET",
            dataType:"json",
            data:{},
            success:function(res){
              const result = [];
              for (let i = 0; i < res.length; i++) {
                if (res[i].coordinate) {
                  let list = {id: '', name: '', position: []};
                  list = res[i];
                  list.id = res[i].id;
                  list.name = res[i].floorName;
                  list.position = res[i].coordinate.split(',');
                  result.push(list);
                }
              }
              /!*for(var k in res){
                  var list={};
                  list.name = k;
                  list.position = res[k].split(",");
                  result.push(list);
              }*!/
              // 渲染数据
              markerList.render(result);
            },error:function(err){
              console.log(err)
            }


          })*/
        }
        _that.intermediateService.getBuildPositionList().subscribe(res => {
          const result = [];
          for (let i = 0; i < res.length; i++) {
            if (res[i].coordinate) {
              let list = {id: '', name: '', position: []};
              list = res[i];
              list.id = res[i].id;
              list.name = res[i].floorName;
              list.position = res[i].coordinate.split(',');
              result.push(list);
            }
          }
          // 渲染数据
          markerList.render(result);
        })
        // loadData($btns.attr('data-path'));
        // loadData("http://localhost:63342/economic/middleViews/test.json");
        // loadData("/economic/middleViews/test.json");
        // loadData();

        function forcusMarker(marker) {
          marker.setTop(true);
          // map.panBy(-580,40);
          // 不在地图视野内
          if (!(map.getBounds().contains(marker.getPosition()))) {

            // 移动到中心
            // map.setCenter(marker.getPosition());
          }
        }

        function isElementInViewport(el) {
          const rect = el.getBoundingClientRect();

          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
          );
        }
      });
  }
  /*绘制园区产业企业分布数据*/
  creatParkIndustryFenbu(map) {
    AMapUI.load(['ui/misc/PointSimplifier'], (PointSimplifier) => {

      if (!PointSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！');
        return;
      }
      this.pointSimplifierIns = new PointSimplifier({
        autoSetFitView: false,//是否自适应能查看所有点
        map: map, //关联的map
        //compareDataItem: function(a, b, aIndex, bIndex) {
        //数据源中靠后的元素优先，index大的排到前面去
        //    return aIndex > bIndex ? -1 : 1;
        //},
        getPosition: function(dataItem) {
          //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
          return dataItem.pos.split(",");
        },
        getHoverTitle: function(dataItem, idx) {
          //返回数据项的Title信息，鼠标hover时显示
          return `${dataItem.name}<br/>${dataItem.address}`;
        },
        //使用GroupStyleRender
        renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
        renderOptions: {
          //点的样式
          pointStyle: {
            fillStyle: 'blue',
            width: 16,
            height: 16
          },
          //鼠标hover时的title信息
          hoverTitleStyle: {
            position: 'top'
          },
          //getGroupId和groupStyleOptions连用,groupStyleOptions方法参为getGroupId方法返回值
          getGroupId: function(item, idx) {//item数据项,idx数据项索引
            //按纬度区间分组
            return item.color;
          },
          groupStyleOptions: function(type) {
            return {
              pointStyle: {
                fillStyle: type
              }
            };
          }

        }
      });


      const pointsData = [];
      //点数据
      const colorsData = ['#f9b621','#9ea8ff','#21cbee','#5f6599','#f43723','#0d4954'];
      pointsData.push({name:'成都里来生物医学实验中心',address:'成都市天府生命科技园',color:colorsData[2],pos:'104.030935,30.616002'});
      pointsData.push({name:'成都顺意丰医药有限公司',address:'成都市天府生命科技园',color:colorsData[2],pos:'104.028606,30.614395'});
      pointsData.push({name:'成都新光微波工程有限责任公司',address:'成都市天府生命科技园',color:colorsData[2],pos:'104.02748,30.616094'});
      pointsData.push({name:'吉锐科技',address:'成都市天府生命科技园',color:colorsData[0],pos:'104.030752,30.612447'});
      pointsData.push({name:'九章生物',address:'成都市天府生命科技园',color:colorsData[5],pos:'104.030822,30.611884'});
      pointsData.push({name:'四川大学华西临床医学院科技园',address:'成都市天府生命科技园',color:colorsData[2],pos:'104.032497,30.618552'});
      pointsData.push({name:'四川川大华西医药股份有限公司',address:'成都市天府生命科技园',color:colorsData[4],pos:'104.035431,30.619032'});
      pointsData.push({name:'华西海圻医药科技有限公司',address:'成都市天府生命科技园',color:colorsData[2],pos:'104.034584,30.617661'});
      pointsData.push({name:'地奥基因工程中心',address:'成都市天府生命科技园',color:colorsData[2],pos:'104.039148,30.619296'});
      pointsData.push({name:'成都蓉生药业有限责任公司',address:'成都市天府生命科技园',color:colorsData[5],pos:'104.030822,30.611884'});
      pointsData.push({name:'贝瑞科技',address:'成都市天府生命科技园',color:colorsData[0],pos:'104.028853,30.61126'});
      pointsData.push({name:'麦克奥迪(成都)仪器有限公司',address:'成都市天府生命科技园',color:colorsData[1],pos:'104.029363,30.609612'});
      pointsData.push({name:'中国科学院成都科学仪器研制中心',address:'成都市天府生命科技园',color:colorsData[1],pos:'104.031342,30.609192'});
      pointsData.push({name:'腾讯大厦',address:'成都市天府软件园',color:colorsData[0],pos:'104.063057,30.547501'});
      pointsData.push({name:'富士康(成都)通讯科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.071323,30.549058'});
      pointsData.push({name:'聚乐科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.071195,30.544004'});
      pointsData.push({name:'炎雨科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.070578,30.544706'});
      pointsData.push({name:'新浪四川',address:'成都市天府软件园',color:colorsData[0],pos:'104.071484,30.542156'});
      pointsData.push({name:'去哪儿网公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.064328,30.541098'});
      pointsData.push({name:'北京趣拿公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.06413,30.54071'});
      pointsData.push({name:'成都优途科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.056105,30.539245'});
      pointsData.push({name:'中国电信中国西部信息中心',address:'成都市天府软件园',color:colorsData[3],pos:'104.055332,30.540562'});
      pointsData.push({name:'长虹智慧健康公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.063953,30.542073'});
      pointsData.push({name:'阿里巴巴西部基地',address:'成都市天府软件园',color:colorsData[4],pos:'104.061094,30.540922'});
      pointsData.push({name:'九州电子科技股份有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.06413,30.54071'});
      pointsData.push({name:'成都德尚视云科技有限公司',address:'天府新谷',color:colorsData[0],pos:'104.056565,30.58678'});
      pointsData.push({name:'北京鼎汉技术股份有限公司',address:'天府新谷',color:colorsData[0],pos:'104.056415,30.585884'});
      pointsData.push({name:'大金空调',address:'天府新谷',color:colorsData[1],pos:'104.05561,30.587902'});
      pointsData.push({name:'南京普杰物联网技术有限公司川渝办事处',address:'天府新谷',color:colorsData[0],pos:'104.051533,30.587995'});
      pointsData.push({name:'成都雅莱生物科技有限公司',address:'天府新谷',color:colorsData[2],pos:'104.060583,30.583293'});
      pointsData.push({name:'成都数银科技有限公司',address:'孵化园',color:colorsData[0],pos:'104.062505,30.573568'});
      pointsData.push({name:'四川格锐乾图科技有限公司',address:'孵化园',color:colorsData[0],pos:'104.060435,30.572349'});
      pointsData.push({name:'四川美都药业有限公司',address:'孵化园',color:colorsData[2],pos:'104.060059,30.573374'});
      pointsData.push({name:'四川盛宝龙科技有限公司',address:'孵化园',color:colorsData[0],pos:'104.066872,30.577115'});
      pointsData.push({name:'四川驰鼎盛通生物工程研究院',address:'孵化园',color:colorsData[2],pos:'104.066571,30.574815'});
      pointsData.push({name:'成都金山数字娱乐科技有限公司',address:'孵化园',color:colorsData[0],pos:'104.063106,30.573097'});
      pointsData.push({name:'四川中科方案科技有限公司',address:'孵化园',color:colorsData[0],pos:'104.06111,30.573125'});
      pointsData.push({name:'成都科达光电技术有限公司',address:'孵化园',color:colorsData[0],pos:'104.060789,30.573453'});
      pointsData.push({name:'成都时速光年科技有限公司',address:'孵化园',color:colorsData[0],pos:'104.062693,30.571545'});
      pointsData.push({name:'成都泓淼信息科技有限公司',address:'孵化园',color:colorsData[5],pos:'104.059807,30.571291'});
      pointsData.push({name:'成都蓉生药业有限责任公司',address:'成都市天府生命科技园',color:colorsData[4],pos:'104.029375,30.611693'});
      pointsData.push({name:'成都倍特药业有限公司',address:'成都市天府生命科技园',color:colorsData[2],pos:'104.039026,30.620472'});
      pointsData.push({name:'四川远大蜀阳药业股份有限公司',address:'成都市天府软件园',color:colorsData[2],pos:'104.077584,30.533993'});
      pointsData.push({name:'成都睿智化学研究有限公司',address:'成都市天府生命科技园',color:colorsData[2],pos:'104.03203,30.615672'});
      pointsData.push({name:'成都朋万科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.071528,30.543274'});
      pointsData.push({name:'成都超级梦网络技术股份有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.036172,30.619077'});
      pointsData.push({name:'成都四方伟业软件股份有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.0382,30.619681'});
      pointsData.push({name:'成都市云中游科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.056494,30.5387068'});
      pointsData.push({name:'成都逸动无限网络科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.061067,30.574054'});
      pointsData.push({name:'成都深思科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.060792,30.567247'});
      pointsData.push({name:'成都国腾信息安全技术有限责任公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.06054,30.549343'});
      pointsData.push({name:'成都三零普瑞科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.059909,30.549502'});
      pointsData.push({name:'成都铁皮人科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.05553,30.58614'});
      pointsData.push({name:'四川星盾科技股份有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.060453,30.574588'});
      pointsData.push({name:'成都铁皮人科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.05353,30.58314'});
      pointsData.push({name:'四川星盾科技股份有限公司',address:'成都市天府软件园',color:colorsData[5],pos:'104.058453,30.577588'});
      pointsData.push({name:'成都铁皮人科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.05753,30.58914'});
      pointsData.push({name:'四川星盾科技股份有限公司',address:'成都市天府软件园',color:colorsData[2],pos:'104.062453,30.577588'});
      pointsData.push({name:'某某机械有限公司',address:'孵化园',color:colorsData[1],pos:'104.066106,30.572597'});
      pointsData.push({name:'南京普杰物联网技术有限公司川渝办事处',address:'天府新谷',color:colorsData[0],pos:'104.051523,30.587795'});
      pointsData.push({name:'南京普杰物联网技术公司川渝办事处',address:'天府新谷',color:colorsData[0],pos:'104.051513,30.587895'});
      pointsData.push({name:'普杰物联网技术有限公司川渝办事处',address:'天府新谷',color:colorsData[0],pos:'104.051543,30.588045'});
      pointsData.push({name:'南京普杰物联网有限公司川渝办事处',address:'天府新谷',color:colorsData[0],pos:'104.052533,30.587995'});
      pointsData.push({name:'南京普杰物联网技术有限公司',address:'天府新谷',color:colorsData[0],pos:'104.052523,30.587795'});
      pointsData.push({name:'南京普杰物联网技术有限公司办事处',address:'天府新谷',color:colorsData[0],pos:'104.053513,30.587895'});
      pointsData.push({name:'南京普杰物联网技术有限公司川办事处',address:'天府新谷',color:colorsData[0],pos:'104.054543,30.588045'});
      pointsData.push({name:'南京普杰物联网技术有限公司渝办事处',address:'天府新谷',color:colorsData[2],pos:'104.052533,30.587995'});
      pointsData.push({name:'南京普杰物联网技术有限公司',address:'天府新谷',color:colorsData[0],pos:'104.055523,30.588795'});
      pointsData.push({name:'南京普杰物联网技术有限公司办事处',address:'天府新谷',color:colorsData[0],pos:'104.056513,30.589895'});
      pointsData.push({name:'南京普杰物联网技术有限公司川办事处',address:'天府新谷',color:colorsData[0],pos:'104.057543,30.590045'});
      pointsData.push({name:'南京普杰物联网技术有限公司渝办事处',address:'天府新谷',color:colorsData[2],pos:'104.058533,30.591995'});
      pointsData.push({name:'南京普杰物联网技术有限公司',address:'天府新谷',color:colorsData[0],pos:'104.051523,30.586795'});
      pointsData.push({name:'南京普杰物联网技术有限公司办事处',address:'天府新谷',color:colorsData[2],pos:'104.050513,30.587595'});
      pointsData.push({name:'南京普杰物联网技术有限公司川办事处',address:'天府新谷',color:colorsData[0],pos:'104.049543,30.584045'});
      pointsData.push({name:'南京普杰物联网技术有限公司渝办事处',address:'天府新谷',color:colorsData[1],pos:'104.048533,30.583995'});
      pointsData.push({name:'聚乐科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.073195,30.545004'});
      pointsData.push({name:'炎雨科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.074578,30.545706'});
      pointsData.push({name:'新浪四川',address:'成都市天府软件园',color:colorsData[0],pos:'104.075484,30.541156'});
      pointsData.push({name:'去哪儿网公司',address:'成都市天府软件园',color:colorsData[5],pos:'104.066328,30.540098'});
      pointsData.push({name:'北京趣拿公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.06713,30.54871'});
      pointsData.push({name:'聚乐科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.071195,30.542004'});
      pointsData.push({name:'炎雨科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.070578,30.542706'});
      pointsData.push({name:'新浪四川',address:'成都市天府软件园',color:colorsData[0],pos:'104.071484,30.540156'});
      pointsData.push({name:'去哪儿网公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.064328,30.539098'});
      pointsData.push({name:'北京趣拿公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.06413,30.53871'});
      pointsData.push({name:'成都优途科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.056105,30.537245'});
      pointsData.push({name:'中国电信中国西部信息中心',address:'成都市天府软件园',color:colorsData[3],pos:'104.055332,30.538562'});


      pointsData.push({name:'聚乐科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.071195,30.540004'});
      pointsData.push({name:'炎雨科技有限公司',address:'成都市天府软件园',color:colorsData[1],pos:'104.070578,30.540706'});
      pointsData.push({name:'新浪四川',address:'成都市天府软件园',color:colorsData[0],pos:'104.071484,30.538156'});
      pointsData.push({name:'去哪儿网公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.064328,30.537098'});
      pointsData.push({name:'北京趣拿公司',address:'成都市天府软件园',color:colorsData[4],pos:'104.06413,30.53671'});
      pointsData.push({name:'成都优途科技有限公司',address:'成都市天府软件园',color:colorsData[1],pos:'104.056105,30.535245'});
      pointsData.push({name:'成都朋万科技有限公司',address:'成都市天府软件园',color:colorsData[4],pos:'104.071528,30.541274'});
      pointsData.push({name:'成都超级梦网络技术股份有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.036172,30.617077'});
      pointsData.push({name:'成都四方伟业软件股份有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.0382,30.617681'});
      pointsData.push({name:'聚乐科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.081195,30.540004'});
      pointsData.push({name:'炎雨科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.080578,30.540706'});
      pointsData.push({name:'新浪四川',address:'成都市天府软件园',color:colorsData[0],pos:'104.081484,30.538156'});
      pointsData.push({name:'去哪儿网公司',address:'成都市天府软件园',color:colorsData[5],pos:'104.074328,30.537098'});
      pointsData.push({name:'北京趣拿公司',address:'成都市天府软件园',color:colorsData[1],pos:'104.07413,30.53671'});
      pointsData.push({name:'成都优途科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.066105,30.535245'});
      pointsData.push({name:'成都朋万科技有限公司',address:'成都市天府软件园',color:colorsData[0],pos:'104.081528,30.541274'});

      this.pointSimplifierIns.setData(pointsData);
    });

    const provinces = [
      {
        "name": "天府新谷",
        "center": "104.05568,30.586697",
        "type": 0,
        "radius": 830,
        "color": "#FFF68F"
      },
      {
        "name": "成都高新孵化园",
        "center": "104.063923,30.57371",
        "type": 0,
        "radius": 830,
        "color": "#FFF68F"
      },
      {
        "name": "天府生命科技园",
        "center": "104.030421,30.61563",
        "type": 1,
        "radius": 1000,
        "color": "#b3eebe"
      },
      {
        "name": "天府软件园",
        "center": "104.071199,30.541204",
        "type": 1,
        "radius": 1600,
        "color": "#FFF68F"
      }
    ];

    for (let i = 0; i < provinces.length; i++) {
      console.log(provinces[i].center.split(',')[0])
      this.plotArea(map, provinces[i].center.split(',')[0], provinces[i].center.split(',')[1], provinces[i].radius, provinces[i].color, provinces[i].name, (e) => {
        const option = e;
        e.circle.on("mouseover",function(e){
          option.circle.setOptions({strokeOpacity:0.8,strokeWeight:5,zIndex:999});
          option.infoWindow.setContent(e.target.getExtData().title);
          option.infoWindow.open(option.map, [e.lnglat.getLng(),e.lnglat.getLat()]);
        })
        e.circle.on("mouseout",function(e){
          option.circle.setOptions({strokeOpacity:0,strokeWeight:0,zIndex:9});
          option.infoWindow.close();
        })
        e.circle.on("click", (e) => {
          // createcy(e.target.getExtData().title);
          const parkIndustryName = e.target.getExtData().title;
          this.industryMapFenbuService.changeSelectParkIndustry(parkIndustryName);
        });
      });
    }
  }
  /*绘制主导产业分布数据*/
  creatLeadIndustryFenbuMap(map, options) {
    const provinces = options;
    for (let i = 0; i < provinces.length; i++) {
      this.plotArea(map,provinces[i].center.split(',')[0],provinces[i].center.split(',')[1],provinces[i].radius,provinces[i].color,provinces[i].name,(e) => {
        const option = e;
        /*e.marker.on("click",function(e){
            console.log(e.target.getTitle())
            zhudaocyName = e.target.getTitle();
            $("#pageViews").load("cyMapViews/zhudaocyfb.html");
        })*/
        e.circle.on("click", (e) => {
          console.log(e.target.getExtData().title)
          const zhudaocyName = e.target.getExtData().title;
          this.industryMapFenbuService.changeSelectLeadIndustry(zhudaocyName);
        })
        e.circle.on("mouseover",function(e){
          option.circle.setOptions({strokeOpacity:0.8,strokeWeight:5,zIndex:999});
          console.log(e.target.getExtData().title)
          option.infoWindow.setContent(e.target.getExtData().title);
          option.infoWindow.open(option.map, [e.lnglat.getLng(),e.lnglat.getLat()]);
        })
        e.circle.on("mouseout",function(e){
          option.circle.setOptions({strokeOpacity:0,strokeWeight:0,zIndex:9});
          option.infoWindow.close();
        });
      });
    }
  }
  /*绘制新兴产业分布数据*/
  creatNewIndustryFenbuMap(map, options) {
    const provinces = options;
    for (let i = 0; i < provinces.length; i++) {
      this.plotArea(map,provinces[i].center.split(',')[0],provinces[i].center.split(',')[1],provinces[i].radius,provinces[i].color,provinces[i].name,(e) => {
        const option = e;
        /*e.marker.on("click",function(e){
            console.log(e.target.getTitle())
            zhudaocyName = e.target.getTitle();
            $("#pageViews").load("cyMapViews/zhudaocyfb.html");
        })*/
        e.circle.on("click", (e) => {
          console.log(e.target.getExtData().title)
          const xinxingcyName = e.target.getExtData().title;
          this.industryMapFenbuService.changeSelectNewIndustry(xinxingcyName);
        })
        e.circle.on("mouseover",function(e){
          option.circle.setOptions({strokeOpacity:0.8,strokeWeight:5,zIndex:999});
          console.log(e.target.getExtData().title)
          option.infoWindow.setContent(e.target.getExtData().title);
          option.infoWindow.open(option.map, [e.lnglat.getLng(),e.lnglat.getLat()]);
        })
        e.circle.on("mouseout",function(e){
          option.circle.setOptions({strokeOpacity:0,strokeWeight:0,zIndex:9});
          option.infoWindow.close();
        });
      });
    }
  }
  /*绘制自定义产业分布数据*/
  creatCustomizeIndustryFenbuMap(map, options) {
    const markers = options;
    for (let i = 0; i < markers.length; i++) {
      console.log(markers[i].color);
      this.plotArea(map,markers[i].center.split(',')[0],markers[i].center.split(',')[1],markers[i].radius,markers[i].color,markers[i].name,(e) => {
        const option = e;
        e.circle.on("click",(e) => {
          const customizeIndustryName = e.target.getExtData().title;
          this.industryMapFenbuService.changeSelectCustomizeIndustry(customizeIndustryName);
        })
        e.circle.on("mouseover",function(e){
          console.log(e.target.getExtData().title)
          option.infoWindow.setContent(e.target.getExtData().title);
          option.infoWindow.open(option.map, [e.lnglat.getLng(),e.lnglat.getLat()]);
        })
        e.circle.on("mouseout",function(e){
          option.infoWindow.close()
        })
      });
    }
  }
  plotArea(map, longitude, latitude, radius, color, title, callback) {
    const circle = new AMap.Circle({//创建圆圈
      center: new AMap.LngLat(longitude+'', latitude+''),// 圆心位置
      radius: radius, //半径
      strokeColor: color, //线颜色
      strokeOpacity: 0, //线透明度
      strokeWeight: 0, //线粗细度
      fillColor: color, //填充颜色
      fillOpacity: 0.8,//填充透明度
      extData:{title:title}
    });
    circle.setMap(map);
    /*circle.on("click",function(e){
        /!*if(type){
            return $("#pageViews").load("cyMapViews/zhudaocyfb.html");
  }*!/
        console.log(e)
    })*/
    const infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    /*var marker = new AMap.Marker({//创建圆上面的点标记
        position: [longitude+'', latitude+''],
        title: title,
        content: "<span style='color: #142136;font-size: 14px;white-space: nowrap;'>"+title+"</span>"//将点标记图片替换为文字，不需要的话删除即可
    });
    marker.setMap(map);*/
    map.setFitView();
    map.panBy(-580,-40);
//        var options = {marker:marker,circle:circle,map:map,infoWindow:infoWindow};
    const options = {circle:circle,map:map,infoWindow:infoWindow};
    if (callback) {
      return callback(options);
    }
  }
}
