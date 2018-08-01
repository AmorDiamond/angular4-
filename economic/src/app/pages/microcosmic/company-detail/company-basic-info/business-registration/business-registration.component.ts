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
  changeCompanyInfo = {mailingAddress: '', epTelephone: ''};
  changeAddressConfirmTips = '确定修改该公司通讯地址吗？';
  changeTelephoneConfirmTips = '确定修改该公司联系人电话吗？';
  changeTelephoneStatus = false;
  changeAddressStatus = false;
  dataId: any;
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
      }
    });
  }
  /*获取纠错初始数据*/
  getChangeInitInfo(rowKey, statusType) {
    let activeStatus;
    if(statusType === 'changeTelephoneStatus') {
      activeStatus = this.changeAddressStatus;
    }else if(statusType === 'changeAddressStatus') {
      activeStatus = this.changeTelephoneStatus;
    }
    if(activeStatus) {
      this.toastModalService.addToasts({tipsMsg: '请先提交之前的数据！', type: 'info'});
      return;
    }
    this[statusType] = true;
    this.dataId = rowKey;
    this.changeCompanyInfo.mailingAddress = this.companyDetail.mailingAddress;
    this.changeCompanyInfo.epTelephone = this.companyDetail.epTelephone;
  }
  /*取消纠错操作*/
  cancelChangeInfo(statusType) {
    this[statusType] = false;
    this.changeCompanyInfo.mailingAddress = '';
    this.changeCompanyInfo.epTelephone = '';
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
    this.toastModalService.hideModal();
    const changeType = type;
    const changeParams = {
      dataId: this.dataId,
      epTelephone: this.changeCompanyInfo.epTelephone,
      mailingAddress: this.changeCompanyInfo.mailingAddress,
    };
    if(changeParams.epTelephone === this.companyDetail.epTelephone && changeParams.mailingAddress === this.companyDetail.mailingAddress) {
      this.toastModalService.addToasts({tipsMsg: '无数据更新！', type: 'warning'});
      return;
    }
    this.companyBasicService.findListHasNullByUrl(changeParams, 'changeAdressAndContactUrl').subscribe(res => {
      console.log('提交修改', res)
      if(res.responseCode === '_200') {
        this.toastModalService.addToasts({tipsMsg: '修改成功！', type: 'success'});
        this.changeTelephoneStatus = false;
        this.changeAddressStatus = false;
        this.getCompanyDetail();
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }
  /*取消提交操作*/
  declineSaveChangeInfo() {
    this.toastModalService.hideModal();
  }

}
