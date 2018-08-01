import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CHANGE } from "../../core/container-ngrx/container.action";
import { ContainerStyle } from "../../core/container-ngrx/container.model";

@Component({
  selector: 'app-data-application',
  templateUrl: './data-application.component.html',
  styleUrls: ['./data-application.component.css']
})
export class DataApplicationComponent implements OnInit {

  constructor(
    private store: Store<ContainerStyle>
  ) { }

  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
  }

}
