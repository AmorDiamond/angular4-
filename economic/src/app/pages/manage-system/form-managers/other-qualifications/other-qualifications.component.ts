import { Component, OnInit } from '@angular/core';
import { FormManagersService } from '../form-managers.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-other-qualifications',
  templateUrl: './other-qualifications.component.html',
  styleUrls: ['./other-qualifications.component.css']
})
export class OtherQualificationsComponent implements OnInit {

  constructor(
    private formManagersService: FormManagersService,
    private toastModalService: ToastModalService
  ) { }
  getListParams = {
    enterpriseName: '',
    currentPage: '',
    pageSize: 15,
    lastRowKey: ''
  };
  pageParams = {
    maxSize: '',
    itemsPerPage: '',
    bigTotalItems: '',
    bigCurrentPage: '',
    numPages: '',
  };
  /*记录翻页lastRowKey,第一页默认传空*/
  pagesStoreData = [''];
  /*记录当前页码*/
  nowPagesNum = 0;
  list: any = [];
  formExcelTemplateData: any;
  ngOnInit() {
    const formExcelTemplateData = this.formManagersService.getFormExcelTemplateDownloadData();
    this.formExcelTemplateData = formExcelTemplateData.localtion + formExcelTemplateData.otherQualifications;
    this.getList();
  }
  getList() {
    this.formManagersService.requestByParams(this.getListParams, 'otherQualificationsUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        if (res.data.eQICertificationPojo.length < 1) {
          this.toastModalService.addToasts({tipsMsg: '暂无信息！', type: 'info'});
        }
        this.list = res.data.eQICertificationPojo;
        this.getListParams.lastRowKey = res.data.pagination.lastRowKey
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
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
  resetSearch() {
    this.getListParams = {
      enterpriseName: '',
      currentPage: '',
      pageSize: 15,
      lastRowKey: ''
    };
    this.nowPagesNum = 0;
    this.pagesStoreData = [];
    this.getList();
  }

}
