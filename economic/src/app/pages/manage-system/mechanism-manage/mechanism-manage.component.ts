import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { MechanismManageService } from "./mechanism-manage.service";

@Component({
  selector: 'app-mechanism-manage',
  templateUrl: './mechanism-manage.component.html',
  styleUrls: ['./mechanism-manage.component.css'],
  providers: [MechanismManageService]
})
export class MechanismManageComponent implements OnInit {

  constructor(
    private mechanismManageService: MechanismManageService
  ) { }
  files: TreeNode[];
  // files: any;
  selectedFile: any;
  ngOnInit() {
    this.getLdapTreeData();
  }
  /*获取树结构*/
  getLdapTreeData(id?, parent?) {
    const params = {id: id ? id : '#', parent: parent ? parent : ''};
    this.mechanismManageService.getNodes(params).subscribe((res: any) => {
      console.log(res);
      const treeFormatData = [];
      const treeData = res;
      treeData.forEach(item => {
        treeFormatData.push(
          {
            "label": item.text,
            "data": item.id,
            "formatparent": item.data ? item.data : '',
            "expandedIcon": "fa fa-folder-open",
            "collapsedIcon": "fa fa-folder",
            "leaf": false
          }
        )
      });
      this.files = <TreeNode[]> treeFormatData;
      // this.files = res.data;
    })
  }
  /*获取数据组装*/
  loadNode(event) {
    if(event.node) {
      //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
      console.log(event.node);
      const id = event.node.data;
      const parent = event.node.formatparent;
      const params = {id: id ? id : '#', parent: parent ? parent : ''};
      this.mechanismManageService.getNodes(params).subscribe((res: any) => {
        console.log(res);
        const treeFormatData = [];
        const treeData = res;
        treeData.forEach(item => {
          treeFormatData.push(
            {
              "label": item.text,
              "data": item.id,
              "formatparent": item.data ? item.data : '',
              "expandedIcon": "fa fa-folder-open",
              "collapsedIcon": "fa fa-folder",
              "leaf": false
            }
          )
        });
        event.node.children = treeFormatData;
        // this.files = res.data;
      })
    }
  }

}
