import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { MacEconomicIncomeService } from './mac-economic-income.service';

@Component({
  selector: 'app-mac-economic-income',
  templateUrl: './mac-economic-income.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicIncomeComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  // 人均收入
  incomeOptions: any;
  // 收入类型
  incomeTypeOptions: any;
  constructor(
    private macEconomicIncomeService: MacEconomicIncomeService
  ) { }

  ngOnInit() {
    this.subscription = this.macEconomicIncomeService.getData()
      .subscribe(res => {
        this.incomeOptions = res.incomeOptions;
        this.incomeTypeOptions = res.incomeTypeOptions;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
