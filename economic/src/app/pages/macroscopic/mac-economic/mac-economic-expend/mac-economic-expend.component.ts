import { Component, OnInit } from '@angular/core';
import { MacEconomicExpendService } from './mac-economic-expend.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-mac-economic-expend',
  templateUrl: './mac-economic-expend.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicExpendComponent implements OnInit, OnDestroy {

  subscriptionExpend: Subscription;
  subscriptionExpendDetail: Subscription;

  // 支出
  expendOptions: any;
  // 支出详情
  expendDetailOptions: any;
  constructor(
    private macEconomicExpendService: MacEconomicExpendService
  ) { }

  ngOnInit() {
    this.subscriptionExpend = this.macEconomicExpendService.getExpendData()
      .subscribe(res => {
        this.expendOptions = res.expendOptions;
      });
    this.subscriptionExpendDetail = this.macEconomicExpendService.getExpendDetailData()
      .subscribe(res => {
        this.expendDetailOptions = res.expendDetailOptions;
      });
  }

  ngOnDestroy() {
    this.subscriptionExpend.unsubscribe();
    this.subscriptionExpendDetail.unsubscribe();
  }

}
