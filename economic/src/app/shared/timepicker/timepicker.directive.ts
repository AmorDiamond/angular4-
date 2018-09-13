import { Directive, ElementRef, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

declare var $: any;
@Directive({
  selector: '[appTimepicker]'
})
export class TimepickerDirective implements OnInit {
  @Output() changeTime = new EventEmitter();
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() initDate: any;
  @Input() maxView: any;
  el: ElementRef;
  constructor(el: ElementRef) {
    this.el = el;
  }
  ngOnInit() {
    /*时间控制*/
    const initStartDate = new Date(this.startDate);
    // const startDateDay = initStartDate.getFullYear() + '-' + (initStartDate.getMonth() + 1) + '-' + initStartDate.getDate();
    // const formatEndDate = new Date(startDateDay).getTime() + 17 * 60 * 60 * 1000; // 开始调研当天的下午五点
    const startDate = this.startDate ? new Date(this.startDate) : '';
    const endDate = this.endDate ? new Date(this.endDate) : '';
    const maxView = this.maxView ? this.maxView : 3;
    $(this.el.nativeElement).datetimepicker({
      autoclose: true,
      startView: 0,
      minView: 0,
      maxView: maxView,
      forceParse: 0,
      format: 'yyyy-mm-dd hh:ii',
      todayHighlight: true,
      startDate: startDate,
      endDate: endDate,
      initialDate: new Date(this.initDate)
    }).on('changeDate', (ev) => {
      // const chooseTime = new Date(ev.date.valueOf()).getFullYear();
      // console.log(ev);
      this.changeTime.emit(new Date(ev.date.valueOf()));
    });
  }
}
