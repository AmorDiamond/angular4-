import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntermediateService } from '../intermediate.service';
import { ADD_MARKER_MID, CLEAR_MARKER } from '../../../core/amap-ngrx/amap.actions';
import { Amap } from '../../../core/amap-ngrx/amap.model';
import { Store } from '@ngrx/store';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../core/container-ngrx/container.model';

@Component({
  selector: 'app-index-abstract',
  templateUrl: './index-abstract.component.html',
  styleUrls: ['./index-abstract.component.css']
})
export class IndexAbstractComponent implements OnInit, OnDestroy {

  // 天府软件园
  optionMainPart: any;
  optionHeatMap: any;
  optionMainPart1: any;
  optionHeatMap1: any;
  optionMainPart2: any;
  optionHeatMap2: any;
  optionMainPart3: any;
  optionHeatMap3: any;
  echatsDataFn: any;
  constructor(private intermediateService: IntermediateService, private storeAmap: Store<Amap>, private store: Store<ContainerStyle>) {
    this.store.select('container');
  }

  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
    this.storeAmap.dispatch({
      type: CLEAR_MARKER,
      payload: {
        action: 'CLEAR_MARKER',
        data: ''
      }
    });
    this.storeAmap.dispatch({
      type: ADD_MARKER_MID,
      payload: {
        action: 'ADD_MARKER_MID',
        data: [
          {
            'name': '高新南区',
            'center': '104.065706,30.592168',
            'type': 0,
            'subDistricts': []
          },
          {
            'name': '高新西区',
            'center': '103.922278,30.77348',
            'type': 1,
            'subDistricts': []
          },
          {
            'name': '高新东区',
            'center': '104.26881,30.277292',
            'type': 1,
            'subDistricts': []
          }
        ]
      }
    });

    this.echatsDataFn = this.intermediateService.getData('Add')
      .subscribe((res) => {
        setTimeout(() => {
          this.optionMainPart = res.optionMainPart;
          this.optionMainPart1 = res.optionMainPart1;
          this.optionMainPart2 = res.optionMainPart2;
          this.optionMainPart3 = res.optionMainPart3;
          this.optionHeatMap = res.optionHeatMap;
          this.optionHeatMap1 = res.optionHeatMap1;
          this.optionHeatMap2 = res.optionHeatMap2;
          this.optionHeatMap3 = res.optionHeatMap3;
        }, 600);
      });
  }
  ngOnDestroy() {
    this.echatsDataFn.unsubscribe();
  }

}
