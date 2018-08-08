import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import {ContainerStyle} from '../../../core/container-ngrx/container.model';

@Component({
  selector: 'app-industry-map',
  templateUrl: './industry-map.component.html',
  styleUrls: ['./industry-map.component.css']
})
export class IndustryMapComponent implements OnInit {

  constructor(private store: Store<ContainerStyle>) { }
  showIndustryMapMenusControl = {
    fenbuMenu: true,
  }
  ngOnInit() {
    this.store.dispatch({
      type: 'CHANGE',
      payload: {
        width: '60%'
      }
    });
  }
  showIndustryMapMenus(options?) {
    if (options) {
      this.showIndustryMapMenusControl[options] = !this.showIndustryMapMenusControl[options];
    }else {
      this.showIndustryMapMenusControl.fenbuMenu = false;
    }
  }

}
