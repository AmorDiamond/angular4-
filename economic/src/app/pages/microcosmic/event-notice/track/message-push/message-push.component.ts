import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventNoticeService, EventNoticeResponse, RequestParams  } from '../../event-notice.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce, slideOutRight, slideInLeft } from 'ng-animate';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { ToastModalService } from "../../../../../shared/toast-modal/toast-modal.service";

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
    private loadingService: LoadingService,
    private toastModalService: ToastModalService,
  ) { }
  newsInfo = [];
  newsInfoTips = '加载中...';
  governmentsupportInfo = [];
  governmentsupportInfoTips = '加载中...';
  ngOnInit() {
    const showEventNoticeMenus = {
      track: true
    }
    this.trackService.setEventNoticeMenuControll(showEventNoticeMenus);
    // this.getContractData();
    // this.getNewsData();
    this.getMessagePushInfo();
  }

  /*获取消息推送数据*/
  getMessagePushInfo() {
    this.trackService.findListByUrl({}, 'KeyEnterpriseUrl').subscribe(res => {
      console.log('消息推送数据', res)
      if (res.responseCode === '_200') {
        this.newsInfo = res.data.KETNewsPojo;
        if (this.newsInfo.length < 1) {
          this.newsInfoTips = '暂无信息！';
        }
        this.governmentsupportInfo = res.data.GovernmentsupportPojo;
        if (this.governmentsupportInfo.length < 1) {
          this.governmentsupportInfoTips = '暂无信息！';
        }
      }else {
        if (res.errorMsg === 'not found operator') {
          this.toastModalService.addToasts({tipsMsg: '请重新登录！', type: 'warning', timeOut: 2000, router: '/login'});
        }else {
          this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
        }
      }
    });
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
