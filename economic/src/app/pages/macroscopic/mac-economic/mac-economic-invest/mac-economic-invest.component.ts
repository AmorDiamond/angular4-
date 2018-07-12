import { Component, OnInit, OnDestroy } from '@angular/core';
import {  } from '@angular/core/src/metadata/lifecycle_hooks';
import { MacEconomicInvestService } from './mac-economic-invest.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mac-economic-invest',
  templateUrl: './mac-economic-invest.component.html',
  styleUrls: [
    '../mac-economic-gdp/mac-economic-gdp.component.css',
    './mac-economic-invest.component.css'
  ]
})
export class MacEconomicInvestComponent implements OnInit, OnDestroy {

  investOptions: any;
  subscription: Subscription;
  constructor(
    private macEconomicInvestService: MacEconomicInvestService
  ) { }

  ngOnInit() {
    this.subscription = this.macEconomicInvestService.getDate()
      .subscribe(res => {
        this.investOptions = res.investOptions;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
