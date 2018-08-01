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
  ngOnInit() {
    this.getLdapTreeData();
  }
  /*获取树结构*/
  getLdapTreeData() {
    this.mechanismManageService.getNodes().subscribe((res: any) => {
      console.log(res);
      this.files = <TreeNode[]> res.data;
    })
  }

}
