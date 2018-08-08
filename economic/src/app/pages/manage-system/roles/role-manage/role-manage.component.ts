import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.component.html',
  styleUrls: ['./role-manage.component.css']
})
export class RoleManageComponent implements OnInit {
  roleId: string;
  roleName: string;
  roleDesc: string;
  allCompetences: any;
  groups: any;
  allCompetencesObj = {};
  nowLocation = '添加角色';
  // 角色绑定的功能列表。（修改之前）
  beforeModify = {};
  roleCompetencesBind = {competenceIds: []};
  roleCompetencesUnbind = {competenceIds: []};
  addUserRoleParams = {url: '/v1/roles', method: 'post'};
  getUserRoleParams = {url: '/v1/roles/getById', method: 'get'};
  getAllRoleParams = {url: '/v1/competence/findAllNormal', method: 'get'};
  bindCompetenceParams = {url: '/v1/roles/bindRoleForCompetences', method: 'post'};
  unbindCompetenceParams = {url: '/v1/roles/unbindRoleForCompetences', method: 'post'};
  findHasCompetenceParams = {url: '/v1/competence/findByRoleId', method: 'get'};
  editRoleBasicParams = {url: '/v1/roles/', method: 'PATCH'};
  constructor(private http: HttpClient, private routeInfo: ActivatedRoute, private router: Router,
              private toastModalService: ToastModalService) { }

  ngOnInit() {
    this.routeInfo.params.subscribe((params: ParamMap) => {
      if (params['id'] !== '-1') {
        this.getUserDetail(params['id']);
        this.nowLocation = '修改角色';
      }else {
        this.getAllRoles();
      }
    });
  }

  onSubmit() {
    const _that = this;
    /*新增*/
    if (!_that.roleId) {
      const url = this.addUserRoleParams.url;
      this.http.post(url, {
        'comment': this.roleDesc,
        'createDate': '',
        'id': '',
        'modifyDate': '',
        'name': this.roleName,
        'status': null
      }).subscribe((res: any) => {
        if (res.responseCode === '_200') {
            const roleCompetenceIds = [];
            _that.roleId = res.data.id;
            _that.allCompetences.forEach(function(item, index) {
              if (item.hasChecked) {
                roleCompetenceIds.push(item.id);
              }
            });
            if (roleCompetenceIds.length > 0) {
              _that.newAddRoleForCompetences(roleCompetenceIds);
            }else {
              this.toastModalService.showSuccessToast({tipsMsg: '操作成功！', router: 'admin/roles/roleList'});
            }
        }else {
          this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
        }
      });
    }else {
      if (_that.roleId) {
        const url = this.editRoleBasicParams.url;
        this.http.patch(url, {
          'comment': this.roleDesc,
          'id': _that.roleId
        }).subscribe((res: any) => {
          if (res.responseCode === '_200') {
            // 遍历用户勾选和未勾选的功能分别放到不同的参数里面
            this.allCompetences.forEach(function(item, index) {
              console.log(item.hasChecked);
              if (item.hasChecked) {
                if (!_that.beforeModify[item.id]) {
                  _that.roleCompetencesBind.competenceIds.push(item.id);
                }
              } else {
                if (_that.beforeModify[item.id]) {
                  _that.roleCompetencesUnbind.competenceIds.push(item.id);
                }
              }
            });
            /*判断是否勾选有功能*/
            if (_that.roleCompetencesBind.competenceIds.length > 0 || _that.roleCompetencesUnbind.competenceIds.length > 0) {
              _that.bindRoleForCompetences(_that.roleCompetencesBind.competenceIds, _that.roleCompetencesUnbind.competenceIds);
            }else {
              this.toastModalService.addToasts({tipsMsg: '修改成功！', type: 'success', router: 'admin/roles/roleList'});
            }
          }else {
            this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
          }
        });
      }else {
        this.newAddRoleForCompetences(this.roleId);
      }
    }
  }
  getUserDetail(roleId ) {
    const _that = this;
    const url = this.getUserRoleParams.url;
    this.http.get(url + '?roleId=' + roleId ).subscribe((res: any) => {
      _that.roleId = res.data.id;
      _that.roleName = res.data.name;
      _that.roleDesc = res.data.comment;
      this.getAllRoles();
    });
  }
  // 查询指定角色已绑定的功能信息，无论这些功能是否可用
  findCompetencesByRoleId(roleId) {
    const _that = this;
    const url = this.findHasCompetenceParams.url;
    this.http.get(url + '?roleId=' + roleId).subscribe((res: any) => {
      if (res.responseCode === '_200') {
        _that.allCompetences.forEach(function(x, i) {
          res.data.forEach(function(item, index) {
            if (item.id === x.id) {
              x.hasChecked = true;
              // 将修改前的绑定的信息存起来
              _that.beforeModify[x.id] = x.id;
            }
          });
        });
        /*将处理过的所有权限数据用于分组，方便实现权限全有的组全选按钮被选中*/
        this.getGroups(_that.allCompetences);
        console.log(_that.allCompetences);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  getAllRoles() {
    const _that = this;
    const url = this.getAllRoleParams.url;
    this.http.get(url ).subscribe((res: any) => {
      if (res.responseCode === '_200') {
        console.log(res.data);
        _that.allCompetences = res.data;
        _that.allCompetences.forEach((item, index) => {
          item.hasChecked = false;
        });
        /*判断是否修改*/
        if (_that.roleId) {
          _that.findCompetencesByRoleId(_that.roleId);
          return;
        }
        /*新增角色直接将所有权限进行分组处理*/
        this.getGroups(res.data);
        console.log(_that.allCompetences);
      }else {
        this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
      }
    });
  }
  // 对获取的功能进行分组
  getGroups(res) {
    const cache = {};
    this.groups = [];
    const groupObj = {};
    const _that = this;
    res.forEach(function(item, index) {
      const group = (item.resource.split('/'))[2];
      if (!cache[group]) {
        groupObj[group] = {id: group, hasChecked: true, show: false};
        cache[group] = 1;
        _that.groups.push(groupObj[group]);
      }
      if (cache[group] && !item.hasChecked) {
        groupObj[group].hasChecked = false;
      }
      /*将所有功能分类存放*/
      if (_that.allCompetencesObj[group]) {
        _that.allCompetencesObj[group].push(item);
      }else {
        _that.allCompetencesObj[group] = [];
        _that.allCompetencesObj[group].push(item);
      }
    });
  }
  // 全选和取消全选
  checkAll(resource, flag) {
    console.log(resource, flag);
    this.allCompetences.forEach(function(item, index) {
      if ((item.resource.split('/'))[2] === resource) {
        item.hasChecked = flag;
      }
    });
  }
  // 单击某个功能时
  singleClick(resources) {
    const _that = this;
    const resource = (resources.split('/'))[2];
    // 初始化分组的组长（暂时这样么称呼）hasChecked为true，然后遍历所有功能，
    // 分组下的某一个的hasChecked为false时，组长的hasChecked置为false
    for (let i = 0; i < this.groups.length; i++) {
      if ( this.groups[i].id === resource) {
        this.groups[i].hasChecked = true;
        break;
      }
    }
    this.allCompetences.forEach(function(item, index) {
      if ((item.resource.split('/')[2]) === resource && item.hasChecked === false) {
        for (let i = 0; i < _that.groups.length; i++) {
          if ( _that.groups[i].id === resource) {
            _that.groups[i].hasChecked = false;
            break;
          }
        }
      }
    });
  }
  // 形成角色和功能url的绑定关系（一次可以绑定多个url）
  newAddRoleForCompetences(options) {
    const roleCompetences = {roleId: '', competenceIds: options};
    roleCompetences.roleId = this.roleId;
    if (roleCompetences.competenceIds.length > 0) {
      const url = this.bindCompetenceParams.url;
      this.http.post(url, {
        'roleId': roleCompetences.roleId,
        'competenceIds': options
      }).subscribe((res: any) => {
        if (res.responseCode === '_200') {
          this.toastModalService.showSuccessToast({tipsMsg: '添加成功！', router: 'admin/roles/roleList'});
        }else {
          this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
        }
      });
    }
  }
  // 形成角色和功能url的绑定和解绑关系（一次可以绑定和解绑多个url）
  bindRoleForCompetences(bindIds, unbindIds) {
    console.log(this.roleId);
    const bindroleCompetences = {roleId: this.roleId, competenceIds: bindIds};
    const unbindroleCompetences = {roleId: this.roleId, competenceIds: unbindIds};
    const bindUrl = this.bindCompetenceParams.url;
    const unbindUrl = this.unbindCompetenceParams.url;
    const bindHttp = this.http.post(bindUrl, new HttpParams().set('roleId', bindroleCompetences.roleId).set('competenceIds', bindroleCompetences.competenceIds), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
    const unbindHttp = this.http.post(unbindUrl, new HttpParams().set('roleId', unbindroleCompetences.roleId).set('competenceIds', unbindroleCompetences.competenceIds), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
    if (bindIds.length > 0 && unbindIds.length > 0) {
      /*有解绑和绑定*/
      Observable.forkJoin([bindHttp, unbindHttp])
        .subscribe(results => {
          /*检测有无请求出错*/
          for (let i = 0; i < results.length; i++) {
            const data: any = results[i];
            if (data.responseCode !== '_200') {

              this.toastModalService.showErrorToast({errorMsg: data.errorMsg});
              return;
            }
          }
          /*所有请求都成功*/

          this.toastModalService.showSuccessToast({tipsMsg: '操作成功！', router: 'admin/roles/roleList'});
        }, err => {

          this.toastModalService.showErrorToast({errorMsg: err.errorMsg});
        });
    }else if (bindIds.length > 0) {
      /*只有绑定*/
      bindHttp.subscribe((res: any) => {
        if (res.responseCode === '_200') {
          this.toastModalService.showSuccessToast({tipsMsg: '操作成功！', router: 'admin/roles/roleList'});
        }else {
          this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
        }
      });
    }else {
      /*只有解绑*/
      unbindHttp.subscribe((res: any) => {
        if (res.responseCode === '_200') {
          this.toastModalService.showSuccessToast({tipsMsg: '操作成功！', router: 'admin/roles/roleList'});
        }else {
          this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
        }
      });
    }
  }
  unbindRoleForCompetences(options) {
    const roleCompetences = {roleId: this.roleId, competenceIds: options};
    const url = this.unbindCompetenceParams.url;
    this.http.post(url, new HttpParams().set('roleId', roleCompetences.roleId).set('competenceIds', roleCompetences.competenceIds), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe((res: any) => {
      if (res.responseCode === '_200') {
        this.toastModalService.showSuccessToast({tipsMsg: '操作成功！', router: 'admin/roles/roleList'});
      }else {
        this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
      }
    });
  }
}
