import { Component, OnInit } from '@angular/core';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { HttpClient } from '@angular/common/http';
import { FormManagersService } from '../form-managers.service';

@Component({
  selector: 'app-people-income',
  templateUrl: './people-income.component.html',
  styleUrls: ['./people-income.component.css']
})
export class PeopleIncomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private toastModalService: ToastModalService,
    private formManagersService: FormManagersService
  ) { }
  getListParams = {
    area: '',
    year: '',
    page: 0,
    size: 15
  };

  pageParams = {
    maxSize: 10,
    bigTotalItems: 10,
    itemsPerPage: this.getListParams.size,
    bigCurrentPage: 1,
    numPages: 0
  };

  list = [];

  formExcelTemplateData: any;
  ngOnInit() {
    const formExcelTemplateData = this.formManagersService.getFormExcelTemplateDownloadData();
    this.formExcelTemplateData = formExcelTemplateData.localtion + formExcelTemplateData.peopleIncome;
    this.getList();
  }

  getList() {
    this.formManagersService.requestByParams(this.getListParams, 'peopleIncomeUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.list = res.data.publicAvgincome.content;
        this.pageParams.bigTotalItems = res.data.publicAvgincome.totalElements;
        if (this.list.length < 1) {
          this.toastModalService.addToasts({tipsMsg: '暂无信息！', type: 'info'});
        }
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }

  pageChanged(event: any): void {
    this.getListParams.page = event.page - 1;
    this.getList();
  }

  /*搜索*/
  search() {
    this.getListParams.page = 0;
    this.pageParams.bigCurrentPage = 1;
    this.getList();
  }
  /*重置搜索*/
  resetSearch() {
    this.getListParams = {
      area: '',
      year: '',
      page: 0,
      size: 15
    };
    this.pageParams.bigCurrentPage = 1;
    this.getList();
  }

}
