import { Component, OnInit, OnDestroy } from '@angular/core';
import { MacEconomicGdpService } from './mac-economic-gdp.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mac-economic-gdp',
  templateUrl: './mac-economic-gdp.component.html',
  styleUrls: ['./mac-economic-gdp.component.css']
})
export class MacEconomicGdpComponent implements OnInit, OnDestroy {

  _date = new Date();
  gdpOptions: any;
  gdpGrowthRateOptions: any;
  subscription: Subscription;
  constructor(
    private macEconomicGdpService: MacEconomicGdpService
  ) { }

  ngOnInit() {
    this.subscription = this.macEconomicGdpService.getData()
      .subscribe(res => {
        console.log(res);
        this.gdpOptions = res.gdpOptions;
        this.gdpGrowthRateOptions = res.gdpGrowthRateOptions;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
