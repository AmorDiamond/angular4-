import { Component, OnInit } from '@angular/core';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../core/container-ngrx/container.model';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.css']
})
export class ContactLookupComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<ContainerStyle>,
  ) { }
  companyList = [];
  searchName: any;
  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
  }
  /*搜索数据*/
  getList() {
    this.router.navigate(['/dataApplication/contactLookup/list'], { queryParams: { name: this.searchName } });
  }
  /*enter键触发事件*/
  keyBoardInput($event) {
    this.getList();
  }
}
