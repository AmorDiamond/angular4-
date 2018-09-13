import { Component, OnInit } from '@angular/core';
import { CHANGE } from '../../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../../core/container-ngrx/container.model';
import { Store } from '@ngrx/store';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import {MicrocosmicService} from '../../../microcosmic/microcosmic.service';

@Component({
  selector: 'app-recommend-list',
  templateUrl: './recommend-list.component.html',
  styleUrls: ['./recommend-list.component.css']
})
export class RecommendListComponent implements OnInit {

  constructor(
    private microcomicService: MicrocosmicService,
    private store: Store<ContainerStyle>,
    private toastModalService: ToastModalService
  ) { }
  dataList = [];
  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
    this.getListData();
  }
  /*获取详细数据*/
  getListData() {
    const options = [
      {id: 1, sort: 98, name: '成都百腾科技有限公司', industryType: '电子信息', add: '成都市高新区新光路8号'},
      {id: 2, sort: 96, name: '成都必合科技有限公司', industryType: '电子信息', add: '成都高新区仁和南街55号1层'},
      {id: 3, sort: 90, name: '布鲁克(成都)工程有限公司', industryType: '先进制造', add: '四川省成都高新技术产业开发西区'},
      {id: 4, sort: 88, name: '成都奥利斯机电有限公司', industryType: '先进制造', add: '成都高新西区天辰路88号A-407室'}
    ];
    this.dataList = options;
  }

}
