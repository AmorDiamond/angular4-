import {Component, Input, OnInit} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { FunctionManageComponent } from '../function-manage/function-manage.component';
import { NzMessageService } from 'ng-zorro-antd';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-function-list',
  templateUrl: './function-list.component.html',
  styleUrls: ['./function-list.component.css']
})
export class FunctionListComponent implements OnInit {

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService,
    private rolesService: RolesService,
  ) {
  }
  Params = {
    comment: '',
    resource: '',
    methods: null,
    status: null,
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
  methods: Array<string> = ['POST', 'GET', 'DELETE', 'PATCH'];
  filterStatusEnum = [
    {label: '正常', value: 1},
    {label: '禁用', value: 2}
  ];
  dataSet = [];
  statusEnum = {
    'STATUS_NORMAL': '正常',
    'STATUS_DISABLE': '禁用'
  };
  competenceData: any = {
    id: '',
    comment: '',
    methods: '',
    resource: ''
  };
  loadingStatus = false;
  ngOnInit() {
    this.getList();
  }
  getList () {
    this.loadingStatus = true;
    this.pageParams.currentPage = this.Params.page + 1; // 控制table分页器当前显示页，避免分页后搜索分页显示不正确
    this.rolesService.requestByParams(this.Params, 'competenceListUrl').subscribe(res => {
      this.loadingStatus = false;
      if (res.responseCode === '_200') {
        this.dataSet = res.data.content;
        this.pageParams.totalItems = res.data.totalElements;
        if (this.dataSet.length < 1) {
          this.message.info('暂无信息！');
        }
      } else {
        this.message.error(res.errorMsg);
      }
    });
  }
  pageChange (event) {
    this.Params.page = event - 1;
    this.getList();
  }
  search () {
    this.Params.page = 0; // 重置页码搜索
    this.getList();
  }
  reset () {
    this.Params = {
      comment: '',
      resource: '',
      methods: null,
      status: null,
      page: 0,
      size: 15
    };
    this.getList();
  }

  confirm (data) {
    const messageId = this.message.create('loading', '正在处理', { nzDuration: 0 }).messageId;
    const flag = data.status === 'STATUS_NORMAL' ? false : true;
    const params = {
      id: data.id,
      flag: flag
    };
    this.rolesService.requestByParams(params, 'disableOrUndisableCompetenceUrl', 'post').subscribe(res => {
      if (res.responseCode === '_200') {
        data.status = data.status === 'STATUS_NORMAL' ? 'STATUS_DISABLE' : 'STATUS_NORMAL';
        this.message.create('success', '操作成功！');
      } else {
        this.message.create('error', res.errorMsg);
      }
      this.message.remove(messageId);
    });
  }
  addHandle (resolve, reject) {
    const params = {};
    this.rolesService.requestByParams(this.competenceData, 'editOrAddcompetence', 'post', 'object').subscribe(res => {
      if (res.responseCode === '_200') {
        this.message.create('success', '新增成功！');
        this.getList();
        resolve();
      } else {
        this.message.error(res.errorMsg);
        reject();
      }
    });
  }
  updateHandle (resolve, reject) {
    this.rolesService.requestByParams(this.competenceData, 'editOrAddcompetence', 'patch', 'object').subscribe(res => {
      if (res.responseCode === '_200') {
        this.message.create('success', '修改成功！');
        this.getList();
        resolve();
      } else {
        this.message.error(res.errorMsg);
        reject();
      }
    });
  }
  createComponentModal(data?): void {
    const title = data ? '修改功能' : '新增功能';
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: FunctionManageComponent,
      nzMaskClosable: false,
      nzOnOk: (res) => {
        const validateForm = res.validateForm;
        let ok = true;
        for (const i in validateForm.controls) {
          console.log(validateForm.controls[ i ])
          if (!validateForm.controls[ i ].value) { // 如果有一个数据为空则返回false不能提交
            ok = false;
          }
          validateForm.controls[ i ].markAsDirty();
          validateForm.controls[ i ].updateValueAndValidity();
        }

        this.competenceData.id = data ? data.id : '';
        /*获取modal框的数据*/
        this.competenceData.comment = validateForm.value.comment;
        this.competenceData.methods = validateForm.value.methods;
        this.competenceData.resource = validateForm.value.resource;
        /*异步请求，实现modal框的ok按钮实现Loading效果*/
        const requestHandle = new Promise((resolve, reject) => {
          if (data) { // 修改
            this.updateHandle(resolve, reject);
          } else { // 新增
            this.addHandle(resolve, reject);
          }
        }).then(() => true, () => false);
        return ok ? requestHandle : false;
        /*return ok ? new Promise((resolve, reject) => {
          setTimeout(() => {
            return reject();
          }, 10000);
        }) : false;*/
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
}
