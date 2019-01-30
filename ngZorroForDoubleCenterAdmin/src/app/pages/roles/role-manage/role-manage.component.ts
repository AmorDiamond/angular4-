import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RolesService } from '../roles.service';
import { NzMessageService } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.component.html',
  styleUrls: ['./role-manage.component.css']
})
export class RoleManageComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private routerInfo: ActivatedRoute,
    private router: Router,
    private rolesService: RolesService,
    private message: NzMessageService
  ) { }
  roleId: any;
  roleInfo = {
    name: '',
    comment: ''
  };
  roleHasCompetence = [];
  allCompetence = [];
  editRole = true;
  location = '修改角色';

  checkOptions = {};
  groups = [];
  newCheckArr = [];
  removeCheckArr = [];
  isLoading = false;

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [ this.roleInfo.name, [ Validators.required ] ],
      comment: [ this.roleInfo.comment, [ Validators.required ] ]
    });
    this.routerInfo.params.subscribe(res => {
      if (res.id !== '-1') {
        this.roleId = res.id;
        this.getInfo();
        this.getHasAndAll();
      } else {
        this.editRole = false;
        this.location = '新增角色';
        this.getAllCompetence();
      }
    });
  }
  getInfo () {
    const parmas = {roleId: this.roleId};
    this.rolesService.requestByParams(parmas, 'roleBaseInfoUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        this.roleInfo = res.data;
        this.validateForm.get('name').setValue(this.roleInfo.name);
        this.validateForm.get('comment').setValue(this.roleInfo.comment);
      } else {
        this.message.error(res.errorMsg);
      }
    });
  }
  getHasCompetence () {
    const parmas = {roleId: this.roleId};
    this.rolesService.requestByParams(parmas, 'roleHasCompetenceUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        this.roleHasCompetence = res.data;
      } else {
        this.message.error(res.errorMsg);
      }
    });
  }
  getAllCompetence () {
    const parmas = {roleId: this.roleId};
    this.rolesService.requestByParams(parmas, 'allCompetence').subscribe(res => {
      if (res.responseCode === '_200') {
        // 储存经过处理是否被选中的所有权限数据
        this.allCompetence = res.data.map(item => {
          // 处理数据为插件所需格式
          item.label = item.comment + ' ' + item.resource;
          item.value = item.id;
          item.checked = false;
          return item;
        });
        // 对功能数据进行分组显示
        this.getGroups();
      } else {
        this.message.error(res.errorMsg);
      }
    });
  }
  getHasAndAll () {
    const parmas = {roleId: this.roleId};
    const list = [
      {findParams: parmas, url: 'roleHasCompetenceUrl'},
      {findParams: parmas, url: 'allCompetence'}
    ];
    this.rolesService.getRequestByForkJoin(list).subscribe(res => {
      console.log(res)
      this.roleHasCompetence = res[0].data;
      this.allCompetence = res[1].data;
      const hasLength = this.roleHasCompetence.length;
      // 储存经过处理是否被选中的所有权限数据
      this.allCompetence.forEach(item => {
          // 处理数据为插件所需格式
          item.label = item.comment + ' ' + item.resource;
          item.value = item.id;
          item.checked = false;
        this.roleHasCompetence.forEach(hasItem => {
          if (hasItem.id === item.id) {
            item.checked = true;
          }
        });
      });
      this.getGroups();
    });
  }

  // 对获取的功能进行分组
  getGroups() {
    const cache = {};
    this.groups = [];
    const groupObj = {};
    this.checkOptions = {};
    this.allCompetence.forEach((item, index) => {
      /*分别处理前端和后端接口*/
      const group = item.resource.indexOf('manager/') > -1 ? 'manager/' + (item.resource.split('/'))[3] : (item.resource.split('/'))[2];
      if (!cache[group]) {
        groupObj[group] = {name: group, hasChecked: true, show: false};
        cache[group] = 1;
        this.groups.push(groupObj[group]);
      }
      if (cache[group] && !item.checked) {
        groupObj[group].hasChecked = false;
      }
      // 子checkbox有一个是checked设置为半选中状态
      if (cache[group] && item.checked) {
        groupObj[group].indeterminate = true;
      }
      /*将所有功能分类存放*/
      if (!this.checkOptions[group]) {
        this.checkOptions[group] = [];
      }
      this.checkOptions[group].push(item);
    });
  }

  // 全选和取消全选
  updateAllChecked(resource, flag) {
    this.allCompetence.forEach((item, index) => {
      /*分别处理前端和后端接口*/
      const group = item.resource.indexOf('manager/') > -1 ? 'manager/' + (item.resource.split('/'))[3] : (item.resource.split('/'))[2];
      if (group === resource) {
        item.checked = flag;
      }
    });
    this.groups.forEach(item => {
      if (item.name === resource && item.indeterminate) {
        // 控制check group组件半选中样式
        item.indeterminate = false;
      }
    });
  }
  // 单击某个功能时
  updateSingleChecked(event) {
    if (!event.length) {
      return;
    }
    // 获取功能所属的分组名
    const resource = event[0].resource.split('/')[2];
    // 分组下的所有功能
    const groupsChild = event;
    // 判断所属group是否全选
    const unGroupChecked = groupsChild.some(childItem => !childItem.checked); // 有一个为false就不是全选中，否则为全选
    // 判断所属group是否半选中
    const groupIndeterminate = groupsChild.some(item => item.checked)
    this.groups.forEach(item => {
      if (item.name === resource) {
        if (groupIndeterminate) { // 控制check group组件半选中样式
          item.indeterminate = true;
        } else {
          item.indeterminate = false;
        }
        if (!unGroupChecked) { // 控制check group组件全选中样式
          item.indeterminate = false;
          item.hasChecked = true;
        } else {
          item.hasChecked = false;
        }
      }
    });
    /*分别处理前端和后端接口*/
    // const resource = resources.indexOf('manager/') > -1 ? 'manager/' + (resources.split('/'))[3] : (resources.split('/'))[2];
    const groupLen = this.groups.length;
    // 初始化分组的组长（暂时这样么称呼）hasChecked为true，然后遍历所有功能，
    // 分组下的某一个的hasChecked为false时，组长的hasChecked置为false
    /*for (let i = 0; i < groupLen; i++) {
      if ( this.groups[i].name === resource) {
        this.groups[i].hasChecked = true;
        break;
      }
    }
    this.allCompetence.forEach((item, index) => {
      /!*分别处理前端和后端接口*!/
      const group = item.resource.indexOf('manager/') > -1 ? 'manager/' + (item.resource.split('/'))[3] : (item.resource.split('/'))[2];
      if (group === resource && item.checked === false) {
        for (let i = 0; i < groupLen; i++) {
          if ( this.groups[i].name === resource) {
            this.groups[i].hasChecked = false;
            break;
          }
        }
      }
      if (group === resource && item.checked === true) {
        for (let i = 0; i < groupLen; i++) {
          if ( this.groups[i].name === resource) {
            this.groups[i].indeterminate = true;
            break;
          }
        }
      }
    });*/
  }
  submitForm(): void {
    let canSubmit = true;
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls[i].status !== 'VALID') { // 如果存在未通过验证的不能提交
        canSubmit = false;
      }
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    const name = this.validateForm.controls['name'].value;
    const comment = this.validateForm.controls['comment'].value;
    if (canSubmit) {
      this.isLoading = true;
      const newCheckArr = [];
      const removeCheckArr = [];
      this.allCompetence.forEach(item => {
        if (this.roleHasCompetence.length > 0) {
          this.roleHasCompetence.forEach(hasItem => {
            // 保存被移除功能id
            if (item.id === hasItem.id && !item.checked) {
              removeCheckArr.push(item.id);
            }
            // 保存新添加功能id
            if (item.id !== hasItem.id && item.checked) {
              newCheckArr.push(item.id);
            }
          });
        } else if (item.checked) {
          newCheckArr.push(item.id);
        }
      });
      this.newCheckArr = newCheckArr;
      this.removeCheckArr = removeCheckArr;
      if (this.roleInfo.name !== name || this.roleInfo.comment !== comment) { // 判断是否role基本信息有更新
        if (newCheckArr.length || removeCheckArr.length) { // 判断是否有权限绑定或解绑
          this.handleRoleInfo(name, comment, this.handleCompetencesForRole);
        } else {
          this.handleRoleInfo(name, comment);
        }
      } else if (newCheckArr.length || removeCheckArr.length) {
        this.handleCompetencesForRole();
      }
    }
  }
  // 添加/修改角色信息
  handleRoleInfo (name, comment, callback?) {
    console.log(name, comment)
    let requestType = 'post';
    let id = '';
    let serviceRequestFn = 'requestByParams';
    if (this.roleId) { // 判断修改
      requestType = 'patch';
      id = this.roleId;
      serviceRequestFn = 'editRoleInfo';
    }
    const params = {
      'comment': comment,
      'id': id,
      'name': name
    };
    this.rolesService[serviceRequestFn](params, 'addRoleUrl', requestType, 'object').subscribe(res => {
      if (res.responseCode === '_200') {
        if (callback) {
          if (!this.roleId) {
            this.roleId = res.data.id;
          }
          callback.call(this);
        } else {
          this.isLoading = false;
          this.message.success('操作成功!');
          setTimeout(() => {
            this.router.navigate(['/roles/roleList']);
          }, 500);
        }
      } else {
        this.message.success(res.errorMsg);
      }
    });
  }
  // 修改角色信息
  editRoleInfo (name, comment, callback?) {
    console.log(name, comment)
    const requestType = 'patch';
    const id = this.roleId;
    const params = {
      'comment': comment,
      'id': id,
      'name': name
    };
    this.rolesService.requestByParams(params, 'addRoleUrl', requestType).subscribe(res => {
      if (res.responseCode === '_200') {
        if (callback) {
          callback();
        } else {
          this.message.success('修改成功!');
        }
      } else {
        this.message.success(res.errorMsg);
      }
    });
  }
  // 绑定和解绑角色权限
  handleCompetencesForRole () {
    const bindParams = {
      'roleId': this.roleId,
      'competenceIds': this.newCheckArr
    };
    const unbindParams = {
      'roleId': this.roleId,
      'competenceIds': this.removeCheckArr
    };
    const list = [];
    if (this.newCheckArr.length) {
      list.push({params: bindParams, url: 'bindCompetencesUrl'});
    }
    if (this.removeCheckArr.length) {
      list.push({params: unbindParams, url: 'unbindCompetencesUrl'});
    }
    this.rolesService.postRequestByForkJoin(list).subscribe(res => {
      console.log(res)
      // const errorStatus = res.some(item => item.responseCode !== '_200');
      const errorList = res.filter(item => item.responseCode !== '_200');
      if (errorList.length) {
        errorList.forEach(item => {
          this.message.error(item.errorMsg);
        });
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.message.success('操作成功!');
        setTimeout(() => {
          this.router.navigate(['/roles/roleList']);
        }, 500);
      }
    });
  }
  back () {
    history.back();
  }

  /*updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne.forEach(item => item.checked = true);
    } else {
      this.checkOptionsOne.forEach(item => item.checked = false);
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }*/

}
