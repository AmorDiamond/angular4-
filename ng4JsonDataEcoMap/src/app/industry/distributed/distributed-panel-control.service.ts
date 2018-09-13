import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DistributedPanelControlService {

  constructor() { }
  panelControl = {overviewShow: true};
  corlorListRight = '420px';
  /*监听是否需要将已经绘制好的多边形恢复样式*/
  resetDrawPolygonLandsStyle = false;
  /*监听是否绘制所选择的用地性质地块*/
  drawChooseNaturePolygonLands = false;
  /*监听控制选择、访问的用地性质类型*/
  natureColorListChooseStatus = {
    '工业用地': true,
    '公共设施及其他用地': true,
    '科研用地': true,
    '商服用地': true,
    '住宅用地': true,
    '储备用地': true
  };
  private panelStatus = new BehaviorSubject<any>(this.panelControl);
  private colorListStatus = new BehaviorSubject<any>(this.corlorListRight);
  private drawPolygonStatus = new BehaviorSubject<any>(this.resetDrawPolygonLandsStyle);
  private natureColorListStatus = new BehaviorSubject<any>(this.natureColorListChooseStatus);
  changePanelControl(type) {
    this.panelControl.overviewShow = type;
    // this.panelStatus.next({
    //  'panelControl': this.panelControl
    // });
    this.panelStatus.next(this.panelControl);
  }
  getPanelControl(): Observable<any> {
    return this.panelStatus.asObservable();
  }
  changeColorListControl(options) {
    this.corlorListRight = options;
    // this.panelStatus.next({
    //  'panelControl': this.panelControl
    // });
    this.colorListStatus.next(this.corlorListRight);
  }
  getColorListControl(): Observable<any> {
    return this.colorListStatus.asObservable();
  }
  /*重置绘制多边形的样式*/
  resetDrawPolygonLandsStyleStatus() {
    this.resetDrawPolygonLandsStyle = true;
    this.drawPolygonStatus.next(this.resetDrawPolygonLandsStyle);
  }
  /*获取地图上绘制好的多边形*/
  getDrawPolygonLandsStyleStatus(): Observable<any> {
    return this.drawPolygonStatus.asObservable();
  }
  /*更改要显示的用地性质类型地块*/
  changeNatureColorListChooseStatus(options) {
    // for (const v in options) {
    //   if (v) {
    //     this.natureColorListChooseStatus[v] = options[v];
    //   }
    // }
    this.natureColorListChooseStatus = options;
    this.natureColorListStatus.next(this.natureColorListChooseStatus);
  }
  /*获取要显示的用地性质类型地块*/
  getNatureColorListChooseStatus(): Observable<any> {
    return this.natureColorListStatus.asObservable();
  }
}
