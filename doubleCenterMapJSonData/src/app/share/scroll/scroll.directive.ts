import { Directive, ElementRef, AfterViewInit, Input, OnChanges, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
declare var $: any;

@Directive({
  selector: '[appScroll]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ScrollDirective),
    multi: true
  }]
})
export class ScrollDirective implements AfterViewInit {

  constructor(
    private el: ElementRef
  ) {
  }
  @Input() scrollToTop: any = false;
  scrollEl: any;
  ngAfterViewInit () {
    console.log(this.scrollToTop);
    const event = this.el.nativeElement;
    this.scrollEl = $(event).mCustomScrollbar({theme:"minimal-dark"});
  }
  // 滚动条返回顶部
  scrollTop () {
    this.onModelChange(false);
    const event = this.el.nativeElement;
    $(event).mCustomScrollbar('stop');
    $(event).mCustomScrollbar('update');
    $(event).mCustomScrollbar('scrollTo', 'top', {
      scrollInertia: 0
    });
  }
  onModelChange: Function = () => { };
  // 页面的值改变，调用改方法，并调用onModelChange传入改变后的值，实现值得回传
  writeValue(val): void {
    // 页面初始化时时，调用该方法，传入初始值
    if (val) {
      this.scrollTop();
    }
  }
  registerOnChange(fn: any): void {
    // 页面值改变时，调用该方法，传入新值实现回传
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
  }

}
