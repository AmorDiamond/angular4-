import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ContainerStyle } from "../../../../core/container-ngrx/container.model";
import {CHANGE} from "../../../../core/container-ngrx/container.action";

@Component({
  selector: 'app-industry-menu',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./industry-menu.component.css']
})
export class IndustryMenuComponent implements OnInit, OnDestroy {

  constructor(private store: Store<ContainerStyle>) { }

  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '93%'
      }
    });
  }
  ngOnDestroy() {
    /*this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });*/

  }

}
