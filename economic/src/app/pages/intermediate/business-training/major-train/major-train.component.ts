import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreedTrackService } from './breed-track.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-major-train',
  templateUrl: './major-train.component.html',
  styleUrls: ['./major-train.component.css'],
  providers: [BreedTrackService]
})
export class MajorTrainComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  breedTrackOptions: any;

  month = '一月';
  constructor(
    private breedStackService: BreedTrackService
  ) { }

  ngOnInit() {

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
