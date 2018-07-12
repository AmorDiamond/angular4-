import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CompanyCreditService } from '../company-credit.service';

@Component({
  selector: 'app-performance-payment',
  templateUrl: './performance-payment.component.html',
  styleUrls: ['./performance-payment.component.css']
})
export class PerformancePaymentComponent implements OnInit {

  constructor(
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService,
    private companyCreditService: CompanyCreditService
  ) { }
  keyWord: any;
  PerformancePaymentParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
  PerformancePayment = [];
  PerformancePaymentTips = '加载中...';
  ngOnInit() {
    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.PerformancePaymentParams.enterpriseName = this.keyWord;
    this.getPerformancePayment();
  }
  getPerformancePayment() {
    this.companyCreditService.findListByCompanyName(this.PerformancePaymentParams, 'PerformancePayment').subscribe(res => {
      console.log('履约缴费', res.data)
      if (res.responseCode === '_200') {
        if (res.data.length < 1) {
          this.PerformancePaymentTips = '暂无信息！';
        }
        // this.PerformancePaymentParams.lastRowKey = res.data.pagination.lastRowKey;
        this.PerformancePayment = [...this.PerformancePayment, ...res.data];
      }
    });
  }

}
