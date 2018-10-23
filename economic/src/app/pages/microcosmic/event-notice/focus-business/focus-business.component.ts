import { Component, OnInit } from '@angular/core';
import { EventNoticeService } from '../event-notice.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-focus-business',
  templateUrl: './focus-business.component.html',
  styleUrls: ['./focus-business.component.css']
})
export class FocusBusinessComponent implements OnInit {

  constructor(
    private eventNoticeService: EventNoticeService,
    private toastModalService: ToastModalService
  ) { }
  focusBusinessList = [];
  focusBusinessListTips = '加载中...';

  ngOnInit() {
    this.getFocusBusinessInfo();
  }
  /*获取关注企业列表*/
  getFocusBusinessInfo() {
    this.eventNoticeService.findListByUrl({}, 'AttentionCompanysUrl').subscribe(res => {
      console.log('关注企业列表', res)
      if (res.responseCode === '_200') {
        this.focusBusinessList = res.data;
        if (this.focusBusinessList.length < 1) {
          this.focusBusinessListTips = '暂无信息！';
        }
      }else {
        if (res.errorMsg === 'not found operator') {
          this.toastModalService.addToasts({tipsMsg: '请重新登录！', type: 'warning', timeOut: 2000, router: '/login'});
        }else {
          this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
        }
      }
    });
  }
  /*去企业详情*/
  viewCompanyData(name) {
    this.eventNoticeService.setBackRouteUrl(name, '/mic/eventNotice/focusBusiness');
  }
}
