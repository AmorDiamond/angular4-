import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { EnterpriseEditModalComponent } from '../enterprise-edit-modal/enterprise-edit-modal.component';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css']
})
export class TechnologyComponent implements OnInit {

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService
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
    bigTotalItems: 10,
    bigCurrentPage: 1,
    numPages: 0
  };
  methods: Array<string> = ['POST', 'GET', 'DELETE', 'PATCH'];
  filterStatusEnum = [
    {value: 'STATUS_NORMAL', label: '正常'},
    {value: 'STATUS_DISABLE', label: '禁用'}
  ];
  statusEnum = {
    'STATUS_NORMAL': '正常',
    'STATUS_DISABLE': '禁用'
  };
  dataSet = [
    {
      id: 1,
      name: '公司名称',
      creditCode: '999999999',
      registeredAddress: '注册地址',
      businessScope: '经营范围',
      businessStatus: 'STATUS_NORMAL',
      legalPersonName: '法人',
      telephone: '028-88888888',
      registCapital: '5000',
      establishDate: '1999-01-01',
    }
  ];
  editData: any = {
    id: 1,
    name: '公司名称',
    creditCode: '社会信用代码',
    registeredAddress: '注册地址',
    businessScope: '经营范围',
    businessStatus: '经营状态',
    legalPersonName: '法人',
    telephone: '联系电话',
    registCapital: '注册资金',
    establishDate: '成立日期',
  };
  ngOnInit() {
  }

  confirm(id) {
    console.log(id);
    const messageId = this.message.create('loading', '正在处理', { nzDuration: 0 }).messageId;
    setTimeout(() => {
      this.message.remove(messageId);
      this.message.create('success', '操作成功！');
    }, 2000);
  }
  createComponentModal(data = this.editData): void {
    const title = data ? '修改信息' : '新增信息';
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: EnterpriseEditModalComponent,
      nzMaskClosable: false,
      nzOnOk: (res) => {
        const validateForm = res.validateForm;
        let ok = true;
        if (validateForm.status !== 'VALID') { // 如果表单未通过验证不能提交
          ok = false;
        }
        for (const i in validateForm.controls) {
          validateForm.controls[ i ].markAsDirty();
          validateForm.controls[ i ].updateValueAndValidity();
        }

        this.editData.id = data ? data.id : '';
        /*获取modal框的数据*/
        for (const i in validateForm.value) {
          this.editData[i] = validateForm.value[i];
        }
        // this.editData.name = validateForm.value.name;
        return ok ? this.handleEditPromise(data) : false;
      },
      nzComponentParams: {
        record: data,
      },
    });
  }
  handleEditPromise (data) {
    /*异步请求，实现modal框的ok按钮实现Loading效果*/
    const requestHandle = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.message.success('修改成功！');
        resolve();
      }, 2000);
    }).then(() => true, () => false);
    return requestHandle;
  }
}
