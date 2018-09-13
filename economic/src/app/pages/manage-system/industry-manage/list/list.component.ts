import { Component, OnInit } from '@angular/core';
import { IndustryManagersService } from '../industry-managers.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(
    private industryManagersService: IndustryManagersService,
    private toastModalService: ToastModalService
  ) { }
  dataList = [];
  searchParams = {
    companyName: '',
    page: 0,
    size: 15
  };
  pageParams = {
    maxSize: 10,
    itemsPerPage: this.searchParams.size,
    bigTotalItems: 10,
    bigCurrentPage: 1,
    numPages: 0
  };
  ngOnInit() {
    this.getList();
  }
  /*获取数据*/
  getList() {
    this.industryManagersService.requestByParams(this.searchParams, 'getCompanyIndustryList').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        this.dataList = res.data.content;
        this.pageParams.bigTotalItems = res.data.totalElements;
        if (this.dataList.length < 1) {
          this.toastModalService.addToasts({tipsMsg: '暂无信息！', type: 'info'});
        }
      }
    });
  }
  pageChanged($event) {
    const pageNumber = $event.page - 1;
    this.searchParams.page = pageNumber;
    this.getList();
  }
  search() {
    this.searchParams.page = 0;
    this.pageParams.bigCurrentPage = 1;
    this.getList();
  }
  resetSearch() {
    this.searchParams = {
      companyName: '',
      page: 0,
      size: 15
    };
    this.pageParams.bigCurrentPage = 1;
    this.getList();
  }

}
