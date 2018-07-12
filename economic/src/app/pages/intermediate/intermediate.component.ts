import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Amap } from '../../core/amap-ngrx/amap.model';
import {ADD_MARKER_MID, CLEAR_MARKER} from '../../core/amap-ngrx/amap.actions';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-intermediate',
  templateUrl: './intermediate.component.html',
  styleUrls: ['./intermediate.component.css']
})
export class IntermediateComponent implements OnInit {

  constructor(private storeAmap: Store<Amap>) { }

  ngOnInit() {}

}
