import { Component, OnInit } from '@angular/core';
import { ContainerStyle } from '../../../../core/container-ngrx/container.model';
import { CHANGE } from '../../../../core/container-ngrx/container.action';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../../layout/layout.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { DataApplicationService } from '../../data-application.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<ContainerStyle>,
    private layoutService: LayoutService,
    private toastModalService: ToastModalService,
    private dataApplicationService: DataApplicationService,
  ) { }

  companyList: any = [];
  industryTypeList = [];
  selectedCompanyList = [];
  searchName: any;
  searchIndustryType: any;
  editContactStatus = false;
  editContactInfo = {name: '', phone: '', duties: ''};
  editContactId: any;
  editContactIndex: any;
  editContactRowKey: any;
  allSelectStatus = false;
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
        this.companyList = data.companys.length > 0 ? data.companys : [];
        /*组装联系人信息*/
        this.companyList.forEach(item => {
          console.log(item.relationPojos.length)
          if (item.relationPojos.length) {
            item.contacts = [];
            item.relationPojos.forEach(contact => {
              item.contacts.push({rowKey: contact.rowKey, name: contact.contactsName, phone: contact.contactInfo, duties: contact.duties});
            });
          }
          if (this.selectedCompanyList.length > 0) {
            /*判断获取的数据是否存在已选企业*/
            this.selectedCompanyList.forEach(selectItem => {
              if (selectItem.company.rowKey === item.company.rowKey) {
                item.hasSelected = true;
              }
            });
          }
        });
        if (this.selectedCompanyList.length > 0) {
          /*再次请求数据判断是否全选*/
          this.checkAllSelected();
        }
        console.log(this.companyList)
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
  /*添加和修改联系人*/
  editContact(id, listIndex, contactIndex?, contactId?) {
    this.editContactInfo.name = '';
    this.editContactInfo.phone = '';
    this.editContactInfo.duties = '';
    this.editContactIndex = '';
    this.editContactId = id;
    this.editContactStatus = true;
    if (contactId) {
      this.editContactRowKey = contactId;
      this.editContactIndex = contactIndex;
      this.editContactInfo.name = this.companyList[listIndex].contacts[contactIndex].name;
      this.editContactInfo.phone = this.companyList[listIndex].contacts[contactIndex].phone;
      this.editContactInfo.duties = this.companyList[listIndex].contacts[contactIndex].duties;
    }
  }
  /*提交修改和添加*/
  saveEditContact(id, listIndex, contactIndex?, contactId?) {
    if (this.editContactInfo.phone.length < 11) {
      this.toastModalService.addToasts({tipsMsg: '手机号不正确！', type: 'error'});
      return;
    }
    if (this.editContactRowKey) {
      /*修改联系人*/
      const oldName = this.companyList[listIndex].contacts[contactIndex].name;
      const oldPhone = this.companyList[listIndex].contacts[contactIndex].phone;
      const oldDuties = this.companyList[listIndex].contacts[contactIndex].duties;
      if (oldName === this.editContactInfo.name && oldPhone === this.editContactInfo.phone && oldDuties === this.editContactInfo.duties) {
        this.editContactId = '';
        this.editContactStatus = false;
        return;
      }
      const params = {dataId: this.editContactRowKey, name: this.editContactInfo.name, phone: this.editContactInfo.phone, duties: this.editContactInfo.duties};
      console.log(params)
      this.dataApplicationService.requestByParams(params, 'editContactPeopleUrl', 'post').subscribe(res => {
        console.log(res);
        if (res.responseCode === '_200') {
          this.companyList[listIndex].contacts[contactIndex].name = this.editContactInfo.name;
          this.companyList[listIndex].contacts[contactIndex].phone = this.editContactInfo.phone;
          this.companyList[listIndex].contacts[contactIndex].duties = this.editContactInfo.duties;
          this.toastModalService.addToasts({tipsMsg: '修改成功！', type: 'success'});
          this.editContactId = '';
          this.editContactRowKey = '';
          this.editContactStatus = false;
          // this.editContactInfo.name = '';
          // this.editContactInfo.phone = '';
          this.editContactIndex = '';
        }else {
          this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
        }
      });
    }else {
      /*新增联系人*/
      const params = {enterpriseName: this.editContactId, contactsName: this.editContactInfo.name, contactInfo: this.editContactInfo.phone, duties: this.editContactInfo.duties};
      this.dataApplicationService.requestByParams(params, 'addContactPeopleUrl', 'post', 'object').subscribe(res => {
        console.log(res);
        if (res.responseCode === '_200') {
          const data = res.data.phone;
          /*重新定义变量，避免直接将this.editContactInfo push到数组被新编辑数据修改掉*/
          const newContactInfo = {rowKey: '', name: '', phone: '', duties: ''};
          newContactInfo.rowKey = data.rowKey;
          newContactInfo.name = data.contactsName;
          newContactInfo.phone = data.contactInfo;
          newContactInfo.duties = data.duties;
          this.companyList[listIndex].contacts = this.companyList[listIndex].contacts && this.companyList[listIndex].contacts.length > 0 ? this.companyList[listIndex].contacts : [];
          this.companyList[listIndex].contacts.push(newContactInfo);
          this.toastModalService.addToasts({tipsMsg: '修改成功！', type: 'success'});
          this.editContactId = '';
          this.editContactStatus = false;
          // this.editContactInfo.name = '';
          // this.editContactInfo.phone = '';
          this.editContactIndex = '';
        }else {
          this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
          return;
        }
      });
    }
  }
  /*前往发送信息*/
  nextStep() {
    if (this.selectedCompanyList.length < 1) {
      this.toastModalService.addToasts({tipsMsg: '请选择企业！', type: 'warning'});
      return;
    }
    const len = this.selectedCompanyList.length;
    for (let i = 0; i < len; i++) {
      if (!this.selectedCompanyList[i].contacts || this.selectedCompanyList[i].contacts.length < 1) {
        this.toastModalService.addToasts({tipsMsg: '存在无联系人的企业！', type: 'warning'});
        return;
      }
    }
    this.dataApplicationService.changeSelectedList(this.selectedCompanyList);
    this.router.navigate(['/dataApplication/contactDetail']);
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
    this.companyList.forEach(item => {
      /*判断获取的数据是否存在需要处理为未选*/
      if (item.company.rowKey === removeCompany.company.rowKey) {
        item.hasSelected = false;
        this.allSelectStatus = false;
      }
    });
  }

}
