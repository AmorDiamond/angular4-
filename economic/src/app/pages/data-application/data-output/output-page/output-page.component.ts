import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../layout/layout.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { DataApplicationService } from '../../data-application.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-output-page',
  templateUrl: './output-page.component.html',
  styleUrls: ['./output-page.component.css']
})
export class OutputPageComponent implements OnInit {

  constructor(
    private dataApplicationService: DataApplicationService,
    private toastModalService: ToastModalService,
    private layoutService: LayoutService,
    private router: Router,
  ) { }
  dataList = [];
  accessControlSubject: Subscription;
  allSelectedStatus = false;
  companyList = [];
  ngOnInit() {
    this.companyList = this.dataApplicationService.getSelectedList();
    if (this.companyList.length) {
      this.getList();
    }else {
      this.router.navigate(['/dataApplication/dataOutput']);
    }
  }

  /*获取数据*/
  getList() {
    this.accessControlSubject = this.layoutService.getAccessControlSubject().subscribe(res => {
      const options = [
        {id: 1, name: '企业基本信息', children: [
            {id: 11, name: '企业概况', enumerate: 'BASEINFO'},
            {id: 14, name: '工商变更信息', enumerate: 'EPCHANGEINFO'},
            {id: 15, name: '税务登记信息', enumerate: 'EPTAXATION'},
            {id: 16, name: '社会保障信息', enumerate: 'INSURANCELNFORMATION'},
            {id: 17, name: '企业问题台账', enumerate: 'BUSINESSPROBLEMLEDGER'}
          ]},
        {id: 2, name: '企业资质信息', enumerate: 'EQICERTIFICATION'},
        {id: 3, name: '企业信用信息', children: [
            {id: 31, name: '企业荣誉', enumerate: 'ECIHONOR'},
            {id: 32, name: '黑名单', enumerate: 'ECIJUDICIALDECISION'},
            {id: 33, name: '履约缴费', enumerate: 'PERPAYMENTINFORMATION'},
            {id: 34, name: '行业评级', enumerate: 'INDUSTRYRATINGINFORMATION'},
          ]},
        {id: 4, name: '企业无形资产', children: [
            {id: 41, name: '企业商标和专利信息', enumerate: 'IATRADEMARKANDPATENT'},
            {id: 42, name: 'ICP备案信息', enumerate: 'IAICP'},
          ]},
        {id: 5, name: '企业经济指标', children: [
            {id: 51, name: '经济、人员、科技创新概况', enumerate: 'EIIAPASSETS'},
            {id: 52, name: '政府支持信息', enumerate: 'GOVERNMENTSUPPORT'},
            {id: 53, name: '招聘信息', enumerate: 'EIIRECRUIT'},
          ]},
        {id: 6, name: '企业综合评价', enumerate: ''},
      ];
      for (let i = 0; i < res.length; i++) {
        if (res[i].hasAccess) {
          for (let j = 0; j < options.length; j++) {
            if (options[j].children) {
              options[j].children.forEach(item => {
                if (item.name === res[i].text) {
                  item['hasAccess'] = true;
                  options[j]['hasAccess'] = true;
                }
              });
            }else if (options[j].name === res[i].text) {
              options[j]['hasAccess'] = true;
            }
          }
        }
      }
      this.dataList = options;
      console.log(this.dataList);
    });
  }
  /*单独选中后处理事件*/
  selectedHandle(index) {
    const children = this.dataList[index].children;
    if (children) {
      const len = children.length;
      let allSelectedGroup = true;
      for (let i = 0; i < len; i++) {
        if (!children[i].hasSelected) {
          allSelectedGroup = false;
        }
      }
      this.dataList[index].hasSelected = allSelectedGroup;
      /*判断所选项目数目*/
      this.countSelected();
      /*if (allSelectedGroup) {

        /!*判断是否全选*!/
        let allSelected = true;
        const dataLen = this.dataList.length;
        for (let i = 0; i < dataLen; i++) {
          if (!this.dataList[i].hasSelected) {
            allSelected = false;
            break;
          }
        }
        if (allSelected) {
          this.allSelectedStatus = true;
        }
      }else {
        this.allSelectedStatus = false;
      }*/
    }
  }
  /*全选获取的组别*/
  allSelectedGroup(index) {
    const children = this.dataList[index].children;
    if (children) {
      if (this.dataList[index].hasSelected) {
        children.forEach(res => {
          res.hasSelected = true;
        });
      }else {
        children.forEach(res => {
          res.hasSelected = false;
        });
      }
    }
    /*判断所选项目数目*/
    this.countSelected();
    /*判断是否全选*/
    /*let allSelected = true;
    const dataLen = this.dataList.length;
    for (let i = 0; i < dataLen; i++) {
      if (!this.dataList[i].hasSelected) {
        allSelected = false;
        break;
      }
    }
    this.allSelectedStatus = allSelected;*/
  }
  /*全选操作*/
  allSelected() {
    if (this.allSelectedStatus) {
      this.dataList.forEach(res => {
        res.hasSelected = true;
      });
      this.dataList.forEach((res, i) => {
        this.allSelectedGroup(i);
      });
    }else {
      this.dataList.forEach(res => {
        res.hasSelected = false;
      });
      this.dataList.forEach((res, i) => {
        this.allSelectedGroup(i);
      });
    }
  }
  /*导出数据*/
  downLoadDataFn() {
    const params = {moduleType: [], companyNames: []};
    // let params = '';
    this.dataList.forEach(res => {
      if (res.children) {
        res.children.forEach(childItem => {
          if (childItem.hasSelected) {
            // params += childItem.enumerate ? childItem.enumerate + ',' : '';
            params.moduleType.push(childItem.enumerate);
          }
        });
      }else if (res.hasSelected) {
        // params += res.enumerate ? res.enumerate + ',' : '';
        params.moduleType.push(res.enumerate);
      }
    });
    // const countSelected = params.split(',');
    if (params.moduleType.length > 5) {
      this.toastModalService.addToasts({tipsMsg: '所选项目超过5个！', type: 'warning', timeout: 2000});
      return;
    }
    this.companyList.forEach(item => {
      if (item.hasSelected) {
        params.companyNames.push(item.name);
      }
    });
    if (params.companyNames.length < 1) {
      this.toastModalService.addToasts({tipsMsg: '请选择需要导出数据的企业！', type: 'warning', timeout: 2000});
      return;
    }
    const todayTime = new Date();
    const todayDate = todayTime.getFullYear() + '-' + (todayTime.getMonth() + 1) + '-' + todayTime.getDate();
    console.log(params);
    this.dataApplicationService.exportZip(params, '系统数据导出' + todayDate, 'application/zip');
  }
  /*统计获取已选*/
  countSelected() {
    const list = [];
    this.dataList.forEach(res => {
      if (res.children) {
        res.children.forEach(childItem => {
          if (childItem.hasSelected) {
            list.push(childItem);
          }
        });
      }else if (res.hasSelected && res.enumerate) {
        list.push(res);
      }
    });
    if (list.length > 5) {
      this.toastModalService.addToasts({tipsMsg: '所选项目超过5个！', type: 'warning', timeout: 2000});
    }
  }
}
