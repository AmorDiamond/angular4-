import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { FormManagersService } from '../form-managers.service';

@Component({
  selector: 'app-move-out',
  templateUrl: './move-out.component.html',
  styleUrls: ['./move-out.component.css']
})
export class MoveOutComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private toastModalService: ToastModalService,
    private formManagersService: FormManagersService
  ) { }
  getListParams = {
    enterpriseName: '',
    lastRowKey: '',
    page: 0,
    pageSize: 10
  };

  pageParams = {
    maxSize: 10,
    bigTotalItems: 10,
    itemsPerPage: this.getListParams.pageSize,
    bigCurrentPage: 1,
    numPages: 0
  };
  /*记录翻页lastRowKey,第一页默认传空*/
  pagesStoreData = [''];
  /*记录当前页码*/
  nowPagesNum = 0;
  list = [];
  listParams = {url: '/manager/v1/EpBaseInfoPojo/findListByCompanyNameAndDate', method: 'get'};

  formExcelTemplateData: any;
  ngOnInit() {
    const formExcelTemplateData = this.formManagersService.getFormExcelTemplateDownloadData();
    this.formExcelTemplateData = formExcelTemplateData.localtion + formExcelTemplateData.moveOut;
    this.getList();
  }

  getList() {
    const url = this.listParams.url;
    this.findListByUrl(this.getListParams, url).subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.list = res.data.epBaseInfoPojo;
        this.getListParams.lastRowKey = res.data.pagination.lastRowKey;
        if (this.list.length < 1) {
          this.toastModalService.addToasts({tipsMsg: '暂无信息！', type: 'info'});
        }
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }


  findListByUrl(findParams, url): Observable<any> {
    let paramsString = '';
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http.get(url, { params });
  }

  pageChanged(event: any): void {
    if (event > 0) {
      /*下一页*/
      if (this.getListParams.lastRowKey) {
        this.nowPagesNum++;
        if (this.pagesStoreData.indexOf(this.getListParams.lastRowKey) < 0) {
          this.pagesStoreData.push(this.getListParams.lastRowKey);
        }
        this.getList();
      }
    }else {
      if (this.nowPagesNum > 0) {
        this.nowPagesNum--;
        const prevLastRowKey = this.pagesStoreData[this.nowPagesNum];
        this.getListParams.lastRowKey = prevLastRowKey;
        this.getList();
      }
    }
  }

  /*搜索*/
  search() {
    this.nowPagesNum = 0;
    this.pagesStoreData = [];
    this.getListParams.lastRowKey = '';
    this.getList();
  }
  /*重置搜索*/
  resetSearch() {
    this.getListParams = {
      enterpriseName: '',
      lastRowKey: '',
      page: 0,
      pageSize: 10
    };
    this.nowPagesNum = 0;
    this.pagesStoreData = [];
    this.getList();
  }

}