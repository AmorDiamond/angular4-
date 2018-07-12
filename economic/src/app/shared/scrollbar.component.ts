import {Directive, ElementRef, OnInit, Output, EventEmitter} from '@angular/core';
// import * as $ from 'jquery';
declare var $: any;
@Directive({
  selector: 'perfect-scrollbar',
  host: {'class': 'mCustomScrollbar'}
})
export class ScrollbarComponent implements OnInit {
    @Output() psYReachEnd = new EventEmitter();
  el: ElementRef;
  constructor(el: ElementRef) {
    this.el = el;
  }
  ngOnInit() {
    const psYReachEnd = this.psYReachEnd;
    // console.log(this.el);
    // console.log($('.mCustomScrollbar'));
    let scrollAxis = 'y';
    if (this.el.nativeElement.getAttribute('data-scroll') === 'X') {
      scrollAxis = 'x';
    }
    $(this.el.nativeElement).mCustomScrollbar({
      autoHideScrollbar: true,
      setHeight: '100%',
      theme: 'light',
      axis: scrollAxis,
      callbacks: {
          /*whileScrolling: function(){      　// 只要滚动条滚动，这个函数就会执行
              if (this.mcs.topPct >= 99) {    // 这表示当滚动条滚动到这个div的90%(当然这个值是可变的)的时候调用下面的代码，
                  psYReachEnd.emit();
              }
          }*/
          onTotalScroll: () => {
              this.psYReachEnd.emit();
          }
      }
    });
  }
}
