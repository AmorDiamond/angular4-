import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LogsManageService } from './logs-manage.service';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { zhCnLocale } from 'ngx-bootstrap/locale';
import { ToastModalService } from '../../../shared/toast-modal/toast-modal.service';

defineLocale('zh-cn', zhCnLocale)
@Component({
  selector: 'app-logs-manage',
  templateUrl: './logs-manage.component.html',
  styleUrls: ['./logs-manage.component.css'],
  providers: [LogsManageService, DatePipe]
})
export class LogsManageComponent implements OnInit {

  constructor(
    private logsManageService: LogsManageService,
    private datePipe: DatePipe,
    private localeService: BsLocaleService,
    private toastModalService: ToastModalService
  ) {
    // this.locale = defineLocale('zh-cn', zhCnLocale);
    this.localeService.use('zh-cn');
  }
  locale: any;
  bsConfig = { dateInputFormat: 'YYYY-MM-DD', containerClass: 'theme-orange', showWeekNumbers: false };
  searchParams = {
    beginCreateTime: null,
    endCreateTime: null,
    actionType: '',
    entityType: '',
    page: 0,
    size: 15
  };
  chooseTime = {
    beginCreateTime: null,
    endCreateTime: null
  };
  actionTypes = [];
  entityTypes = [];
  actionTypesObj = {};
  entityTypesObj = {};
  pageParams = {
    maxSize: 10,
    itemsPerPage: this.searchParams.size,
    bigTotalItems: 10,
    bigCurrentPage: 1,
    numPages: 0
  };
  logsLists = [];
  ngOnInit() {
    this.getLogsList();
    this.getLogsEnums();
  }
  /*获取日志列表*/
  getLogsList() {
    this.searchParams.beginCreateTime = this.chooseTime.beginCreateTime;
    /*格式化搜索时间，避免操作到插件选的时间格式导致时间控件异常*/
    this.searchParams.beginCreateTime = this.searchParams.beginCreateTime ? this.datePipe.transform(this.searchParams.beginCreateTime, 'yyyy-MM-dd') : this.searchParams.beginCreateTime;
    this.searchParams.endCreateTime = this.chooseTime.endCreateTime;
    /*格式化搜索时间，避免操作到插件选的时间格式导致时间控件异常*/
    this.searchParams.endCreateTime = this.searchParams.endCreateTime ? this.datePipe.transform(this.searchParams.endCreateTime, 'yyyy-MM-dd') : this.searchParams.endCreateTime;

    this.logsManageService.findListByParams(this.searchParams, 'searchLogsUrl').subscribe(res => {
      console.log('获取日志', res)
      if (res.responseCode === '_200') {
        this.logsLists = res.data.content;
        this.pageParams.bigTotalItems = res.data.totalElements;
        if (this.logsLists.length < 1) {
          this.toastModalService.addToasts({type: 'info', tipsMsg: '暂无信息！'});
        }
      }
    }, err => {
      console.log('获取日志失败', err);
    });
  }
  /*获取枚举类型信息*/
  getLogsEnums() {console.log('枚举类型');
    this.logsManageService.getRequestByForkJoin([{findParams: {enumsName: 'ActionType'}, url: 'searchEnumsUrl'}, {findParams: {enumsName: 'EntityType'}, url: 'searchEnumsUrl'}]).subscribe(res => {
      console.log('枚举类型', res);
      this.actionTypes = res[0].data;
      this.entityTypes = res[1].data;
      /*将枚举类型保存到对象用于在列表页面渲染中文*/
      this.actionTypes.forEach(item => {
        this.actionTypesObj[item.name] = item.desc;
      });
      this.entityTypes.forEach(item => {
        this.entityTypesObj[item.name] = item.desc;
      });
    }, err => {
      console.log('枚举类型失败', err);
    });
  }
  /*搜索*/
  search() {
    this.searchParams.page = 0;
    this.pageParams.bigCurrentPage = 1;
    this.getLogsList();
  }
  /*重置搜索条件*/
  resetSearch() {
    this.searchParams = {
      beginCreateTime: null,
      endCreateTime: null,
      actionType: '',
      entityType: '',
      page: 0,
      size: 15
    };
    this.chooseTime = {
      beginCreateTime: null,
      endCreateTime: null
    };
    this.pageParams.bigCurrentPage = 1;
    this.getLogsList();
  }
  /*翻页查询*/
  pageChanged($event) {
    const pageNumber = $event.page - 1;
    this.searchParams.page = pageNumber;
    this.getLogsList();
  }
  formatTime($event, type) {
    console.log($event.getTime())
    const time = $event.getTime();
    if (type === 'beginTime') {
      this.searchParams.beginCreateTime = time;
    }else {
      this.searchParams.endCreateTime = time;
    }
  }

}
