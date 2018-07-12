import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BreedTrackService} from './breed-track.service';
import { EventNoticeService } from '../../event-notice.service';

@Component({
  selector: 'app-business-training',
  templateUrl: './business-training.component.html',
  styleUrls: ['./business-training.component.css']
})
export class BusinessTrainingComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  breedTrackOptions: any;

  month = '一月';
  constructor(
    private breedStackService: BreedTrackService,
    private trackService: EventNoticeService,
  ) { }

  ngOnInit() {

    const showEventNoticeMenus = {
      track: true
    }
    this.trackService.setEventNoticeMenuControll(showEventNoticeMenus);
    this.subscription = this.breedStackService.getData()
      .subscribe(res => {
        this.breedTrackOptions = res.breedTrackOptions;
      });
  }

  onChartEvent(event: any, type: string) {
    this.month = event.name;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
