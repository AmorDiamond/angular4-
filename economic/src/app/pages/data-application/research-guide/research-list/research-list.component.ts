import { Component, OnInit } from '@angular/core';
import { ContainerStyle } from '../../../../core/container-ngrx/container.model';
import { CHANGE } from '../../../../core/container-ngrx/container.action';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../../layout/layout.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { DataApplicationService } from '../../data-application.service';

@Component({
  selector: 'app-research-list',
  templateUrl: './research-list.component.html',
  styleUrls: ['./research-list.component.css']
})
export class ResearchListComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<ContainerStyle>,
    private layoutService: LayoutService,
    private toastModalService: ToastModalService,
  private dataApplicationService: DataApplicationService,
  ) { }

  companyList = [];
  industryTypeList = [];
  selectedCompanyList = [];
  searchName: any;
  searchIndustryType: any;
  editAddressStatus = false;
  editAddressInfo = '';
  editAddressId = '';
  findParams = {
    keyWord: '',
    industryType: '',
    page: 0,
    size: 15
  };
  pageParams = {
    maxSize: 5,
    itemsPerPage: this.findParams.size,
    bigTotalItems: 10,
    bigCurrentPage: 1,
    numPages: 0
  };
  allSelectStatus = false;
  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '93%'
      }
    });
    this.searchName = this.layoutService.getUrlParams('name');
    console.log(this.searchName)
    this.findParams.keyWord = this.searchName;
    this.getData();
  }
  /*获取数据*/
  getData() {
    this.companyList = [];
    const params = this.findParams;
    this.dataApplicationService.requestByParams(params, 'searchUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        const data = res.data;
        if (this.industryTypeList.length < 1) {
          for (const item in data.industryType) {
            if (item) {
              this.industryTypeList.push({industryType: item, number: data.industryType[item]});
            }
          }
        }
        if (data.companys) {
          this.companyList = data.companys;
        }
        if (this.selectedCompanyList.length > 0) {
          this.companyList.forEach(item => {
            /*判断获取的数据是否存在已选企业*/
            this.selectedCompanyList.forEach(selectItem => {
              if (selectItem.company.rowKey === item.company.rowKey) {
                item.hasSelected = true;
              }
            });
          });
          /*再次请求数据判断是否全选*/
          this.checkAllSelected();
        }
        this.pageParams.bigTotalItems = res.data.pageParam.total;
      }
    });
  }

  /*更改搜索的行业类型*/
  changeIndustryType(type?) {
    this.searchIndustryType = type ? type : '';
    this.findParams.industryType = this.searchIndustryType;
    this.getData();
  }
  /*翻页搜索*/
  pageChanged($event) {
    this.findParams.page = $event.page - 1;
    this.getData();
  }
  /*处理为已选择企业*/
  handleSelectedCompany(id, index) {
    const addCompany = this.companyList[index];
    /*处理为已选中*/
    if (addCompany.hasSelected) {
      this.selectedCompanyList.unshift(addCompany);

      if (this.selectedCompanyList.length > 10) {
        this.toastModalService.addToasts({tipsMsg: '超出当天行程支持的最大企业数量！', type: 'error', timeout: 3000});
      }
      this.checkAllSelected();
    }else {
      this.selectedCompanyList.forEach((res, i) => {
        if (res.company.rowKey === id) {
          this.selectedCompanyList.splice(i, 1);
        }
      });
      this.allSelectStatus = false;
    }
  }
  /*操作全选*/
  handleAllSelected() {
    let allSelected = false;
    this.companyList.forEach(res => {
      if (!res.hasSelected) {
        allSelected = true;
        return;
      }
    });
    console.log(allSelected);
    if (allSelected) {
      this.allSelectStatus = true;
      // this.selectedCompanyList = [];
      this.companyList.forEach(res => {
        if (!res.hasSelected) {
          res.hasSelected = true;
          this.selectedCompanyList.push(res);
        }
      });
      // this.selectedCompanyList = this.companyList;
      if (this.selectedCompanyList.length > 10) {
        this.toastModalService.addToasts({tipsMsg: '超出当天行程支持的最大企业数量！', type: 'error', timeout: 3000});
      }
    }else {
      this.allSelectStatus = false;
      // this.selectedCompanyList = [];
      this.companyList.forEach(res => {
        if (res.hasSelected) {
          res.hasSelected = false;
          /*剔除当页已选企业*/
          this.selectedCompanyList.forEach((selectItem, i) => {
            if (selectItem.company.rowKey === res.company.rowKey) {
              this.selectedCompanyList.splice(i, 1);
            }
          });
        }
      });
    }
  }
  /*判断当前页面数据是否全选*/
  checkAllSelected() {
    let allSelected = true;
    const len = this.companyList.length;
    for (let i = 0; i < len; i++) {
      if (!this.companyList[i].hasSelected) {
        allSelected = false;
        break;
      }
    }

    if (allSelected) {
      this.allSelectStatus = true;
    }else {
      this.allSelectStatus = false;
    }
  }
  /*修改和添加操作*/
  editAddress(id, index?) {
    this.editAddressInfo = '';
    this.editAddressId = id;
    this.editAddressStatus = true;
    if (this.companyList[index]) {
      this.editAddressInfo = this.companyList[index].company.address;
    }
  }
  /*保存修改信息*/
  saveAddress(index?) {
    this.editAddressInfo = this.editAddressInfo.trim();
    if (!this.editAddressInfo) {
      this.editAddressId = '';
      this.editAddressStatus = false;
      this.editAddressInfo = '';
      return;
    }
    if (this.editAddressInfo === this.companyList[index].company.address) {
      this.editAddressId = '';
      this.editAddressStatus = false;
      this.editAddressInfo = '';
      return;
    }
    const params = {rowKey: this.editAddressId, newAddress: this.editAddressInfo};
    this.dataApplicationService.requestByParams(params, 'editAddressUrl', 'post').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.companyList[index].company.address = this.editAddressInfo;
        this.toastModalService.addToasts({tipsMsg: '修改成功！', type: 'success'});
        this.editAddressId = '';
        this.editAddressStatus = false;
        this.editAddressInfo = '';
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*前往下载信息*/
  nextStep() {
    if (this.selectedCompanyList.length < 1) {
      this.toastModalService.addToasts({tipsMsg: '请选择企业！', type: 'warning'});
      return;
    }else if (this.selectedCompanyList.length > 10) {
      this.toastModalService.addToasts({tipsMsg: '超出当天行程支持的最大企业数量！', type: 'error', timeout: 3000});
      return;
    }
    const len = this.selectedCompanyList.length;
    for (let i = 0; i < len; i++) {
      if (!this.selectedCompanyList[i].company.address) {
        this.toastModalService.addToasts({tipsMsg: '存在无通讯地址的企业！', type: 'warning'});
        return;
      }
    }
    this.dataApplicationService.changeSelectedList(this.selectedCompanyList);
    this.router.navigate(['/dataApplication/researchDetail']);
  }
  /*清空所选列表*/
  removeAllSelected() {
    this.selectedCompanyList = [];
    this.allSelectStatus = false;
    this.companyList.forEach(item => {
        item.hasSelected = false;
      });
  }
  /*删除指定的已选择*/
  removeSingleSelected(index) {
    const removeCompany = this.selectedCompanyList.splice(index, 1)[0];
    console.log(index, removeCompany)
    this.companyList.forEach(item => {
      /*判断获取的数据是否存在需要处理为未选*/
      if (item.company.rowKey === removeCompany.company.rowKey) {
        item.hasSelected = false;
        this.allSelectStatus = false;
      }
    });
  }

}
