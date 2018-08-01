import { Component, OnInit } from '@angular/core';
import { EventNoticeService } from "../event-notice.service";

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
  `]
})
export class EarlyWarningComponent implements OnInit {

  constructor(
    private eventNoticeService: EventNoticeService
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
      console.log('事件预警' ,res)
      if(res.responseCode === '_200') {
        /*政府表彰*/
        this.governmentRecognitionList = res.data.ECIHonorPojo;
        if(this.governmentRecognitionList.length < 1) {
          this.governmentRecognitionTips = '暂无信息！';
        }
        /*黑名单*/
        this.blackList = res.data.ECIJudicialDecisionPojo;
        if(this.blackList.length < 1) {
          this.blackListTips = '暂无信息！';
        }
        /*履约缴费*/
        this.performancePaymentList = res.data.PERPaymentInformationPojo;
        if(this.performancePaymentList.length < 1) {
          this.performancePaymentTips = '暂无信息！';
        }
      }
    })
  }

}
