import { Component, OnInit } from '@angular/core';
import { RolesService } from '../roles.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  constructor(
    private rolesService: RolesService,
    private message: NzMessageService
  ) { }

  Params = {
    roleName: '',
    status: '',
    page: 0,
    size: 15
  }
  pageParams = {
    maxSize: 10,
    itemsPerPage: this.Params.size,
    totalItems: 10,
    currentPage: 1,
    numPages: 0
  };
  dataSet = [];
  statusEnum = {
    'STATUS_NORMAL': '正常',
    'STATUS_DISABLE': '禁用'
  };
  loadingStatus = false;
  ngOnInit() {
    this.getList();
  }
  getList () {
    this.loadingStatus = true;
    this.pageParams.currentPage = this.Params.page + 1; // 控制table分页器当前显示页，避免分页后搜索分页显示不正确
    this.rolesService.requestByParams(this.Params, 'rolesListUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        this.dataSet = res.data.content;
        this.pageParams.totalItems = res.data.totalElements;
        if (this.dataSet.length < 1) {
          this.message.info('暂无信息！');
        }
      } else {
        this.message.error(res.errorMsg);
      }
      this.loadingStatus = false;
    });
  }
  pageChange (event) {
    this.Params.page = event - 1;
    this.getList();
  }
  search (event) {
    this.Params.roleName = event.roleName;
    this.Params.status = event.status;
    this.Params.page = 0; // 重置页码搜索
    this.getList();
  }

  confirm(data, status) {
    console.log(data)
    const messageId = this.message.create('loading', '正在处理', { nzDuration: 0 }).messageId;
    const url = status === 'STATUS_NORMAL' ? 'disableRoleUrl' : 'enableRoleUrl';
    const params = {roleId: data.id};
    console.log(params)
    this.rolesService.requestByParams(params, url, 'post').subscribe(res => {
      this.message.remove(messageId);
      if (res.responseCode === '_200') {
        data.status = status === 'STATUS_NORMAL' ? 'STATUS_DISABLE' : 'STATUS_NORMAL';
        this.message.create('success', '操作成功！');
      } else {
        this.message.error(res.errorMsg);
      }
    });
  }

}
