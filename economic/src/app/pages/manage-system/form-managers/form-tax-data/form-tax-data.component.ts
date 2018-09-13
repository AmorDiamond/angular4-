import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { zhCnLocale } from 'ngx-bootstrap/locale';

import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { FormManagersService } from '../form-managers.service';

defineLocale('zh-cn', zhCnLocale)

@Component({
  selector: 'app-form-tax-data',
  templateUrl: './form-tax-data.component.html',
  styleUrls: ['./form-tax-data.component.css'],
  providers: [ DatePipe]
})
export class FormTaxDataComponent implements OnInit {

  constructor(
    private datePipe: DatePipe,
    private localeService: BsLocaleService,
    private toastModalService: ToastModalService,
    private http: HttpClient,
    private formManagersService: FormManagersService
  ) {
    this.localeService.use('zh-cn');
  }

  locale: any;
  bsConfig = { dateInputFormat: 'YYYY-MM-DD', containerClass: 'theme-orange', showWeekNumbers: false };

  getListParams = {
    companyName: '',
    year: '',
    page: 0,
    size: 15
  };

  chooseTime = {
    beginCreateTime: null,
    endCreateTime: null
  };

  pageParams = {
    maxSize: 10,
    bigTotalItems: 10,
    itemsPerPage: this.getListParams.size,
    bigCurrentPage: 1,
    numPages: 0
  };
  list = [];

  listParams = {url: '/manager/v1/incometax/getByConditions', method: 'get'};

  formExcelTemplateData: any;
  ngOnInit() {
    const formExcelTemplateData = this.formManagersService.getFormExcelTemplateDownloadData();
    this.formExcelTemplateData = formExcelTemplateData.localtion + formExcelTemplateData.taxData;
    this.getList();
  }

  getList() {
    const url = this.listParams.url;
    // this.getListParams.createDate = this.chooseTime.beginCreateTime ? this.datePipe.transform(this.chooseTime.beginCreateTime,'yyyy-MM-dd'):'';
    // this.getListParams.endDate = this.chooseTime.endCreateTime ? this.datePipe.transform(this.chooseTime.endCreateTime,'yyyy-MM-dd'):'';
    this.findListByUrl(this.getListParams, url).subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.list = res.data.content;
        this.pageParams.bigTotalItems = res.data.totalElements;
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
      companyName: '',
      year: '',
      page: 0,
      size: 15
    };
    this.pageParams.bigCurrentPage = 1;
    this.getList();
  }

}
