import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContainerStyle } from '../../core/container-ngrx/container.model';
import { CHANGE } from '../../core/container-ngrx/container.action';

@Component({
  selector: 'app-macroscopic',
  templateUrl: './macroscopic.component.html',
  styleUrls: ['./macroscopic.component.css']
})
export class MacroscopicComponent implements OnInit {

  constructor(private store: Store<ContainerStyle>) {
    this.store.select('container');
  }

  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '93%'
      }
    });
  }

}
