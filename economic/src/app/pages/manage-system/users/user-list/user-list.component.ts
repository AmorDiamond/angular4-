import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private http: HttpClient, private toastModalService: ToastModalService) { }
  modalMessage: string;
  disableParams = {id: '', flag: ''};
  usersList = [];
  URLS = {
    findUsersList: '/manager/v1/ldapUser/findUserByParams',
    disableOrUsableUrl: '/manager/v1/ldapUser/disableOrUsable'
  };
  ldapUserListParams = {
    account: '',
    status: '',
    mechanism: '',
    page: 0,
    size: 15
  };
  pageParams = {
    maxSize: 5,
    itemsPerPage: this.ldapUserListParams.size,
    bigTotalItems: 10,
    bigCurrentPage: 1,
    numPages: 0
  };
  ldapNodeTypes = [{label: '全部', value: -1}, {label: '用户', value: 1}, {label: '机构', value: 2}];
  ldapUserStatus = [{label: '全部', value: ''}, {label: '正常', value: 'STATUS_NORMAL'}, {label: '禁用', value: 'STATUS_DISABLE'}];
  ngOnInit() {
    this.getUsersList();
  }
  pageChanged(event: any): void {
    this.ldapUserListParams.page = event.page - 1;
    // console.log('Number items per page: ' + event.itemsPerPage);
    this.getUsersList();
  }
  getUsersList() {
    this.findListByUrl(this.ldapUserListParams, 'findUsersList').subscribe(res => {
      console.log(res);
      if(res.responseCode === '_200') {
        this.usersList = res.data.content;
        this.pageParams.bigTotalItems = res.data.totalElements;
        if(this.usersList.length < 1) {
          this.toastModalService.addToasts({tipsMsg: '暂无信息！', type: 'info'});
        }
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }

    });
  }
  findListByUrl(findParams, url, type?): Observable<any> {
    let paramsString = '';
    const requestUrl = url;
    const requestType = type ? type : 'get';
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    return this.http[requestType](this.URLS[requestUrl], { params });
  }
  disable(id, flag, template) {
    if (flag === true) {
      this.modalMessage = '确定要启用该用户吗？';
    }else {
      this.modalMessage = '确定要禁用该用户吗？';
    }
    // this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.toastModalService.showModal(template);
    this.disableParams.id = id;
    this.disableParams.flag = flag;
  }
  confirm(): void {
    this.toastModalService.hideModal();
    const url = '/manager/v1/ldapUser/disableOrUsable';
    const params = {id: this.disableParams.id, flag: this.disableParams.flag};
    this.http.patch(url + '?id=' + this.disableParams.id + '&flag=' + this.disableParams.flag, {}).subscribe((res: any) => {
    // this.findListByUrl(params, 'disableOrUsableUrl', 'patch').subscribe((res: any) => {
      if (res.responseCode === '_200') {
        this.toastModalService.addToasts({tipsMsg: '操作成功！', type: 'success'});
        this.getUsersList();
      }else {

        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }

  decline(): void {
    // this.modalRef.hide();
    this.toastModalService.hideModal();
  }
  delete(userId, template) {
    this.modalMessage = '确定要删除该用户吗？';
    // this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.toastModalService.showModal(template);
    this.disableParams.id = userId;
  }
  confirmDelet() {
    const url = '/v1/ldapNode/';
    this.http.delete(url + '?id=' + this.disableParams.id, {}).subscribe((res: any) => {
      if (res.responseCode === '_200') {
        this.toastModalService.showSuccessToast({tipsMsg: '操作成功！'});
        this.getUsersList();
      }else {
        this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
      }
    });
    this.toastModalService.hideModal();
  }

}
