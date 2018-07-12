import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';
import { Store } from '@ngrx/store';
import { Amap } from '../../../../../core/amap-ngrx/amap.model';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { CHANGE } from '../../../../../core/container-ngrx/container.action';
import { ADD_POLYGON } from '../../../../../core/amap-ngrx/amap.actions';
declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-eco-top',
  templateUrl: './eco-top.component.html',
  styleUrls: ['./eco-top.component.css']
})
export class EcoTopComponent implements OnInit, OnDestroy {

  constructor(private intermediateService: IntermediateService, private store: Store<ContainerStyle>, private storeAmap: Store<Amap>) { }
  revenueTime: any;
  enterpriseType = '电子信息';
  companys: any;
  url = '/v1/land/findCompanyTop10ByOperatingIncome';
  enterpriseTypeList = ['电子信息', '服务业', '精密制造', '生物医药', '其他'];
  ngOnInit() {
    this.revenueTime = this.intermediateService.getInitRevenueTime();
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
        data: {type: 'dataPolygonEcoTopLands', time: this.revenueTime}
      }
    });

    this.intermediateService.changeTimeColorControl(['isShowColorsBar', 'isShowTopColor', 'isShowTime', 'isShowTopTime']);
    this.getEcoTopCompanyList();
    $("#datetimepicker-eco-top").datetimepicker({
      autoclose: 1,
      startView: 4,
      minView: 4,
      forceParse: 0,
      startDate: 2015,
      endDate: new Date().getFullYear() - 1,
      initialDate: new Date().getFullYear() - 1
    }).on('changeYear', (ev) => {
      const chooseTime = new Date(ev.date.valueOf()).getFullYear();
      this.revenueTime = chooseTime;
      this.getEcoTopCompanyList();
    });
  }
  ngOnDestroy() {
    this.intermediateService.changeTimeColorControl();
  }
  getEcoTopCompanyList() {
    this.intermediateService.getEcoTopCompanyList(this.revenueTime, this.enterpriseType).subscribe(res => {
      this.companys = res;
    });
  }
  changeEnterpriseType() {
    this.getEcoTopCompanyList();
  }
}
