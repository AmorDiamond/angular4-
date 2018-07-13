import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import {Router} from '@angular/router';

@Injectable()
export class ToastModalService {

  constructor(private router: Router, private toastyService: ToastyService, private modalService: BsModalService) { }
  modalRef: BsModalRef;
  showSuccessToast(options) {
    const toastOptions: ToastOptions = {
      title: options.tipsMsg,
      // msg: '添加成功',
      showClose: true,
      timeout: 1000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
      },
      onRemove: (toast: ToastData) => {
        if (options.router) {
          this.router.navigate([options.router]);
        }
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }
  showErrorToast(options) {
    const toastOptions: ToastOptions = {
      title: options.errorMsg,
      showClose: true,
      timeout: 1000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
      },
      onRemove: (toast: ToastData) => {
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }
  showModal(template) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
  hideModal() {
    this.modalRef.hide();
  }

}