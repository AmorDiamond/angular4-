import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { RegisterCategoryService } from '../register-category.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-industry-category',
  templateUrl: './industry-category.component.html',
  styleUrls: ['./industry-category.component.css']
})
export class IndustryCategoryComponent implements OnInit {

  constructor(
    private registerCategoryService: RegisterCategoryService,
    private toastModalService: ToastModalService,
  ) { }
  files: TreeNode[];
  // files: any;
  selectedFile: any;
  ngOnInit() {
    this.getLdapTreeData();
  }
  /*获取树结构*/
  getLdapTreeData(id?) {
    const params = {id: id ? id : 'industrial'};
    this.registerCategoryService.getNodes(params, 'ldapTreeUrl').subscribe((res: any) => {
      console.log(res);
      // if (res.responseCode === '_200') {
        const treeFormatData = [];
        const treeData = res;
        treeData.forEach(item => {
          const hasChildren = item.children ? item.children : false;
          treeFormatData.push(
            {
              'label': item.text + '(' + item.number + ')',
              'data': item.id,
              // 'formatparent': item.data ? item.data : '',
              'expandedIcon': 'fa fa-folder-open',
              'collapsedIcon': 'fa fa-folder',
              'leaf': !hasChildren // leaf为false时有下级加载
            }
          );
        });
        this.files = <TreeNode[]> treeFormatData;
      // }else {
      //   this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      // }
    });
  }
  /*获取数据组装*/
  loadNode(event) {
    if (event.node && !event.node.children) {
      // in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
      console.log(event.node);
      const id = event.node.data;
      const parent = event.node.formatparent;
      const params = {id: id ? id : 'industrial'};
      this.registerCategoryService.getNodes(params, 'ldapTreeUrl').subscribe((res: any) => {
        console.log(res);
        // if (res.responseCode === '_200') {
          const treeFormatData = [];
          const treeData = res;
          treeData.forEach(item => {
            const hasChildren = item.children ? item.children : false;
            treeFormatData.push(
              {
                'label': item.text + '(' + item.number + ')',
                'data': item.id,
                // 'formatparent': item.data ? item.data : '',
                'expandedIcon': 'fa fa-folder-open',
                'collapsedIcon': 'fa fa-folder',
                'leaf': !hasChildren // leaf为false时有下级加载
              }
            );
          });
          event.node.children = treeFormatData;
        // }else {
        //   this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
        // }
      });
    }
  }

}
