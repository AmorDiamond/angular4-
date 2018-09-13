import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { IndustryManagersService } from '../industry-managers.service';

@Component({
  selector: 'app-edit-industry',
  templateUrl: './edit-industry.component.html',
  styleUrls: ['./edit-industry.component.css']
})
export class EditIndustryComponent implements OnInit {

  constructor(
    private route: Router,
    private routeInfo: ActivatedRoute,
    private toastModalService: ToastModalService,
    private industryManagersService: IndustryManagersService,
  ) { }
  nowLocation = '修改信息';
  industryTypeList: any;
  hasIndustryTypeList: any;
  companyName: any;
  ngOnInit() {
    /*const options = [
      {id: 1, company: '测试', industry: ['产业类型', '产业类型']},
      {id: 2, company: '测试1', industry: ['产业类型1', '产业类型']},
      {id: 3, company: '测试2', industry: ['产业类型3', '产业类型']},
      {id: 4, company: '测试3', industry: ['产业类型4', '产业类型']},
    ]
    this.list = options;*/
    this.routeInfo.params.subscribe((params: ParamMap) => {
      console.log(params['name']);
      this.companyName = params['name'];
      this.getData();
    });
  }
  /*获取所有产业类型和当前企业所属类型*/
  getData() {
    const requestParams = [
      {findParams: {}, http: 'getIndustryType'},
      {findParams: {companyName: this.companyName}, http: 'getCompanyIndustryType'}
      ];
    this.industryManagersService.getRequestByForkJoin(requestParams).subscribe(result => {
      console.log(result)
      if (result[0].responseCode === '_200' && result[1].responseCode === '_200') {
        const allIndustryType = result[0].data;
        const hasIndustryType = result[1].data.industryClassType ? result[1].data.industryClassType : [];
        this.hasIndustryTypeList = hasIndustryType;
        for (let i = 0; i < hasIndustryType.length; i++) {
          const hasIndustryTypeId = hasIndustryType[i].id;
          for (let j = 0; j < allIndustryType.length; j++) {
            if (allIndustryType[j].id === hasIndustryTypeId) {
              allIndustryType[j].hasChecked = true;
              break;
            }
          }
        }
        this.industryTypeList = allIndustryType;
      }else {
        this.toastModalService.addToasts({tipsMsg: result[0].errorMsg + '---' + result[1].errorMsg, type: 'error'});
      }
    });
  }
  /*提交修改*/
  saveChange() {
    /*const addList = [];
    const removeList = [];
    this.industryTypeList.forEach(item => {
      let needAdd = true;
      this.hasIndustryTypeList.forEach(hasItem => {
        if (item.hasChecked) {
          /!*判断选择的类型是否不存在已拥有的数据里*!/
          if (item.id === hasItem.id) {
            needAdd = false;
          }
        }else {
          /!*判断未选择的类型是否已存在已拥有的数据里*!/
          if (item.id === hasItem.id) {
            removeList.push(item);
          }
        }
      });
      if (item.hasChecked && needAdd) {
        addList.push(item);
      }
    });
    console.log(addList, removeList);*/
    const selectIndustryList = [];
    this.industryTypeList.forEach(item => {
      if (item.hasChecked) {
        selectIndustryList.push(item.id);
      }
    });
    console.log(selectIndustryList)
    const params = {companyName: this.companyName, typeIds: selectIndustryList};
    this.industryManagersService.requestByParams(params, 'editCompanyIndustryType', 'patch').subscribe(res => {
      if (res.responseCode === '_200') {
        this.toastModalService.addToasts({tipsMsg: '修改成功！', type: 'success', router: 'admin/industryManage/list'});
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }

}
