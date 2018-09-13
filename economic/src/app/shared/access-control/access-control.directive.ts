import { Directive, Output, Input, EventEmitter, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from '../../pages/layout/layout.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[appAccessControl]'
})
export class AccessControlDirective implements OnInit, OnDestroy {

  @Output() changeTime = new EventEmitter();
  @Input() accessData: any;
  @Input() buttonAccess: boolean;
  el: ElementRef;
  accessControlSubject: Subscription;
  constructor(el: ElementRef, private layoutService: LayoutService) {
    this.el = el;
  }
  ngOnInit() {
    this.accessControlSubject = this.layoutService.getAccessControlSubject().subscribe(res => {
      if (!this.buttonAccess) {
        this.menuAccessControl(res);
      }else {
        this.buttonAccessControl(res);
      }

    });
  }
  ngOnDestroy() {
    this.accessControlSubject.unsubscribe();
  }
  /*菜单权限处理*/
  menuAccessControl(options) {
    const res = options;
    if (Array.isArray(this.accessData)) {
      let status = true;
      for (let i = 0; i < res.length; i++) {
        if (this.accessData.indexOf(res[i].type) > -1 && res[i].hasAccess) {
          status = false;
          break;
        }
      }
      this.el.nativeElement.hidden = status;
    }else {
      for (let i = 0; i < res.length; i++) {
        if (res[i].type === this.accessData) {
          this.el.nativeElement.hidden = res[i] && res[i].hasAccess ? false : true;
          break;
        }
      }
    }
  }
  /*按钮权限处理*/
  buttonAccessControl(options) {
    const res = options;
    if (Array.isArray(this.accessData)) {
      let status = true;
      for (let i = 0; i < res.length; i++) {
        if (this.accessData.indexOf(res[i].type) > -1 && res[i].hasAccess) {
          status = false;
          break;
        }
      }
      if (status) {
        this.el.nativeElement.style.color = 'grey';
        this.el.nativeElement.style.borderColor = 'grey';
        this.el.nativeElement.style.cursor = 'not-allowed';
        this.el.nativeElement.setAttribute('disabled', 'true');
      }
    }else {
      for (let i = 0; i < res.length; i++) {
        if (res[i].type === this.accessData) {
          if (!res[i].hasAccess) {
            const abledStatus = res[i].hasAccess ? 'false' : 'true';
            this.el.nativeElement.style.color = 'grey';
            this.el.nativeElement.style.borderColor = 'grey';
            this.el.nativeElement.style.cursor = 'not-allowed';
            this.el.nativeElement.setAttribute('disabled', abledStatus);
          }
          break;
        }
      }
    }
  }

}
