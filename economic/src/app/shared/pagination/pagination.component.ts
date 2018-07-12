import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

interface PageParam {
  totalPage: number;
  currentPage: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  totalPage: number;
  currentPage: number;
  gotoPage: number;

  constructor() {
    // this.page = new EventEmitter();
  }

  @Output() page: EventEmitter<number> = new EventEmitter<number>();

  @Input() set pageParam(pageParam: PageParam) {
    // this._pageParam = value;
    console.log(pageParam);
    if (pageParam) {
      this.totalPage = pageParam.totalPage ? pageParam.totalPage : 0;
      this.currentPage = pageParam.currentPage ? pageParam.currentPage : 0;
      this.currentPage = this.currentPage < this.totalPage ? this.currentPage : this.totalPage - 1;
      this.currentPage += 1;
    }
    // do something on 'aa' change
  }

  next() {
    if (this.totalPage === this.currentPage) {
      return false;
    }
    this.currentPage += 1;
    this.emit();
  }

  prev() {
    if (this.currentPage === 1) {
      return false;
    }
    this.currentPage -= 1;
    this.emit();
  }

  last() {
    if (this.totalPage === this.currentPage) {
      return false;
    }
    this.currentPage = this.totalPage;
    this.emit();
  }

  changeGotoPage() {
    this.gotoPage = Number(this.gotoPage.toString().replace(/[^\d]/g, ''));
  }

  pageSubmit() {
    console.log(`pageSubmit =============> ${this.gotoPage}`);
    this.currentPage = this.gotoPage;
    this.emit();
    this.gotoPage = 0;
  }

  emit() {
    this.page.emit(this.currentPage);
  }

  ngOnInit() {
  }

}
