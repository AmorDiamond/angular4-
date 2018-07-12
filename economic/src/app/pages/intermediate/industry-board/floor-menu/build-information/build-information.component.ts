import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CHANGE } from '../../../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { IntermediateService } from '../../../intermediate.service';
import { Amap } from '../../../../../core/amap-ngrx/amap.model';
import { ADD_BUILD_MARKER, CLEAR_MARKER } from '../../../../../core/amap-ngrx/amap.actions';
declare var AMapUI: any;

@Component({
  selector: 'app-build-information',
  templateUrl: './build-information.component.html',
  styleUrls: ['./build-information.component.css']
})
export class BuildInformationComponent implements OnInit, OnDestroy {

  constructor(private intermediateService: IntermediateService, private store: Store<ContainerStyle>, private storeAmap: Store<Amap>) {
    this.store.select('container');
  }
  buildDataList: any;
  buildOfCompanys: any = [];
  getBuildOfCompanysFn: any;
  choseBuildName: any;
  getShowHideDataFn: any;
  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('FloorMenu');
    this.getShowHideDataFn = this.intermediateService.getShowHideData().subscribe(subres => {
      this.choseBuildName = subres.choseBuildName;
    });
    if (!this.choseBuildName) {
      this.store.dispatch({
        type: CHANGE,
        payload: {
          width: '60%'
        }
      });
      this.storeAmap.dispatch({
        type: CLEAR_MARKER,
        payload: {
          action: 'CLEAR_MARKER',
          data: ''
        }
      });
      this.storeAmap.dispatch({
        type: ADD_BUILD_MARKER,
        payload: {
          action: 'ADD_BUILD_MARKER',
          data: '高新西区'
        }
      });
      this.intermediateService.getBuildInformation().subscribe(res => {
        this.buildDataList = res;
        console.log(res);
      });
    }
    this.intermediateService.changeShowHideData('isShowParkBuildBar', true);
    /*this.intermediateService.getBuildCompanyList('b972af30-3160-457d-b30a-fdf47111a40f').subscribe(res => {
      this.buildCompanyList = res;
    });*/
    this.getBuildOfCompanysFn = this.intermediateService.getBuildOfCompanys().subscribe(res => {
      this.buildOfCompanys = res.buildOfCompanys;
    });
  }

  ngOnDestroy() {
    this.getBuildOfCompanysFn.unsubscribe();
    this.getShowHideDataFn.unsubscribe();
    this.intermediateService.changeShowHideData('isShowParkBuildBar', false);
    this.intermediateService.changeShowHideData('isShowParkNameList', false);
  }


}
