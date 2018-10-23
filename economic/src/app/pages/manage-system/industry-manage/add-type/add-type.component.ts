import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IndustryManagersService } from '../industry-managers.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})
export class AddTypeComponent implements OnInit {

  constructor(
    private route: Router,
    private toastModalService: ToastModalService,
    private industryManagersService: IndustryManagersService
  ) { }
  nowLocation = '添加产业类型';
  typeName = '';
  nodes = [];
  selectedIndustryTypeFile: any;
  selectedIndustryTypeIds = [];
  @ViewChild('nzTree') nzTree;
  ngOnInit() {
    this.getLdapTreeData();
  }
  /*获取树结构*/
  getLdapTreeData(id?, parent?) {
    const params = {id: id ? id : 'industry'};
    this.industryManagersService.requestByParams(params, 'ldapTreeUrl').subscribe((res: any) => {
      console.log(res);
      const treeFormatData = [];
      const treeData = res;
      treeData.forEach(item => {
        const hasChildren = item.children ? item.children : false;
        console.log(item.text)
        treeFormatData.push(
          new NzTreeNode({
            title   : item.text + '（' + item.number + '）',
            key     : item.id,
            selectable: item.text === '行业分类' ? false : true,
            disableCheckbox: item.text === '行业分类' ? true : false,
            isLeaf  : !hasChildren,
            children: []
          })
        );
      });
      this.nodes = treeFormatData;
    });
  }

  mouseAction(name: string, e: NzFormatEmitEvent): void {
    if (name === 'expand') {
      if (e.node.getChildren().length === 0 && e.node.isExpanded) {

        const id = e.node.key;
        const params = {id: id ? id : 'industry'};
        this.industryManagersService.requestByParams(params, 'ldapTreeUrl').subscribe((res: any) => {
          console.log(res);
          const treeFormatData = [];
          const treeData = res;
          treeData.forEach(item => {
            const hasChildren = item.children ? item.children : false;
            treeFormatData.push(
              {
                title : item.text + '（' + item.number + '）',
                key   : item.id,
                selectable: false,
                isLeaf: !hasChildren
              }
            );
          });
          e.node.addChildren(treeFormatData);
        });
      }
    }
  }
  /*提交新增类型*/
  submitAdd() {
    const typeName = this.typeName.trim();
    const industryTypeId = [];
    const selectedTypeNodeList = this.nzTree.getCheckedNodeList();
    if (selectedTypeNodeList.length > 0) {
      selectedTypeNodeList.forEach(item => {
        industryTypeId.push(item.key);
      });
    }
    console.log(industryTypeId)
    if (!typeName) {
      this.toastModalService.addToasts({tipsMsg: '产业名称不能为空！', type: 'error'});
      return;
    }
    if (industryTypeId.length < 1) {
      this.toastModalService.addToasts({tipsMsg: '请选择所属产业类型！', type: 'error'});
      return;
    }
    const params = {name: typeName, industryTypeIds: industryTypeId};
    this.industryManagersService.requestByParams(params, 'addIndustryTypeUrl', 'patch').subscribe(res => {
      if (res.responseCode === '_200') {
        this.toastModalService.addToasts({tipsMsg: '新增产业成功！', type: 'success', router: '/admin/industryManage'});
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }

}
