import { Component, OnInit, Input, Output, EventEmitter, OnChanges, forwardRef  } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'custom-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PaginationComponent),
    multi: true
  }]
})
export class PaginationComponent implements OnInit, OnChanges {

  constructor() { }
  @Input() totalPage: any;
  @Input() maxSize: any = 5;
  @Input() moreBtn: Boolean = true;
  @Input() turnBtn: Boolean = true;
  @Input() fastTurnBtn: Boolean = true;
  @Output() currentPageChange: EventEmitter<Number> = new EventEmitter;
  @Output() changePage: EventEmitter<Number> = new EventEmitter;
  private currentPage = 1;
  showPageList: Array<number> = [];
  showEndPage = 0;
  showBeginPage = 0;
  showLeftMoreStatus = false;
  showRightMoreStatus = false;
  ngOnInit() {
  }
  ngOnChanges () {
    this.initPages();
  }
  currentChange() {
    this.currentPageChange.emit(this.currentPage);
  }
  goToPage (page) {
    if (page && this.currentPage !== page) {
      this.currentPage = page;
      this.changePageHandle();
    }
  }
  prevNextPage (page) {
    console.log(this.currentPage)
    if (this.totalPage < 2) {
      return;
    }
    let pageNum;
    if (page === '上一页') {
      pageNum = this.currentPage === 1 ? this.currentPage : this.currentPage - 1;
    } else {
      pageNum = this.currentPage === this.totalPage ? this.currentPage : this.currentPage + 1;
    }
    if (pageNum !== this.currentPage) {
      this.currentPage = pageNum;
      this.changePageHandle();
    }
  }
  leftMoreClick () {
    const startPage = this.showBeginPage - this.maxSize;
    const endPage = startPage + this.maxSize;
    this.currentPage -= Math.ceil((endPage - startPage) / 2);
    this.changePageHandle()
  }
  rightMoreClick () {
    let startPage;
    if ((this.showEndPage + this.maxSize) < this.totalPage) {
      startPage = this.showEndPage + this.maxSize;
    } else {
      startPage = this.totalPage - this.maxSize;
    }
    const endPage = startPage + this.maxSize;
    this.currentPage += Math.ceil((endPage - startPage) / 2);
    this.changePageHandle()
  }
  formatPages () {
    if (this.totalPage > this.maxSize) {
      const formatRightPage = this.showEndPage - Math.ceil(this.maxSize / 2);
      const formatLeftPage = this.showBeginPage + Math.floor(this.maxSize / 2);
      let startPage;
      if (this.currentPage > formatRightPage || this.currentPage < formatLeftPage) {
        startPage = this.currentPage - Math.floor(this.maxSize / 2) > 0 ? this.currentPage - Math.floor(this.maxSize / 2) : 1;
        this.showBeginPage = startPage;
        this.showEndPage = (startPage + this.maxSize) < this.totalPage ? (startPage + this.maxSize) : this.totalPage;
        if (this.showEndPage - this.showBeginPage <= this.maxSize) {
          startPage = this.showEndPage - this.maxSize;
          this.showBeginPage = startPage;
        }
        this.handlePagesData(startPage, this.showEndPage);
      }
    }
    console.log(this.showPageList)
  }
  initPages () {
    this.showPageList = [];
    // this.currentPage = 1;
    if (this.totalPage > this.maxSize) {
      this.maxSize--;
      const startPage = this.currentPage;
      this.showBeginPage = startPage;
      this.showEndPage = startPage + this.maxSize;
      this.handlePagesData(startPage, this.showEndPage);
    } else {
      this.showBeginPage = this.currentPage;
      this.showEndPage = this.totalPage;
      for (let i = 1; i <= this.totalPage; i++) {
        this.showPageList.push(i)
      }
    }
    this.showPagesMore();
  }
  handlePagesData (begin, end) {
    this.showPageList = [];
    for (let i = begin; i <= end; i++) {
      this.showPageList.push(i)
    }
  }
  showPagesMore () {
    if (this.currentPage > this.maxSize * 2) {
      this.showLeftMoreStatus = true;
    } else {
      this.showLeftMoreStatus = false;
    }
    if (this.showEndPage < this.totalPage) {
      this.showRightMoreStatus = true;
    } else {
      this.showRightMoreStatus = false;
    }
  }
  changePageHandle () {
    this.formatPages();
    this.showPagesMore();
    this.onModelChange(this.currentPage);
    this.changePage.emit(this.currentPage);
  }
  onModelChange: Function = () => { };
  // 页面的值改变，调用改方法，并调用onModelChange传入改变后的值，实现值得回传
  /*set value(value){
    this.currentPage = value;
    this.onModelChange(this.currentPage);
  }
  get value(){
    return this.currentPage;
  }*/
  writeValue(val): void {
    // 页面初始化时时，调用该方法，传入初始值
    if (val) {
      this.currentPage = val;
    }
  }
  registerOnChange(fn: any): void {
    // 页面值改变时，调用该方法，传入新值实现回传
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
  }

}
