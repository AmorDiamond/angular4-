import { Component, OnInit } from '@angular/core';
import { EventNoticeService, RequestParams } from '../event-notice.service';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styles: [`
  .panel-content .flex .flex-cell{
    padding-top: 0;
    padding-bottom: 20px;
  }
  .panel-content .flex{
    flex-wrap: wrap;
  }
  .panel-content .flex>.flex-cell{
    width: 33%;
  }
  .panel-content .flex>.flex-cell:nth-child(3n + 1){
    padding-left: 0;
  }
  .panel-content .flex-head {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
  }
  `],
  providers: [EventNoticeService]
})
export class RecommendComponent implements OnInit {


  Recommend = [];
  RecommendTipsMsg = '加载中...';
  constructor(private eventNoticeService: EventNoticeService) { }

  ngOnInit() {
    this.getRecommend();
  }

  getRecommend() {
    this.eventNoticeService.findList({type: 'SmartRecommendation'})
      .subscribe(res => {
        this.Recommend = [...this.Recommend, ...res.data.company];
        if (res.data.company.length < 1) {
          this.RecommendTipsMsg = '暂无信息！';
        }
      });
  }
  /*去企业详情*/
  viewCompanyData(name) {
    this.eventNoticeService.setBackRouteUrl(name, '/mic/eventNotice/recommend');
  }

}
