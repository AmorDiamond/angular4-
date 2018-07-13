import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContainerStyle } from '../../core/container-ngrx/container.model';
import { CHANGE } from '../../core/container-ngrx/container.action';
import { MicrocosmicService } from './microcosmic.service';
import { Amap } from '../../core/amap-ngrx/amap.model';
import { ADD_MARKER } from '../../core/amap-ngrx/amap.actions';
import { Subscription } from 'rxjs/Subscription';

declare var echarts: any;

@Component({
  selector: 'app-microcosmic',
  templateUrl: './microcosmic.component.html',
  styleUrls: ['./microcosmic.component.css']
})
export class MicrocosmicComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  // 年产值
  annualOutputValue: any;
  // 企业数量
  numberOfEnterprises: any;
  // 企业规模
  enterpriseSize: any;
  // 生产总值
  totalOutputValue: any;
  // 集群行业
  SixMajorIndustries: any;

  // 区别四个区域
  title: string = '高新西区';

  constructor(
    private storeContainer: Store<ContainerStyle>,
    private storeAmap: Store<Amap>,
    private microcosmicService: MicrocosmicService
  ) {
    this.storeContainer.select('container');
  }

  ngOnInit() {
    /*临时隐藏微观概况面板*/
    this.microcosmicService.changePanleHide(true);
    this.subscription = this.microcosmicService.getData().subscribe(data => {
      // 年产值
      this.annualOutputValue = data.outputValue;
      // 企业数量
      this.numberOfEnterprises = data.enterpriseNumber;
      // 企业规模
      this.enterpriseSize = data.enterpriseScale;
      // 生产总值
      this.totalOutputValue = data.grossProduct;
      // 集群行业
      this.SixMajorIndustries = data.SixMajorIndustries;
    });
    this.microcosmicService.getMicInformation();
    // 改变container的宽度
    this.storeContainer.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
    // 在地图上添加三个标注：高新西区、高新东区、高新南区
    this.storeAmap.dispatch({
      type: ADD_MARKER,
      payload: {
        action: 'ADD_MARKER',
        data: [
          {
            name: '高新南区',
            center: '104.065706,30.592168',
            type: 0,
            subDistricts: []
          },
          {
            name: '高新西区',
            center: '103.922278,30.77348',
            type: 1,
            subDistricts: []
          },
          {
            name: '高新东区',
            center: '104.26881,30.277292',
            type: 1,
            subDistricts: []
          }
        ]
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    /*临时隐藏微观概况面板*/
    this.microcosmicService.changePanleHide(false);
  }
}
