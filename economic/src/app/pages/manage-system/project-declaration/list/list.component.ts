import { Component, OnInit } from '@angular/core';
import {
  ProjectDeclarationService,
  GetListParams
} from '../project-declaration.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [
    `
  a {
    color: #000;
  }
  .con-hd button {
    outline: none;
    padding: 10px 15px;
    background: #f9b620;
    border: none;
    box-shadow: 3px 3px 10px #9a9a9a;
    border-radius: 3px;
  }

  .con-hd button.excel-export {
    margin-left: 20px;
  }
  .filter-bt {
    margin: 10px 0;
  }
  .export-btn {
    margin-left: 20px;
    color: #000;
    background: #f9b71c;
    box-shadow: 3px 3px 10px #9a9a9a;
  }
  .export-btn:active, .con-hd button:active {
    box-shadow: inset 0 3px 5px rgba(0,0,0,.125)
  }

  `
  ],
  providers: [ProjectDeclarationService]
})
export class ListComponent implements OnInit {
  getListParams: GetListParams;
  list: any[];
  private downloadUrl: string;
  private exportUrl: string;
  constructor(
    private toastModalService: ToastModalService,
    private service: ProjectDeclarationService
  ) {
    this.getListParams = {
      companyName: 'test1',
      projectName: ''
    };
    this.list = [];

    this.exportUrl = this.getListParams.companyName;
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.service.getList(this.getListParams).subscribe(
      res => {
        if (res.responseCode === '_200') {
          // console.log('获取项目申报列表', res.data.kETProjectDeclarationPojo);
          this.list = res.data.kETProjectDeclarationPojo;
        } else {
          this.toastModalService.showErrorToast({ errorMsg: res.errorMsg });
        }
      },
      err => {
        this.toastModalService.showErrorToast({ errorMsg: err });
      }
    );
  }
}
