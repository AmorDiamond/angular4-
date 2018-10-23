import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Amap } from '../../core/amap-ngrx/amap.model';
import {ADD_MARKER_MID, CLEAR_MARKER} from '../../core/amap-ngrx/amap.actions';
import { CHANGE } from '../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../core/container-ngrx/container.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-intermediate',
  templateUrl: './intermediate.component.html',
  styleUrls: ['./intermediate.component.css']
})
export class IntermediateComponent implements OnInit {

  constructor(
    private storeAmap: Store<Amap>,
  private store: Store<ContainerStyle>,
  ) { }

  ngOnInit() {

    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '93%'
      }
    });
  }

}
