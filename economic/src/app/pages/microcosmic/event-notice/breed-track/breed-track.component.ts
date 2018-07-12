import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BreedTrackService } from './breed-track.service';

@Component({
  selector: 'app-breed-track',
  templateUrl: './breed-track.component.html',
  styleUrls: ['./breed-track.component.css']
})
export class BreedTrackComponent implements OnInit, OnDestroy {

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
