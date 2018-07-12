import { Component, OnInit } from '@angular/core';
import { EventNoticeService, RequestParams } from '../event-notice.service';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styles: [],
  providers: [EventNoticeService]
})
export class RecommendComponent implements OnInit {


  Recommend = [];
  constructor(private eventNoticeService: EventNoticeService) { }

  ngOnInit() {
    this.getRecommend();
  }

  getRecommend() {
    this.eventNoticeService.findList({type: 'SmartRecommendation'})
      .subscribe(res => {
        this.Recommend = [...this.Recommend, ...res.data.company];
      });
  }

}
