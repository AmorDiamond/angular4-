import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-function-list',
  templateUrl: './function-list.component.html',
  styleUrls: ['./function-list.component.css']
})
export class FunctionListComponent implements OnInit {
  modalMessage: string;
  disableMethodParams = {id: '', flag: ''};
  methodsList = [];
  URLS = {
    findCompetenceList: '/manager/v1/competence/findByConditions'
  };
  competenceListParams = {
    methods: '',
    comment: '',
    status: -1,
    resource: '',
    page: 0,
    size: 15
  };
  pageParams = {
    maxSize: 10,
    bigTotalItems: 10,
    itemsPerPage: this.competenceListParams.size,
    bigCurrentPage: 1,
    numPages: 0
  };
  competenceStatus = [{label: '全部', value: -1}, {label: '正常', value: 1}, {label: '禁用', value: 2}];
  competenceMethods = ['POST', 'GET', 'DELETE', 'PATCH'];
  constructor(private http: HttpClient,  private toastModalService: ToastModalService) { }

  pageChanged(event: any): void {
    this.competenceListParams.page = event.page - 1;
    // console.log('Page changed to: ' + event.page);
    // console.log('Number items per page: ' + event.itemsPerPage);
    this.getMethodList();
  }
  ngOnInit() {
    this.getMethodList();
  }
  getMethodList() {
    this.findListByUrl(this.competenceListParams, 'findCompetenceList').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.methodsList = res.data.content;
        this.pageParams.bigTotalItems = res.data.totalElements;
        if (this.methodsList.length < 1) {
          this.toastModalService.addToasts({tipsMsg: '暂无信息！', type: 'info'});
        }
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  disableMethod(id, flag, template: TemplateRef<any>) {
    // let tipsMsg;
    if (flag === true) {
      this.modalMessage = '确定要启用该功能吗？';
    }else {
      this.modalMessage = '确定要禁用该功能吗？';
    }
    this.toastModalService.showModal(template);
    this.disableMethodParams.id = id;
    this.disableMethodParams.flag = flag;
    /*const paramsString = 'id=' + id + '&flag=' + flag;
    const params = new HttpParams({ fromString: paramsString });
    if (confirm(tipsMsg)) {
      const url = '/v1/competence/disableOrUndisable';
      this.http.post(url, params).subscribe((res: any) => {
        if (res.responseCode === '_200') {
          alert('操作成功');
          this.getMethodList();
        }else {
          alert(res.errorMsg);
        }
      });
    }*/
  }
  confirm(): void {
    const paramsString = 'id=' + this.disableMethodParams.id + '&flag=' + this.disableMethodParams.flag;
    const params = new HttpParams({ fromString: paramsString });
    const url = '/manager/v1/competence/disableOrUndisable';
    this.http.post(url, params).subscribe((res: any) => {
      if (res.responseCode === '_200') {

        this.toastModalService.showSuccessToast({tipsMsg: '操作成功！'});
        this.getMethodList();
      }else {
        this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
      }
    });
    this.toastModalService.hideModal();
  }

  decline(): void {
    this.toastModalService.hideModal();
  }
  findListByUrl(findParams, type): Observable<any> {
    let paramsString = '';
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http.get(this.URLS[type], { params });
  }
  /*搜索*/
  search() {
    this.competenceListParams.page = 0;
    this.pageParams.bigCurrentPage = 1;
    this.getMethodList();
  }
  /*重置搜索*/
  resetSearch() {
    this.competenceListParams = {
      methods: '',
      comment: '',
      status: -1,
      resource: '',
      page: 0,
      size: 15
    };
    this.pageParams.bigCurrentPage = 1;
    this.getMethodList();
  }

}
