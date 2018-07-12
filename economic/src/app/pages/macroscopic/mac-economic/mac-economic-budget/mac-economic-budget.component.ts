import { Component, OnInit, OnDestroy } from '@angular/core';
import { MacEconomicBudgetService } from './mac-economic-budget.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mac-economic-budget',
  templateUrl: './mac-economic-budget.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicBudgetComponent implements OnInit, OnDestroy {

  budgetOptions: any;
  budgetDetailOptions: any;
  subscription: Subscription;
  constructor(
    private macEconomicBudgetService: MacEconomicBudgetService
  ) { }

  ngOnInit() {
    this.subscription = this.macEconomicBudgetService.getData()
      .subscribe(res => {
        this.budgetOptions = res.budgetOptions,
          this.budgetDetailOptions = res.budgetDetailOptions;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
