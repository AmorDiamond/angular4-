import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  constructor() { }
  @Output() filterChange = new EventEmitter<any>();
  @Output() addUser = new EventEmitter<any>();
  account: any = '';
  filterStatus: any;
  filterStatusEnum = [
    {value: 'STATUS_NORMAL', label: '正常'},
    {value: 'STATUS_DISABLE', label: '禁用'}
  ];
  ngOnInit() {
  }
  search () {
    const params = {
      account: this.account,
      status: this.filterStatus
    };
    this.filterChange.emit(params);
  }
  reset () {
    this.account = '';
    this.filterStatus = null;
    this.search();
  }
  addUserHandle () {
    this.addUser.emit('addUser');
  }

}
