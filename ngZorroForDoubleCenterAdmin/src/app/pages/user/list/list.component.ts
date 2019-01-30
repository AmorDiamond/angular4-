import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '../user.service';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { SetrolesModalComponent } from './components/setroles-modal/setroles-modal.component';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(
    private message: NzMessageService,
    private user: UserService,
    private modalService: NzModalService
  ) { }
  Params = {
    account: '',
    status: '',
    page: 0,
    size: 15
  };
  pageParams = {
    maxSize: 10,
    itemsPerPage: this.Params.size,
    totalItems: 10,
    currentPage: 1,
    numPages: 0
  };
  ldapNodeTypes = [{label: '全部', value: -1}, {label: '用户', value: 1}, {label: '机构', value: 2}];
  ldapUserStatus = [{label: '全部', value: ''}, {label: '正常', value: 'STATUS_NORMAL'}, {label: '禁用', value: 'STATUS_DISABLE'}];
  userStatus = {
    'STATUS_NORMAL': '正常',
    'STATUS_DISABLE': '禁用'
  };
  tooltipInfo = {
    popconfirmTitle: {
      'STATUS_NORMAL': '确认禁用该用户?',
      'STATUS_DISABLE': '确认启用该用户?'
    },
    tooltipTilte: {
      'STATUS_NORMAL': '禁用',
      'STATUS_DISABLE': '启用'
    },
    iconType: {
      'STATUS_NORMAL': 'stop',
      'STATUS_DISABLE': 'check-circle'
    }
  };
  list = [];
  loadingStatus = false;
  userDataParams = {
    id: '',
    userName: '',
    account: '',
    password: ''
  };
  ngOnInit() {
    this.getUsersList();
  }

  getUsersList() {
    this.loadingStatus = true;
    this.pageParams.currentPage = this.Params.page + 1; // 控制table分页器当前显示页，避免分页后搜索分页显示不正确
    this.user.requestByParams(this.Params, 'findUsersList').subscribe(res => {
      console.log(res);
      this.loadingStatus = false;
      if (res.responseCode === '_200') {
        this.list = res.data.content;
        this.pageParams.totalItems = res.data.totalElements;
        if (this.list.length < 1) {
          this.message.info('暂无信息！');
        }
      } else {
        this.message.error(res.errorMsg);
      }

    });
  }
  search (event) {
    this.Params.account = event.account;
    this.Params.status = event.status;
    this.Params.page = 0; // 重置页码搜索
    this.getUsersList();
  }
  pageChange (event) {
    this.Params.page = event - 1;
    this.getUsersList();
  }
  addUser () {
    this.createComponentModal();
  }
  confirm(data, status) {
    console.log(data)
    const messageId = this.message.create('loading', '正在处理', { nzDuration: 0 }).messageId;
    const flag = status === 'STATUS_NORMAL' ? 'false' : 'true';
    const params = {id: data.id, flag: flag};
    console.log(params)
    this.user.patchRequestByParams(params, 'disableOrUsableUrl').subscribe(res => {
      this.message.remove(messageId);
      if (res.responseCode === '_200') {
        data.status = flag === 'true' ? 'STATUS_NORMAL' : 'STATUS_DISABLE';
        this.message.create('success', '操作成功！');
      } else {
        this.message.error(res.errorMsg);
      }
    });
  }
  addUserHandle (resolve, reject) {
    const params = {};
    this.user.requestByParams(this.userDataParams, 'createUserUrl', 'post', 'object').subscribe(res => {
      if (res.responseCode === '_200') {
        this.message.create('success', '新增成功！');
        this.getUsersList();
        resolve();
      } else {
        this.message.error(res.errorMsg);
        reject();
      }
    });
  }
  updateUserHandle (resolve, reject) {
    const params = {};
    this.user.patchRequestByParams(this.userDataParams, 'updateUserUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        this.message.create('success', '修改成功！');
        this.getUsersList();
        resolve();
      } else {
        this.message.error(res.errorMsg);
        reject();
      }
    });
  }
  createComponentModal(data?): void {
    const title = data ? '修改用户' : '新增用户';
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: EditModalComponent,
      nzMaskClosable: false,
      nzOnOk: (res) => {
        const validateForm = res.validateForm;
        let ok = true;
        console.log('validateForm', validateForm)
        for (const i in validateForm.controls) {
          console.log(validateForm.controls[ i ])
          if (validateForm.controls[i].status !== 'VALID') { // 如果存在未通过验证的不能提交
            ok = false;
          }
          validateForm.controls[ i ].markAsDirty();
          validateForm.controls[ i ].updateValueAndValidity();
        }

        this.userDataParams.id = data ? data.id : '';
        /*获取modal框的数据*/
        this.userDataParams.account = validateForm.value.account;
        this.userDataParams.userName = validateForm.value.userName;
        this.userDataParams.password = validateForm.value.password;
        return ok ? this.handleUserInfoPromise(data) : false;
        // return ok ? this.addUserHandle() : false;
      },
      nzComponentParams: {
        record: data,
      },
      /*nzFooter: [{
        label: 'change component tilte from outside',
        onClick: (componentInstance) => {
          componentInstance.title = 'title in inner component is changed';
        }
      }]*/
    });

    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));

    // Return a result when closed
    modal.afterClose.subscribe((result) => console.log('[afterClose] The result is:', result));
  }
  handleUserInfoPromise (data) {
    /*异步请求，实现modal框的ok按钮实现Loading效果*/
    const requestHandle = new Promise((resolve, reject) => {
      if (data) { // 修改
        this.updateUserHandle(resolve, reject);
      } else { // 新增
        this.addUserHandle(resolve, reject);
      }
    }).then(() => true, () => false);
    return requestHandle;
  }
  createSetRolesModal(data?): void {
    const title = data ? '设置用户角色' : '';
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: SetrolesModalComponent,
      nzMaskClosable: false,
      nzOnOk: (res) => {
        const modalData = res;
        let ok = true;
        if (modalData.newRoles.length < 1 && modalData.removeRoles.length < 1) { // 如果存在未通过验证的不能提交
          ok = false;
        }
        /*异步请求，实现modal框的ok按钮实现Loading效果*/
        /*const requestHandle = new Promise((resolve, reject) => {
          if (data) { // 修改
            this.updateUserHandle(resolve, reject);
          } else { // 新增
            this.addUserHandle(resolve, reject);
          }
        }).then(() => true, () => false);*/
        console.log(modalData, ok)
        return ok ? this.handleBindRolesPromise(data.id, modalData.newRoles, modalData.removeRoles) : true;
        // return ok ? this.addUserHandle() : false;
      },
      nzComponentParams: {
        record: data,
      },
      /*nzFooter: [{
        label: 'change component tilte from outside',
        onClick: (componentInstance) => {
          componentInstance.title = 'title in inner component is changed';
        }
      }]*/
    });

    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));

    // Return a result when closed
    modal.afterClose.subscribe((result) => console.log('[afterClose] The result is:', result));
  }
  handleBindRolesPromise (userid, newRoles, removeRoles) {
    /*异步请求，实现modal框的ok按钮实现Loading效果*/
    const requestHandle = new Promise((resolve, reject) => {
      const list = [];
      if (newRoles.length) {
        list.push({params: {roleIds: newRoles, ldapNodeId: userid}, url: 'bindRolesUrl'});
      }
      if (removeRoles.length) {
        list.push({params: {roleIds: removeRoles, ldapNodeId: userid}, url: 'unbindRolesUrl'});
      }
      this.user.postRequestByForkJoin(list).subscribe(res => {
        const errorList = res.filter(item => item.responseCode !== '_200');
        if (errorList.length) {
          errorList.forEach(item => {
            this.message.error(item.errorMsg);
          });
          reject();
        } else {
          resolve();
        }
      });
    }).then(() => true, () => false);
    return requestHandle;
  }
}
