import { Component, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { UserService } from '../../../user.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-setroles-modal',
  templateUrl: './setroles-modal.component.html',
  styleUrls: ['./setroles-modal.component.css']
})
export class SetrolesModalComponent implements OnInit {

  validateForm: FormGroup;
  @Input() record: any = {};
  @Input() title: string;
  @Input() subtitle: string;
  data: any = {
    id: '',
    userName: '',
    account: ''
  };
  rolesData = [];
  hasRoles = [];
  newRoles = [];
  removeRoles = [];
  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private user: UserService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.data = this.record ? this.record : this.data;
    this.getAllRoles();
  }
  getAllRoles () {
    const loginUser = sessionStorage.getItem('userId');
    const loginUrl = loginUser === '1' ? 'getAllRolesUrl' : 'findRolesUrl';
    const list = [
      {findParams: {id: loginUser}, url: loginUrl},
      {findParams: {id: this.data.id}, url: 'findRolesUrl'}
    ];
    this.user.getRequestByForkJoin(list).subscribe(res => {
      const errorList = res.filter(item => item.responseCode !== '_200');
      if (errorList.length) {
        errorList.forEach(item => {
          this.message.error(item.errorMsg);
        });
      } else {
        // 处理roles数据列表
        this.rolesData = res[0].data;
        this.hasRoles = res[1].data;
        this.formatRoles();
      }
    });
  }
  formatRoles () {
    this.rolesData.forEach(item => {
      this.hasRoles.forEach(hasItem => {
        if (hasItem.id === item.id) {
          item.checked = true;
        }
      });
    });
  }
  change (event) {
    const checkedList = event;
    let newCheckArr = [];
    const removeCheckArr = [];
    newCheckArr = checkedList.filter(item => {
      const has = this.hasRoles.some(hasItem => item === hasItem.id);
      return !has;
    });
    this.hasRoles.forEach(hasItem => {
      const has = checkedList.some(item => item === hasItem.id);
      if (!has) {
        removeCheckArr.push(hasItem.id);
      }
    });
    this.newRoles = newCheckArr;
    this.removeRoles = removeCheckArr;
    console.log(newCheckArr, removeCheckArr)
  }

}
