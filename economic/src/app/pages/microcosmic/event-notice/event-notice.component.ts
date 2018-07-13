import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Amap } from '../../../core/amap-ngrx/amap.model';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { EventNoticeService } from './event-notice.service';

@Component({
  // encapsulation: ViewEncapsulation.None,
  selector: 'app-event-notice',
  templateUrl: './event-notice.component.html',
  providers: [EventNoticeService],
  styleUrls: ['./event-notice.component.css']
})
export class EventNoticeComponent implements OnInit {

  constructor(
    private store: Store<Amap>,
    private trackService: EventNoticeService,
  ) {
    this.store.select('amap');
  }
  showEventNoticeMenus = {
    track: true
  }
  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });

    this.trackService.getEventNoticeMenuControll().subscribe(res => {
      this.showEventNoticeMenus = res;
    });
  }
  changeMenuStatus() {
    this.showEventNoticeMenus.track = !this.showEventNoticeMenus.track;
  }
}
