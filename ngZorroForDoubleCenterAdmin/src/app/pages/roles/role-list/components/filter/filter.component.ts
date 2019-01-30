import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  constructor() { }
  @Output()filterChange = new EventEmitter<any>();
  Params = {
    roleName: '',
    status: null
  };
  filterStatusEnum = [
    {value: 'STATUS_NORMAL', label: '正常'},
    {value: 'STATUS_DISABLE', label: '禁用'}
  ];
  ngOnInit() {
  }
  search () {
    this.filterChange.emit(this.Params);
  }
  reset () {
    this.Params = {
      roleName: '',
      status: null
    };
    this.filterChange.emit(this.Params);
  }

}
