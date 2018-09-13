import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { FormManagersService } from '../form-managers.service';

@Component({
  selector: 'app-public-expenditure',
  templateUrl: './public-expenditure.component.html',
  styleUrls: ['./public-expenditure.component.css']
})
export class PublicExpenditureComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private toastModalService: ToastModalService,
    private formManagersService: FormManagersService
  ) { }
  getListParams = {
    year: '',
    areaRange: '',
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
  listParams = {url: '/manager/v1/macroPublicExpend/getExpendByAreaAndYear', method: 'get'};

  formExcelTemplateData: any;
  ngOnInit() {
    const formExcelTemplateData = this.formManagersService.getFormExcelTemplateDownloadData();
    this.formExcelTemplateData = formExcelTemplateData.localtion + formExcelTemplateData.publicExponent;
    this.getList();
  }

  getList() {
    const url = this.listParams.url;
    this.findListByUrl(this.getListParams, url).subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.list = res.data.macroGdpEntity.content;
        this.pageParams.bigTotalItems = res.data.macroGdpEntity.totalElements;
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
      year: '',
      areaRange: '',
      page: 0,
      size: 15
    };
    this.pageParams.bigCurrentPage = 1;
    this.getList();
  }

}
