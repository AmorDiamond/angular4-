import { Component, OnInit } from '@angular/core';
import { CompanyBasicService } from '../company-basic.service';
import { MicrocosmicService } from '../../../microcosmic.service';
import { ToastModalService } from "../../../../../shared/toast-modal/toast-modal.service";

@Component({
  selector: 'app-custom-label',
  templateUrl: './custom-label.component.html',
  styleUrls: ['./custom-label.component.css']
})
export class CustomLabelComponent implements OnInit {

  constructor(
    private companyBasicService: CompanyBasicService,
    private microcomicService: MicrocosmicService,
    private toastModalService: ToastModalService,
  ) { }
  rowkey: any;
  addLabelStatus: false;
  newLabel: any;
  labelLists = [];
  deleteLabelId: number;
  userId = sessionStorage.getItem('userId');
  deleteLabelConfirmTips = '确定要删除该标签吗？';
  CompanyCustomLabelTips = '加载中...';
  ngOnInit() {
    this.rowkey = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.rowkey);
    this.getCompanyCustomLabel();
  }
  /*获取企业的自定义标签*/
  getCompanyCustomLabel() {
    this.companyBasicService.findListByUrl({companyName: this.rowkey}, 'companyCustomLabelUrl').subscribe(res => {
      console.log('自定义标签', res);
      if (res.responseCode === '_200') {
        if (res.data.length < 1) {
          this.CompanyCustomLabelTips = '该企业暂不存在自定义标签！';
        }
        this.labelLists = res.data;
      }
    })
  }
  /*添加新自定义标签*/
  addNewLabel() {
    const newLabel = this.newLabel.trim();
    if (newLabel) {
      for (let i = 0; i < this.labelLists.length; i++) {
        if (newLabel === this.labelLists[i].content) {
          this.toastModalService.showErrorToast({errorMsg: '该标签已存在！'});
          return;
        }
      }
      const userId = this.userId;
      this.companyBasicService.findListByTypeAndUrl({companyName: this.rowkey, userId: userId, content: newLabel}, 'addCompanyCustomLabelUrl', 'post').subscribe(res => {
        console.log(res);
        if (res.responseCode === '_200') {
          this.labelLists.push(newLabel);
          this.toastModalService.showSuccessToast({tipsMsg: '添加标签成功！'});
          this.addLabelStatus = false;
          this.newLabel = '';
          this.getCompanyCustomLabel();
        }else {
          this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
        }
      })
    }
  }
  /*删除标签操作*/
  deleteLabel(option, template) {
    this.deleteLabelId = option;
    this.toastModalService.showModal(template)
  }
  /*确认删除标签操作*/
  confirmDeleteLabel() {
    const iabelID = this.deleteLabelId;
    const userId = this.userId;
    this.companyBasicService.findListByTypeAndUrl({iabelID: iabelID}, 'deleteCompanyCustomLabelUrl', 'delete').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        // this.labelLists.splice(index, 1);
        this.toastModalService.hideModal();
        this.toastModalService.showSuccessToast({tipsMsg: '删除标签成功！'});
        this.getCompanyCustomLabel();
      }else {
        this.toastModalService.hideModal();
        this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
      }
    })
  }
  /*取消删除标签操作*/
  declineDeleteLabel() {
    this.toastModalService.hideModal();
  }

}
