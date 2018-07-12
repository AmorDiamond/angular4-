import { Component, OnInit, OnDestroy } from '@angular/core';
import { MacEconomicPillarService } from './mac-economic-pillar.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mac-economic-pillar',
  templateUrl: './mac-economic-pillar.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicPillarComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  // 产业产值
  pillarOutputValueOptions: any;
  // 产业增速
  pillarGrowthRateOptions: any;
  constructor(
    private macEconomicPillarService: MacEconomicPillarService
  ) { }

  ngOnInit() {
    this.subscription = this.macEconomicPillarService.getData()
      .subscribe(res => {
        this.pillarOutputValueOptions = res.pillarOutputValueOptions;
        this.pillarGrowthRateOptions = res.pillarGrowthRateOptions;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
