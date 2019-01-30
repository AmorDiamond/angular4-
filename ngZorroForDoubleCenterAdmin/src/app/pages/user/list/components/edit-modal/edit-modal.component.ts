import { Component, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {

  validateForm: FormGroup;
  @Input() record: any = {};
  @Input() title: string;
  @Input() subtitle: string;
  data: any = {
    name: ''
  };
  methods: Array<string> = ['POST', 'GET', 'DELETE', 'PATCH'];
  userName = '';
  account = '';
  password = '';
  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.data = this.record ? this.record : this.data;
    this.userName = this.data.userName;
    this.account = this.data.account;
    this.password = this.data.password;
    this.validateForm = this.fb.group({
      userName: [ this.userName, [ Validators.required, Validators.min(4) ] ],
      account: [ this.account, [ Validators.required ] ],
      password: [ null, [ Validators.required, Validators.min(4) ] ],
    });
  }

}
