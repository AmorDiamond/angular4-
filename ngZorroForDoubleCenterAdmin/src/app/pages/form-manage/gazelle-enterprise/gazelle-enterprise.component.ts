import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-gazelle-enterprise',
  templateUrl: './gazelle-enterprise.component.html',
  styleUrls: ['./gazelle-enterprise.component.css']
})
export class GazelleEnterpriseComponent implements OnInit {

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
  dataSet = [];
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
}
