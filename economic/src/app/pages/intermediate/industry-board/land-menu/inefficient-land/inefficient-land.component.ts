import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';
import { ADD_POLYGON } from '../../../../../core/amap-ngrx/amap.actions';
import { CHANGE } from '../../../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { Amap } from '../../../../../core/amap-ngrx/amap.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-inefficient-land',
  templateUrl: './inefficient-land.component.html',
  styleUrls: ['./inefficient-land.component.css']
})
export class InefficientLandComponent implements OnInit, OnDestroy {

  constructor(private intermediateService: IntermediateService, private store: Store<ContainerStyle>, private storeAmap: Store<Amap>) { }
  inefficient = {
    companyNum: '',
    totalArea: '',
    noUseLandArea: '',
    useLandArea: ''
  };
  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('LandMenu');
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
    this.storeAmap.dispatch({
      type: ADD_POLYGON,
      payload: {
        action: 'ADD_POLYGON',
        data: 'dataPolygonInefficientLands'
      }
    });

    this.intermediateService.changeTimeColorControl(['isShowColorsBar', 'isShowInefficientColor']);
    this.getInefficientLandData();
  }
  ngOnDestroy() {
    this.intermediateService.changeTimeColorControl();
  }
  getInefficientLandData() {
    this.intermediateService.getInefficientLandData().subscribe(res => {
      this.inefficient.companyNum = res.count;
      this.inefficient.totalArea = res.total_area;
      this.inefficient.noUseLandArea = res.no_use_area;
      this.inefficient.useLandArea = res.usage_area;
    });
  }
}
