import { Component, OnInit } from '@angular/core';
import { ForecastResultService } from './forecast-result.service';

@Component({
  selector: 'app-forecast-result',
  templateUrl: './forecast-result.component.html',
  styles: [`
  .macros-view-bd {
    height: calc(100% - 50px);
  }
  .right-panel .content {
    height: 100%;
  }
  .m-b-10 {
    margin-bottom: 10px;
  }
  .macros-view-bd .tab_con .flex-item {
    width: 100%;
    height: 3rem;
    border: 1px solid rgba(249,182,32,.3);
    border-radius: 10px;
  }
  .macros-view-bd .tab_con .flex-cell {
    padding-top: 10px;
  }
  .macros-view-bd .tab_con .flex>.flex-cell:nth-child(2n) {
    padding-left: 10px;
  }
  .public-budget-con .panel-bd{
    border-radius: 6px;
    height: 100%;
  }
  .public-budget-progress{
    text-align: center;
    display: none;
  }
  .public-budget-progress>.progress{
    display: inline-block;
  }
  .public-budget-progress .progress-bar{
    transition: inherit;
  }
  .down-budget {
    overflow: hidden;
    margin: 10px 20px 0;
  }
  .down-budget-btn{
    padding: 5px 10px;
    color: #f9b620;
    border: 1px solid rgba(249,182,32,.3);
    border-radius: 6px;
    background: none;
  }
  .down-budget-btn:hover{
    border-color: #f9b620;
  }
  `]
})
export class ForecastResultComponent implements OnInit {
  // 预测结果-> gdp
  gdpOptions: any;
  // 预测结果-> 公共预算
  budgetOptions: any;
  // 预测结果-> 个人收入
  incomeOptions: any;
  // 预测结果-> 固定投资
  investOptions: any;
  // 预测结果-> 支柱产业
  pillarOptions: any;
  // 预测结果-> 公共性支出
  expendOptions: any;

  constructor(
    private forecastResultService: ForecastResultService
  ) { }

  ngOnInit() {
    this.forecastResultService.getData()
      .subscribe((res) => {
        this.gdpOptions = res.gdpOptions;
        this.budgetOptions = res.budgetOptions;
        this.incomeOptions = res.incomeOptions;
        this.investOptions = res.investOptions;
        this.pillarOptions = res.pillarOptions;
        this.expendOptions = res.expendOptions;
      });
  }

}
