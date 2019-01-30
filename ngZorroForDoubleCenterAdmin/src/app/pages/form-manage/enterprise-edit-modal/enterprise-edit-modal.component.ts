import { Component, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-enterprise-edit-modal',
  templateUrl: './enterprise-edit-modal.component.html',
  styleUrls: ['./enterprise-edit-modal.component.css']
})
export class EnterpriseEditModalComponent implements OnInit {

  validateForm: FormGroup;
  @Input() record: any = {};
  @Input() title: string;
  @Input() subtitle: string;
  data: any = {
    name: ''
  };
  statusEnum = [
    {value: 'STATUS_NORMAL', label: '正常'},
    {value: 'STATUS_DISABLE', label: '禁用'}
  ];
  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.data = this.record ? this.record : this.data;
    this.validateForm = this.fb.group({
      name: [ this.data.name, [ Validators.required, Validators.min(4) ] ],
      creditCode: [ this.data.creditCode, [ Validators.required ] ],
      address: [ this.data.registeredAddress, [ Validators.required, Validators.min(4) ] ],
      businessScope: [ this.data.businessScope, [ Validators.required, Validators.min(4) ] ],
      businessStatus: [ this.data.businessStatus, [ Validators.required ] ],
      legalPersonName: [ this.data.legalPersonName, [ Validators.required ] ],
      telephone: [ this.data.telephone, [ Validators.required, Validators.min(4) ] ],
      registCapital: [ this.data.registCapital, [ Validators.required ] ],
      establishDate: [ this.data.establishDate, [ Validators.required ] ]
    });
  }

}
