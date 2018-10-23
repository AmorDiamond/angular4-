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
  companyName: any;
  CompanyDetailTips = '加载中...';
  changeCompanyInfo = {mailingAddress: '', epTelephone: ''};
  changeAddressConfirmTips = '确定修改该公司通讯地址吗？';
  changeTelephoneConfirmTips = '确定修改该公司联系人电话吗？';
  changeTelephoneStatus = false;
  changeAddressStatus = false;
  dataId: any;

  changeInfoParams = {
    enterpriseName: '',
    pageSize: 15,
    lastRowKey: ''
  };
  CompanyChangeInfoTips = '加载中...';
  companyChangeList = [];
  ngOnInit() {

    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.changeInfoParams.enterpriseName = this.keyWord;
    this.getCompanyDetail();
    this.getCompanyChangeInfo();
  }

  /*获取工商信息*/
  getCompanyDetail() {

    this.companyBasicService.getCompanyProfile(this.keyWord).subscribe(res => {
      console.log('获取工商信息', res)
      if (res.responseCode === '_200') {
        const data = res.data.baseInfoPojos;
        if (!data) {
          this.CompanyDetailTips = '暂无信息！';
        }
        this.companyDetail = data;
      }
    });
  }

  /*获取工商变更信息*/
  getCompanyChangeInfo() {
    this.companyBasicService.findListByUrl(this.changeInfoParams, 'companyChangeInfoUrl').subscribe(res => {
      console.log('工商变更', res)
      if (res.responseCode === '_200') {
        if (res.data.epChangeInfo.length < 1) {
          this.CompanyChangeInfoTips = '暂无信息！';
        }
        const list = res.data.epChangeInfo;
        list.sort(this.compareFn('changeDate', 'asc'));
        this.companyChangeList = [...this.companyChangeList, ...list];
        this.changeInfoParams.lastRowKey = res.data.pagination.lastRowKey;
      }
    });
  }
  /*获取纠错初始数据*/
  getChangeInitInfo(rowKey, statusType) {
    let activeStatus;
    if (statusType === 'changeTelephoneStatus') {
      activeStatus = this.changeAddressStatus;
    }else if (statusType === 'changeAddressStatus') {
      activeStatus = this.changeTelephoneStatus;
    }
    if (activeStatus) {
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
      if (res.responseCode === '_200') {
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

  /*格式化排序*/
  compareFn(prop, type?) {
    return function (obj1, obj2) {
      let val1 = obj1[prop];
      let val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (type === 'asc') {
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      }else{
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      }
    };
  }

}
