import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-function-manage',
  templateUrl: './function-manage.component.html',
  styleUrls: ['./function-manage.component.css']
})
export class FunctionManageComponent implements OnInit {
  validateForm: FormGroup;
  @Input() record: any = {};
  @Input() title: string;
  @Input() subtitle: string;
  data: any = {
    comment: '',
    methods: 'POST',
    resource: ''
  };
  methods: Array<string> = ['POST', 'GET', 'DELETE', 'PATCH'];
  functionName = '';
  functionMethod = 'POST';
  functionDesc = '';
  constructor(
    private modal: NzModalRef,
    private modalService: NzModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.data = this.record ? this.record : this.data;
    this.validateForm = this.fb.group({
      comment: [ this.data.comment, [ Validators.required, Validators.min(4) ] ],
      methods: [ this.data.methods, [ Validators.required ] ],
      resource: [ this.data.resource, [ Validators.required, Validators.min(4) ] ],
    });
  }
  destroyModal(): void {
    console.log(this.modal)
    this.modal.destroy({ data: 'this the result data' });
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      console.log(this.validateForm.controls[ i ].value)
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }
  confirmationValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

}
