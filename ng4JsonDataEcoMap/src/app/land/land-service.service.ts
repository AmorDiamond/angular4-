import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var AMap: any;

@Injectable()
export class LandServiceService {

  constructor(private http: HttpClient) { }

  defaultBorderColor = '#ddba8a';
  defaultLandColor = 'transparent';
  selectedColor = '#41bb9a';
  selectedBorderColor = '#0fd80f';
  defaultStrokeWeight = 2;
  selectedStrokeWeight = 4;
  defualtFillOpacity = 1;
  dataPolygonNatureLands = [];
  dataPolygonInefficientLands = [];
  dataPolygonDistributedLands = [];
  HighQualityListData = [];
  dataWestAreaRangePositions = [];

  /*本地储存配置*/
  myDB = {
    name: 'test',
    version: 1,
    db: null
  };
  dbName= this.myDB.name;
  db: any;
  indexeDBmethod = {
    add: (storeName, newItem) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      // 打开已经存储的数据对象
      const objectStore = transaction.objectStore(storeName);
      // 添加到数据对象中
      const objectStoreRequest = objectStore.add(newItem);
      objectStoreRequest.onsuccess = function(event) {
        // method.show();
      };
    },
    edit: (storeName, type, data) => {
      // 编辑数据
      const transaction = this.db.transaction([storeName], 'readwrite');
      // 打开已经存储的数据对象
      const objectStore = transaction.objectStore(storeName);
      // 获取存储的对应键的存储对象
      const objectStoreRequest = objectStore.get(type);
      // 获取成功后替换当前数据
      objectStoreRequest.onsuccess = function(event) {
        // 当前数据
        const myRecord = objectStoreRequest.result;
        // 遍历替换
        for (const key in data) {
          if (typeof myRecord[key] !== 'undefined') {
            myRecord[key] = data[key];
          }
        }
        // 更新数据库存储数据
        objectStore.put(myRecord);
      };
    },
    del: (storeName, type) => {
      // 打开已经存储的数据对象
      const objectStore = this.db.transaction([storeName], 'readwrite').objectStore(storeName);
      // 直接删除
      const objectStoreRequest = objectStore.delete(type);
      // 删除成功后
      objectStoreRequest.onsuccess = function() {
        // method.show();
      };
    },
    get: (storeName) => {
      // 最终要展示的HTML数据
      const lists = [];
      // 打开对象存储，获得游标列表
      const objectStore = this.db.transaction(storeName).objectStore(storeName);
      objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        // 如果游标没有遍历完，继续下面的逻辑
        if (cursor) {
          lists.push(cursor.value);
          // 继续下一个游标项
          cursor.continue();
          // 如果全部遍历完毕
        } else {
          console.log(lists);
          return lists;
        }
      };
    },
    byIndexGet: (storeName, type, callback) => {
      console.log(this.db);
      const transaction = this.db.transaction(storeName);
      const store = transaction.objectStore(storeName);
      const index = store.index('type');
      index.get(type).onsuccess = function(e){
        const result = e.target.result;
        if (callback) {
          callback(result);
        }
      };
    }
  };

  /*绘制西区范围*/
  creatWestAreaLandRangeCj(map, isUseLand?) {
    let fillColor;
    let fillOpacity;
    if (isUseLand) {
      fillColor = '#2a8ab8';
      fillOpacity = 1;
    }else {
      fillColor = 'rgb(249, 182, 32)';
      fillOpacity = 0.2;
    }
    if (this.dataWestAreaRangePositions.length > 0) {

      // 外多边形坐标数组和内多边形坐标数组
      const pointersWestArea = this.dataWestAreaRangePositions;
      const polygonOptionsWestArea = {
        map: map,
        strokeColor: 'rgb(249, 182, 32)',
        // strokeColor: color,
        strokeWeight: 4,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        strokeOpacity: 0.8,
        /*strokeStyle: "dashed",
        strokeDasharray: [20,10],*/
        extData: {}
      };
      const polygonWestAreaRange = new AMap.Polygon(polygonOptionsWestArea);

      polygonWestAreaRange.setPath(pointersWestArea);

    }else {
      const url = '/v1/land/findWesternDistrictBoundary';
      this.http.get(url).subscribe((res: any) => {
        const positions = [];
        res.forEach(function (v, i) {
          positions.push([v[2], v[3]]);
        });

        const polygonOptionsWestArea = {
          map: map,
          strokeColor: '#c48c5c',
          // strokeColor: color,
          strokeWeight: 4,
          fillColor: fillColor,
          fillOpacity: fillOpacity,
          strokeOpacity: 0.8,
          /*strokeStyle: "dashed",
      strokeDasharray: [20,10],*/
          extData: {}
        };
        // 外多边形坐标数组和内多边形坐标数组
        const pointersWestArea = positions;
        this.dataWestAreaRangePositions = pointersWestArea;
        const polygonWestAreaRange = new AMap.Polygon(polygonOptionsWestArea);

        polygonWestAreaRange.setPath(pointersWestArea);
      });
    }
  }
  setdataPolygonNatureLands(data) {
    this.dataPolygonNatureLands = data;
  }
  getdataPolygonNatureLands() {
    return this.dataPolygonNatureLands;
  }
  setdataPolygonInefficientLands(data) {
    this.dataPolygonInefficientLands = data;
  }
  getdataPolygonInefficientLands() {
    return this.dataPolygonInefficientLands;
  }
  setdataPolygonDistributedLands(data) {
    this.dataPolygonDistributedLands = data;
  }
  getdataPolygonDistributedLands() {
    return this.dataPolygonDistributedLands;
  }
  setDistributedHighQualityListData(data) {
    this.HighQualityListData = data;
  }
  getDistributedHighQualityListData() {
    return this.HighQualityListData;
  }
  /*indexedDB操作*/
  openDB (name, dataVersion, callback?) {
    const version = dataVersion || 1;
    const request = window.indexedDB.open(name, version);
    request.onerror = function(e: any){
      console.log(e.currentTarget.error.message);
    };
    request.onsuccess = (e: any) => {
      this.db = this.myDB.db = e.target.result;

      if (callback) {
        callback();
      }
    };
    request.onupgradeneeded = (e: any) => {
      this.db = e.target.result;
      if (!this.db.objectStoreNames.contains('landData')) {
        const objectStore = this.db.createObjectStore('landData', {keyPath: 'type'});
        // 定义存储对象的数据项
        objectStore.createIndex('type', 'type', {
          unique: true
        });
      }
      console.log('DB version changed to ' + version);
    };
  }

  /*判断数据版本*/
  getVersionNum() {
    this.indexeDBmethod.byIndexGet('landData', 'version', (result) => {
      const url = '/v1/land/getVersion';
      if (result) {
        this.http.get(url).subscribe(res => {
          if (result.data !== res) {
            /*版本号不一致，清除已储存数据*/
            this.indexeDBmethod.del('landData', 'dataPolygonEcoLands');
            this.indexeDBmethod.del('landData', 'dataPolygonHighEnterpriseLands');
            this.indexeDBmethod.del('landData', 'dataPolygonNatureLands');
            this.indexeDBmethod.del('landData', 'highQualityAllData');
            this.indexeDBmethod.del('landData', 'dataPolygonInefficientLands');
            this.indexeDBmethod.edit('landData', 'version', {type: 'version', data: res});
          }
        });
      }else {
        this.http.get(url).subscribe(res => {
          this.indexeDBmethod.add('landData', {type: 'version', data: res});
        });
      }
    });
  }

}
