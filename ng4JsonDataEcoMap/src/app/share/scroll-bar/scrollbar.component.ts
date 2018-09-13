import {Directive, ElementRef, OnInit} from '@angular/core';
// import * as $ from 'jquery';
declare var $: any;
@Directive({
  selector: 'app-scrollbar',
  host: {'class': 'mCustomScrollbar'}
})
export class ScrollbarComponent implements OnInit {
  el: ElementRef;
  constructor(el: ElementRef) {
    this.el = el;
  }
  ngOnInit() {
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
      axis: scrollAxis
    });
  }
}
