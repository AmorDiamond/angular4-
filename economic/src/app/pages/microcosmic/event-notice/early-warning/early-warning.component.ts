import { Component, OnInit } from '@angular/core';
import { EventNoticeService } from '../event-notice.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-early-warning',
  templateUrl: './early-warning.component.html',
  styles: [`
  div.flex-item {
    height: auto;
  }
  .panel-content .flex{
    white-space: nowrap;
    display: initial;
  }
  .panel-content .flex .flex-cell{
    width: 300px;
    padding: 0 6px;
    display: inline-block;
  }
  .flex-head .name-icon{
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    background: #5079d9;
    color: #fff;
    vertical-align: middle;
    text-align: center;
    border-radius: 30px;
    margin: 0 10px;
  }
  .flex-head{
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: #e7e9eb;
    background: linear-gradient(to right, #1f232d , #191919);
    padding: 0;
    border-bottom: 1px solid #303030;
  }
  .panel-content .flex .flex-item{
    border: 1px solid #303030;
  }
  .flex-item .title:before{
    background-color: #376ba7;
  }
  .content-row-item{
    background: #191919;
    border-radius: 10px;
    padding: 1px 20px 20px;
    margin-bottom: 20px;
  }
  .panel-content{
    margin: 0;
  }
  `]
})
export class EarlyWarningComponent implements OnInit {

  constructor(
    private eventNoticeService: EventNoticeService,
    private toastModalService: ToastModalService
  ) { }
  governmentRecognitionList = [];
  governmentRecognitionTips = '加载中...';
  blackList = [];
  blackListTips = '加载中...';
  performancePaymentList = [];
  performancePaymentTips = '加载中...';
  ngOnInit() {
    this.getEarlyWarningInfo();
  }
  /*获取企业信用事件预警*/
  getEarlyWarningInfo() {
    this.eventNoticeService.findListByUrl({}, 'CorporateCreditEventUrl').subscribe(res => {
      console.log('事件预警' , res)
      if (res.responseCode === '_200') {
        /*政府表彰*/
        this.governmentRecognitionList = res.data.ECIHonorPojo;
        if (this.governmentRecognitionList.length < 1) {
          this.governmentRecognitionTips = '暂无信息！';
        }
        /*黑名单*/
        this.blackList = res.data.ECIJudicialDecisionPojo;
        if (this.blackList.length < 1) {
          this.blackListTips = '暂无信息！';
        }
        /*履约缴费*/
        this.performancePaymentList = res.data.PERPaymentInformationPojo;
        if (this.performancePaymentList.length < 1) {
          this.performancePaymentTips = '暂无信息！';
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
    this.eventNoticeService.setBackRouteUrl(name, '/mic/eventNotice/earlyWarning');
  }

}
