import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { IndustryManagersService } from '../industry-managers.service';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';

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
  nowLocation = '修改产业信息';
  typeName = '';
  nodes = [];
  typeId = '';
  selectedIndustryTypeFile: any;
  checkedKeys = [];
  @ViewChild('nzTree') nzTree;
  ngOnInit() {
    /*const options = [
      {id: 1, company: '测试', industry: ['产业类型', '产业类型']},
      {id: 2, company: '测试1', industry: ['产业类型1', '产业类型']},
      {id: 3, company: '测试2', industry: ['产业类型3', '产业类型']},
      {id: 4, company: '测试3', industry: ['产业类型4', '产业类型']},
    ]
    this.list = options;*/
    this.routeInfo.params.subscribe((params: ParamMap) => {
      console.log(params['id']);
      this.typeId = params['id'];
      this.getLdapTreeData();
      this.getInfoData();
    });
  }
  /*获取当前产业类型信息*/
  getInfoData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryManagersService.requestByParams(params, 'getIndustryTypeInfoUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        this.typeName = res.data.name;
        const includingIndustry = res.data.includingIndustry;
        if (includingIndustry && includingIndustry.length > 0) {
          const formatData = [];
          includingIndustry.forEach(item => {
            formatData.push(item.id);
          })
          this.checkedKeys = formatData;
        }
      }
    });
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
            const hasSelected = this.checkedKeys.includes(item.id);
            treeFormatData.push(
              {
                title : item.text + '（' + item.number + '）',
                key   : item.id,
                checked: hasSelected,
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
  /*提交修改*/
  saveChange() {
    const typeId = this.typeId;
    const industryTypeId = [];
    const selectedTypeNodeList = this.nzTree.getCheckedNodeList();
    if (selectedTypeNodeList.length > 0) {
      selectedTypeNodeList.forEach(item => {
        industryTypeId.push(item.key);
      });
    }
    if (!typeId) {
      this.toastModalService.addToasts({tipsMsg: '产业名称不能为空！', type: 'error'});
      return;
    }
    if (industryTypeId.length < 1) {
      this.toastModalService.addToasts({tipsMsg: '请选择所属产业类型！', type: 'error'});
      return;
    }
    const params = {industryClassTypeId: typeId, industryTypeIds: industryTypeId};
    this.industryManagersService.requestByParams(params, 'editIndustryTypeUrl', 'patch').subscribe(res => {
      if (res.responseCode === '_200') {
        this.toastModalService.addToasts({tipsMsg: '修改产业成功！', type: 'success', router: '/admin/industryManage'});
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }

}
