import { Component, OnInit } from '@angular/core';
import { CompanyBasicService } from '../company-basic.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';
import { ToastModalService } from "../../../../../shared/toast-modal/toast-modal.service";

@Component({
  selector: 'app-business-registration',
  templateUrl: './business-registration.component.html',
  styleUrls: ['./business-registration.component.css']
})
export class BusinessRegistrationComponent implements OnInit {

  companyDetail: any;
  constructor(
    private companyBasicService: CompanyBasicService,
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService,
    private toastModalService: ToastModalService,
  ) { }
  keyWord: any;
  CompanyDetailTips = '加载中...';
  changemailingAddress = '';
  changeepTelephone = '';
  changeAddressConfirmTips = '确定修改该公司通讯地址吗？';
  changeTelephoneConfirmTips = '确定修改该公司联系人电话吗？';
  ngOnInit() {

    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.getCompanyDetail();
  }

  /*获取工商信息*/
  getCompanyDetail() {

    this.companyBasicService.getCompanyDetail(this.keyWord).subscribe(res => {
      console.log('获取工商信息', res)
      if (res.responseCode === '_200') {
        if (!res.data) {
          this.CompanyDetailTips = '暂无信息！';
        }
        this.companyDetail = res.data;
        this.changemailingAddress = this.companyDetail.mailingAddress;
        this.changeepTelephone = this.companyDetail.epTelephone;
      }
    });
  }
  /*取消纠错操作*/
  cancelChangeInfo(option) {
    this[`change${option}`] = this.companyDetail[option];
  }
  /*提交修改通讯地址*/
  submitChangeAddress(template) {
    this.toastModalService.showModal(template)
  }
  /*提交修改联系人*/
  submitChangeTelephone(template) {
    this.toastModalService.showModal(template)
  }
  /*确认提交修改*/
  saveChangeInfo(type) {
    const changeType = type;
    this.toastModalService.hideModal();
    this.toastModalService.showSuccessToast({tipsMsg: '修改成功！'});
  }
  /*取消提交操作*/
  declineSaveChangeInfo() {
    this.toastModalService.hideModal();
  }

}
