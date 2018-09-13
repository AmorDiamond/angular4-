import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { RegisterCategoryService } from '../register-category.service';

@Component({
    selector: 'app-register-category',
    templateUrl: './register-category.component.html',
    styleUrls: ['./register-category.component.css']
})
export class RegisterCategoryComponent implements OnInit {

    constructor(private RegisterCategoryService: RegisterCategoryService) {
    }

    files: TreeNode[];
    selectedFile: any;

    ngOnInit() {
        this.getLdapTreeData();
    }

    /*获取树结构*/
    getLdapTreeData(id?, parent?) {
        const params = {id: id ? id : 'registration'};
        this.RegisterCategoryService.getNodes(params, 'ldapTreeUrl').subscribe((res: any) => {
            console.log(res);
            const treeFormatData = [];
            const treeData = res;
            treeData.forEach(item => {
              const hasChildren = item.children ? item.children : false;
                treeFormatData.push(
                    {
                      'label': item.text,
                      'data': item.id,
                      // "formatparent": item.data ? item.data : '',
                      'expandedIcon': 'fa fa-folder-open',
                      'collapsedIcon': 'fa fa-folder',
                      'leaf': !hasChildren // leaf为false时有下级加载
                    }
                );
            });
            this.files = <TreeNode[]> treeFormatData;
            // this.files = res.data;
        });
    }

    /*获取数据组装*/
    loadNode(event) {
        if (event.node) {
            // in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
            console.log(event.node);
            const id = event.node.data;
            const parent = event.node.formatparent;
            const params = {id: id ? id : 'registration'};
            this.RegisterCategoryService.getNodes(params, 'ldapTreeUrl').subscribe((res: any) => {
                console.log(res);
                const treeFormatData = [];
                const treeData = res;
                treeData.forEach(item => {
                  const hasChildren = item.children ? item.children : false;
                    treeFormatData.push(
                      {
                        'label': item.text,
                        'data': item.id,
                        // "formatparent": item.data ? item.data : '',
                        'expandedIcon': 'fa fa-folder-open',
                        'collapsedIcon': 'fa fa-folder',
                        'leaf': !hasChildren // leaf为false时有下级加载
                      }
                    );
                });
                event.node.children = treeFormatData;
                // this.files = res.data;
            });
        }
    }

}