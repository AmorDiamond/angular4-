import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { MapStore } from "../map-store/map.model";
import { Router } from '@angular/router';
import { ADDPARKMARK, ADDENTERPRISEMARK, CLEARMARK } from "../map-store/map.actions";
import { MapService } from "./map.service";
import { HomeService } from "../../pages/home/home.service";

declare var AMap: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(
    private mapStore: Store<MapStore>,
    private router: Router,
    private mapService: MapService,
    private homeService: HomeService
  ) {
    this.mapStore$ = mapStore.pipe(select('map'));
  }
  Map: any;
  areaMarks = [];
  mapStore$: any;
  areaParkName: any;
  rangePositions = {
    westPoints: [],
    southPoints: [],
    eastPoints: [],
    biologicalCityPoints: [],
  };
  rangeArry = {
    westRange: null,
    southRange: null,
    eastRange: null,
    biologicalCityRange: null,
  };
  rangePolygonConfig = {
    strokeColor: '#00c3ff',
    strokeWeight: '',
    fillColor: '#06a0e7',
    fillOpacity: 0.12
  };
  showLoading = false;
  parkHeatmap: any = {};
  parkHeatmapData: any;
  parkEnterpriseData: any = {
    '高新西区': 0,
    '高新南区': 0,
    '高新东区': 0,
    '天府国际生物城': 0,
  };
  parkMarkClickName = '';
  mainPointsMark: any;
  ngOnInit() {
    const creatMap = this.creatMap();
    // 保证地图加载完并且绘制完parkRange
    creatMap.then((res) => {
      // 监听home组件获取到heatmap所需数据后进行绘制
      this.homeService.getHeatmapData().subscribe(res => {
        this.parkHeatmapData = res;
        this.parkHeatmapData && this.createParkHeatmap();
      });
      this.mapStore$.subscribe(res => {
        const data = res.data;
        if (data.type == ADDENTERPRISEMARK) {
          // this.parkHeatmap && this.parkHeatmap.hide();
          for (const i in this.parkHeatmap) {
            this.parkHeatmap[i] && this.parkHeatmap[i].hide();
          }
          this.createMainPointsMark(); // 绘制主要兴趣点
          const imgName = data.img;
          const router = data.router;
          const options = data.options;
          if (!data.detail) {
            this.creatEnterpriseMark(imgName, options);
          } else {
            this.creatEnterpriseDetailMark(imgName, options)
          }
        } else if (data.type == CLEARMARK) {
          this.clearMark();
        } else if (data.type == ADDPARKMARK) {
          this.areaParkName = data.options;
          // this.creatParkRange();
          this.creatParkMark();

          if (this.mainPointsMark) { // home页面隐藏自定义的兴趣点
            this.mainPointsMark.forEach(item => {
              item.hide();
            });
            return;
          }
        }
      });
    });
  }
  creatMap () {
    return new Promise((resolve, reject) => {
      this.Map = new AMap.Map('map-container', {
        mapStyle: 'amap://styles/31de9aab619163969cccb46cda057329',
        zooms: [10, 18],
        features: ['road', 'building']
      });
      const bounds = new AMap.Bounds([103.127091,30.139474], [105.004379,31.176667]);
      this.Map.setLimitBounds(bounds);
      this.Map.on("complete", () => {
        if (this.rangeArry.westRange) {
          return;
        }
        this.rangePositions = this.mapService.getRangePositions();
        this.parkEnterpriseData = this.mapService.getParkEnterprise();
        this.creatParkRange();
        resolve()
      });
    });
  }
  creatParkRange () {
    console.log('creatParkRange')
    const map = this.Map;
    /*if (this.rangeArry.westRange) { // 如果parkRange已绘制则直接处理parkMark，可以实现通过range的center绘制mark
      this.creatParkMark();
      return;
    }*/
    const westRange = new AMap.Polygon({
      map: map,
      path: this.rangePositions.westPoints,
      strokeColor: this.rangePolygonConfig.strokeColor,
      fillColor: this.rangePolygonConfig.fillColor,
      fillOpacity: this.rangePolygonConfig.fillOpacity,
    });
    this.rangeArry.westRange = westRange;
    const southRange = new AMap.Polygon({
      map: map,
      path: this.rangePositions.southPoints,
      strokeColor: this.rangePolygonConfig.strokeColor,
      fillColor: this.rangePolygonConfig.fillColor,
      fillOpacity: this.rangePolygonConfig.fillOpacity,
    });
    this.rangeArry.southRange = southRange;
    const eastRange = new AMap.Polygon({
      map: map,
      path: this.rangePositions.eastPoints,
      strokeColor: this.rangePolygonConfig.strokeColor,
      fillColor: this.rangePolygonConfig.fillColor,
      fillOpacity: this.rangePolygonConfig.fillOpacity,
    });
    this.rangeArry.eastRange = eastRange;
    const biologicalCityRange = new AMap.Polygon({
      map: map,
      path: this.rangePositions.biologicalCityPoints,
      strokeColor: this.rangePolygonConfig.strokeColor,
      fillColor: this.rangePolygonConfig.fillColor,
      fillOpacity: this.rangePolygonConfig.fillOpacity,
    });
    this.rangeArry.biologicalCityRange = biologicalCityRange;
    // this.creatParkMark();
    // this.createParkHeatmap();
    /*new AMap.ImageLayer({
      map: map,
      url: 'assets/images/xiqu_area_range.png',
      bounds: new AMap.Bounds([103.745758,30.736217], [103.961365,30.913112])
    });
    new AMap.ImageLayer({
      map: map,
      url: 'assets/images/nanqu_area_range.png',
      bounds: new AMap.Bounds([103.964111,30.498669], [104.207184,30.629924])
    });
    new AMap.ImageLayer({
      map: map,
      url: 'assets/images/guoji_area_range.png',
      bounds: new AMap.Bounds([103.835022,30.285445], [104.052002,30.465531])
    });
    new AMap.ImageLayer({
      map: map,
      url: 'assets/images/dongqu_area_range.png',
      bounds: new AMap.Bounds([104.154999,29.917138], [104.610932,30.420541])
    });*/
  }
  createParkHeatmap () {
    const heatmapData = this.parkHeatmapData;
    const map = this.Map;
    map.plugin(["AMap.Heatmap"], () => {
      //初始化heatmap对象
      for (const item in heatmapData) { // 遍历生成四个园区的热力图
        this.parkHeatmap[item] = new AMap.Heatmap(map, {
          radius: 25, //给定半径
          opacity: [0, 1],
          gradient: {
            0.2:'#e9d48b',
            0.4:'#ffe700',
            0.8:'#ffc500',
            0.95:'#ef7530',
            1.0:'#ec4141'
          }
        });
        let max = null;
        // 处理西区和南区热力图最大值
        switch (item) {
          case 'west':
            max = 200;
          break;
          case 'south':
            max = 2000;
          break;
        }
        //设置数据集
        this.parkHeatmap[item].setDataSet({
          data: heatmapData[item],
          max: max
        });
      }
      /*this.parkHeatmap = new AMap.Heatmap(map, {
        radius: 10, //给定半径
        opacity: [0, 1],
        gradient: {
          0.2:'#e9d48b',
          0.4:'#ffe700',
          0.8:'#ffc500',
          0.95:'#ef7530',
          1.0:'#ec4141'
        }
      });
      //设置数据集
      this.parkHeatmap.setDataSet({
        data: heatmapData,
        max: 1000
      });*/
    });
  }
  creatParkMark() {
    console.log('creatParkMark')
    // this.parkHeatmap && this.parkHeatmap.show();
    for (const i in this.parkHeatmap) {
      this.parkHeatmap[i] && this.parkHeatmap[i].show();
    }
    const map = this.Map;
    // this.Map.setZoom(10);
    map.remove(this.areaMarks);
    // 以 icon URL 的形式创建一个途经点
    const westCenter = this.rangeArry.westRange.getBounds().getCenter();
    const xiquMarker = new AMap.Marker({
      map: map,
      position: westCenter,
      // icon: 'assets/images/xiqu_mark_point_text.png',
      offset: new AMap.Pixel(-250, -30),
      content: `<div class="park-mark-box">
                  <div class="park-mark-con">
                    <div class="title">高新西区</div>
                    <p class="park-info">企业总量:<span class="number">${this.parkEnterpriseData['高新西区']}</span>家</p>
                  </div>
                </div>`,
      extData: {
        name: '高新西区',
        position: westCenter
      }
    });
    const southCenter = this.rangeArry.southRange.getBounds().getCenter();
    const nanquMarker = new AMap.Marker({
      map: map,
      position: southCenter,
      // icon: 'assets/images/nanqu_mark_point_text.png',
      offset: new AMap.Pixel(70, -40),
      content: `<div class="park-mark-box left-arrow">
                  <div class="park-mark-con">
                    <div class="title">高新南区</div>
                    <p class="park-info">企业总量:<span class="number">${this.parkEnterpriseData['高新南区']}</span>家</p>
                  </div>
                </div>`,
      extData: {
        name: '高新南区',
        position: southCenter
      }
    });
    const biologicalCityCenter = this.rangeArry.biologicalCityRange.getBounds().getCenter();
    const guojiMarker = new AMap.Marker({
      map: map,
      position: biologicalCityCenter,
      // icon: 'assets/images/guoji_mark_point_text.png',
      offset: new AMap.Pixel(-340, -40),
      content: `<div class="park-mark-box">
                  <div class="park-mark-con">
                    <div class="title">天府国际生物城</div>
                    <p class="park-info">企业总量:<span class="number">${this.parkEnterpriseData['天府国际生物城']}</span>家</p>
                  </div>
                </div>`,
      extData: {
        name: '天府国际生物城',
        position: biologicalCityCenter
      }
    });
    const eastCenter = this.rangeArry.eastRange.getBounds().getCenter();
    const dongquMarker = new AMap.Marker({
      map: map,
      position: eastCenter,
      // icon: 'assets/images/dongqu_mark_point_text.png',
      offset: new AMap.Pixel(-330, -20),
      content: `<div class="park-mark-box">
                  <div class="park-mark-con">
                    <div class="title">高新东区</div>
                    <p class="park-info">企业总量:<span class="number">${this.parkEnterpriseData['高新东区']}</span>家</p>
                  </div>
                </div>`,
      extData: {
        name: '高新东区',
        position: eastCenter
      }
    });
    this.areaMarks = [xiquMarker, nanquMarker, guojiMarker, dongquMarker];
    if (this.areaParkName) { // 判断是否通过点击parkMark进入的home页面
      this.areaMarks.forEach(item => {
        if (this.areaParkName === item.getExtData().name) {
          const parkCenter = item.getExtData().position;
          // this.Map.setCenter(parkCenter);
          this.Map.panTo(parkCenter);
          this.Map.setZoom(12);
        }
      });
    } else {
      this.Map.setFitView(this.areaMarks);
    }
    this.areaMarks.forEach(item => {

      item.on('click', (res) => {
        console.log(res.target.getExtData())
        const areaName = res.target.getExtData().name;
        this.areaParkName = areaName;
        this.router.navigate(['home'], {
          queryParams: {
            park: this.areaParkName
          }
        })
      })
    })
  }
  creatEnterpriseMark (markerColor, options) {
    console.log('creatEnterpriseMark')
    this.Map.remove(this.areaMarks);
    // this.Map.setZoom(11);
    // this.Map.setCenter([104.065837,30.657349]);
    // const icon = imgName ? imgName : 'enterprise_mark_point.png';
    const icon = markerColor ? markerColor : '#4fd0f7';
    options.forEach((item) => {
      if (!item.position) {
        return;
      }
      // 以 icon URL 的形式创建一个途经点
      const enterpriseMarker = new AMap.CircleMarker({
        map: this.Map,
        center: item.position,
        radius: 8,
        strokeColor: 'white',
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: icon,
        fillOpacity: 1,
        bubble: true,
        cursor: 'pointer',
        clickable: true,
        extData: {
          id: item.id,
          name: item.name,
          position: item.position
        }
      });
      /*const enterpriseMarker = new AMap.Marker({
        map: this.Map,
        position: item.position,
        icon: 'assets/images/' + icon,
        offset: new AMap.Pixel(-17, -39),
        extData: {
          id: item.id,
          name: item.name,
          position: item.position
        }
      });*/
      enterpriseMarker.on('click', (item) => {
        const event = item.target;
        const name = event.getExtData().name;
        const id = event.getExtData().id;
        const position = event.getExtData().position;
        const enterpriseData = [{id: id,name: name, position: position}];
        this.creatEnterpriseMark(icon, enterpriseData);
        const router = this.router.url.split('/')[1];
        this.router.navigate([router + '/detail', id])
      });
      this.areaMarks.push(enterpriseMarker);
    })
  }
  creatEnterpriseDetailMark (markerColor, options) {
    this.Map.remove(this.areaMarks);
    // const icon = imgName ? imgName : 'enterprise_mark_point.png';
    const icon = markerColor ? markerColor : '#4fd0f7';
    if (!options.position) {
      return;
    }
    this.Map.setZoom(11);
    this.Map.panTo(options.position);

    const enterpriseMarker = new AMap.CircleMarker({
      map: this.Map,
      center: options.position,
      radius: 8,
      strokeColor: 'white',
      strokeWeight: 2,
      strokeOpacity: 0.5,
      fillColor: icon,
      fillOpacity: 1,
      zIndex: 10,
      bubble: true,
      cursor: 'pointer',
      clickable: true,
      extData: {
        id: options.id,
        name: options.name,
        position: options.position
      }
    });
    // 以 icon URL 的形式创建一个途经点
    /*const enterpriseMarker = new AMap.Marker({
      map: this.Map,
      position: options.position,
      icon: 'assets/images/' + icon,
      offset: new AMap.Pixel(-17, -39),
      extData: {
        id: options.id,
        name: options.name,
        position: options.position
      }
    });*/
    this.areaMarks.push(enterpriseMarker);
  }
  clearMark() {
    this.Map.remove(this.areaMarks);
  }
  createMainPointsMark () {
    if (this.mainPointsMark) {
      this.mainPointsMark.forEach(item => {
        item.show();
      });
      return;
    }
    this.mainPointsMark = [];
    const mainPointData = [
      {name: '欧洲中心',position: [104.071103,30.536455]},
      {name: '菁蓉汇',position: [104.062619,30.539169]},
      {name: '孵化园',position: [104.066115,30.575503]},
      {name: '高新管委会',position: [104.065548,30.592033]},
      {name: '新川科技园',position: [104.081812,30.514978]},
      {name: '起步园',position: [104.02935,30.6121]},
      {name: '电子科技大学',position: [104.100227,30.675702]},
      {name: '西区孵化园',position: [103.972009,30.734946]},
      {name: '软件园A区',position: [104.070592,30.549197]},
      {name: '软件园B区',position: [104.070744,30.544608]},
      {name: '软件园C区',position: [104.071574,30.539826]},
      {name: '软件园D区',position: [104.07461,30.539879]},
      {name: '软件园E区',position: [104.068359,30.538196]},
      {name: '软件园F区',position: [104.062624,30.539245]},
      {name: '软件园G区',position: [104.055384,30.538718]}
    ];
    mainPointData.forEach(item => {
      var marker = new AMap.Marker({
        map: this.Map,
        position: item.position,
        icon: 'assets/images/building-point.png',
        offset: new AMap.Pixel(-16, 0),
        zooms: [13, 18],
        cursor: 'grab',
        label: {
          content: `<div class="main-point-con">${item.name}</div>`,
          offset: new AMap.Pixel(30, 8)
        }
      });
      this.mainPointsMark.push(marker);
    });
  }
}
