import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic/microcosmic.service';
import { CHANGE } from '../../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../../core/container-ngrx/container.model';
import { Store } from '@ngrx/store';
import { DataApplicationService } from '../../data-application.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class ContactDetailPageComponent implements OnInit {

  constructor(
    private microcomicService: MicrocosmicService,
    private store: Store<ContainerStyle>,
    private dataApplicationService: DataApplicationService,
    private toastModalService: ToastModalService,
  ) { }
  contactDataList = [];
  companyName: any;
  selectedList: any = [];
  sendMessageStatus = false;
  MessagePageTitle = '批量通知';
  sendMessageContent = '';
  sendResultList = [];
  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '93%'
      }
    });
    this.companyName = this.microcomicService.getUrlParams('name');
    this.selectedList = this.dataApplicationService.getSelectedList();
    console.log(this.selectedList)
    this.getList();
  }
  /*获取数据*/
  getList() {

  }
  /*发送信息*/
  sendMessage() {
    const params = {pojo: [], content: this.sendMessageContent};
    this.selectedList.forEach(res => {
      params.pojo = [...params.pojo, ...res.relationPojos];
    });
    console.log(params);
    this.dataApplicationService.sendMessage(params, 'sendMessageUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.sendMessageStatus = true;
        this.MessagePageTitle = '发送结果';
        this.store.dispatch({
          type: CHANGE,
          payload: {
            width: '60%'
          }
        });
        if (res.data && res.data.length > 0) {
          this.sendResultList = res.data;
          /*给发送失败的企业赋值行业类型*/
          this.selectedList.forEach(selectItem => {
            this.sendResultList.forEach(resultItem => {
              if (resultItem.pojo.enterpriseName === selectItem.company.rowKey && selectItem.company.industryType) {
                resultItem.industryType = selectItem.company.industryType.replace(/[^\u4e00-\u9fa5]/gi, '');
              }
            });
          });
        }
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }

}
