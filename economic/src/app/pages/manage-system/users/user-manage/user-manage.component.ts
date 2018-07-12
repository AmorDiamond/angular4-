import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {

  constructor(private router: Router, private routeInfo: ActivatedRoute, private http: HttpClient, private toastModalService: ToastModalService) { }
  ldapName: any;
  ldapNodeType: any;
  ldapNodeTypes = [{label: '用户', value: 1}, {label: '机构', value: 2}];
  addUserParams = {url: '/v1/ldapNode/', method: 'post'};
  getUserDetailParams = {url: '/v1/ldapNode/findById', method: 'get'};
  ngOnInit() {
    this.routeInfo.params.subscribe((params: ParamMap) => {
      if (params['id'] !== '-1') {
        this.getUserDetail(params['id']);
      }
    });
  }
  getUserDetail(userId) {
    const url = this.getUserDetailParams.url;
    this.http.get(url + '?id=' + userId ).subscribe((res: any) => {
      this.ldapName = res.data.ldapName;
      this.ldapNodeType = res.data.nodeType;
    });
  }
  onSubmit() {
    const url = this.addUserParams.url;
    this.http.post(url, {
      'id': '',
      'ldapName': this.ldapName,
      'nodeType': this.ldapNodeType,
      'status': 'STATUS_NORMAL'
    }).subscribe((res: any) => {
      if (res.responseCode === '_200') {
        this.toastModalService.showSuccessToast({tipsMsg: '操作成功！', router: 'admin/users/userList'});
      }else {
        this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
      }
    });
  }

}
