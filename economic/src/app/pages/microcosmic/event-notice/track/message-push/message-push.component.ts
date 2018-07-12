import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventNoticeService, EventNoticeResponse, RequestParams  } from '../../event-notice.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce, slideOutRight, slideInLeft } from 'ng-animate';
import { LoadingService } from '../../../../../shared/loading/loading.service';

@Component({
  selector: 'app-message-push',
  templateUrl: './message-push.component.html',
  styleUrls: ['./message-push.component.css'],
  // providers: [EventNoticeService],
  animations: [
    trigger('side', [
      transition('* => out', useAnimation(slideOutRight)),
      transition('in => in', useAnimation(slideInLeft))
    ])
  ],
})
export class MessagePushComponent implements OnInit, OnDestroy {
  side = 'in';
  PAGE_SIZE = 3;
  ContractParams: RequestParams = { currentPage: 0, pageSize: this.PAGE_SIZE, lastRowKey: '', type: 'Contract' };
  CONTRACTS = [];
  CONTRACTS_PAGE = 1;
  Contracts = [];
  NewsParams: RequestParams = { currentPage: 0, pageSize: this.PAGE_SIZE, lastRowKey: '', type: 'News' };
  NEWS = [];
  NEWS_PAGE = 1;
  News = [];
  constructor(
    private trackService: EventNoticeService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    const showEventNoticeMenus = {
      track: true
    }
    this.trackService.setEventNoticeMenuControll(showEventNoticeMenus);
    this.getContractData();
    this.getNewsData();
  }

  // 合同情况
  findContractPage() {
    this.loadingService.loadingStart();
    this.trackService.findList(this.ContractParams)
      .subscribe(res => {
        if (res.responseCode === '_200') {
          // this.side = 'out';
          this.CONTRACTS = [...this.CONTRACTS, ...res.data.kETContractPojos];
          this.Contracts = res.data.kETContractPojos;
          this.loadingService.loadingStop();
          setTimeout(() => {
            this.side = 'in';
          }, 500);
          this.ContractParams.lastRowKey = res.data.pagination.lastRowKey;
        }
      });
  }

  getContractData() {
    const page = this.CONTRACTS_PAGE;
    const cache = this.CONTRACTS.slice((page - 1) * this.PAGE_SIZE, page * this.PAGE_SIZE);
    // this.CONTRACTS_PAGE++;
    if (cache.length) {
      this.Contracts = cache;
    } else {
      this.findContractPage();
    }
  }

  contractNext() {
    this.CONTRACTS_PAGE++;
    this.getContractData();
  }

  contractPre() {
    if (this.CONTRACTS_PAGE === 1) {
      return false;
    }
    this.CONTRACTS_PAGE--;
    this.getContractData();
  }

  // 新闻
  findNewsPage() {
    this.loadingService.loadingStart();
    this.trackService.findList(this.NewsParams)
      .subscribe(res => {
        if (res.responseCode === '_200') {
          this.NEWS = [...this.News, ...res.data.kETNewsPojos];
          this.News = res.data.kETNewsPojos;
          this.loadingService.loadingStop();
          this.NewsParams.lastRowKey = res.data.pagination.lastRowKey;
        }
      });
  }

  getNewsData() {
    const page = this.NEWS_PAGE;
    const cache = this.NEWS.slice((page - 1) * this.PAGE_SIZE, page * this.PAGE_SIZE);
    // this.CONTRACTS_PAGE++;
    if (cache.length) {
      this.News = cache;
    } else {
      this.findNewsPage();
    }
  }

  newsNext() {
    this.NEWS_PAGE++;
    this.getNewsData();
  }

  newsPre() {
    if (this.NEWS_PAGE === 1) {
      return false;
    }
    this.NEWS_PAGE--;
    this.getNewsData();
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.loadingService.loadingStop();
  }
}
