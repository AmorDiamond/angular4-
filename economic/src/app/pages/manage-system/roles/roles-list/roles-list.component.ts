import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css']
})
export class RolesListComponent implements OnInit {

  constructor(private http: HttpClient, private toastModalService: ToastModalService) { }
  modalMessage: string;
  disableParams = {id: '', flag: ''};
  rolesList = [];
  URLS = {
    findRolesList: '/v1/roles/findByConditions'
  };
  rolesListParams = {
    roleName: '',
    status: -1,
    page: 0,
    size: 15
  };
  pageParams = {
    maxSize: 5,
    itemsPerPage: this.rolesListParams.size,
    bigTotalItems: 10,
    bigCurrentPage: 1,
    numPages: 0
  };
  rolesStatus = [{label: '全部', value: -1}, {label: '正常', value: 1}, {label: '禁用', value: 2}];
  ngOnInit() {
    this.getRolesList();
  }
  pageChanged(event: any): void {
    this.rolesListParams.page = event.page - 1;
    // console.log('Number items per page: ' + event.itemsPerPage);
    this.getRolesList();
  }
  getRolesList() {
    this.findListByUrl(this.rolesListParams, 'findRolesList').subscribe(res => {
      console.log(res);
      this.rolesList = res.data.content;
      this.pageParams.bigTotalItems = res.data.totalElements;
      console.log(this.pageParams);
    });
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
  disableRole(id, flag, template) {
    if (flag === true) {
      this.modalMessage = '确定要启用该角色吗？';
    }else {
      this.modalMessage = '确定要禁用该角色吗？';
    }
    this.toastModalService.showModal(template);
    this.disableParams.id = id;
    this.disableParams.flag = flag;
  }
  confirm(): void {
    let url;
    if (this.disableParams.flag) {
      url = '/v1/roles/enable/';
    }else {
      url = '/v1/roles/disable/';
    }
    this.http.post(url + this.disableParams.id, {}).subscribe((res: any) => {
      if (res.responseCode === '_200') {
        // alert('操作成功');
        this.toastModalService.showSuccessToast({tipsMsg: '操作成功！'});
        this.getRolesList();
      }else {
        this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
      }
    });
    this.toastModalService.hideModal();
  }

  decline(): void {
    this.toastModalService.hideModal();
  }

}
