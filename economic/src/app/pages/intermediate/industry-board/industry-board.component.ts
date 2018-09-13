import { Component, OnInit } from '@angular/core';
import { IntermediateService } from '../intermediate.service';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { Store } from '@ngrx/store';
import { ContainerStyle } from '../../../core/container-ngrx/container.model';

@Component({
  selector: 'app-industry-board',
  templateUrl: './industry-board.component.html',
  styleUrls: ['./industry-board.component.css']
})
export class IndustryBoardComponent implements OnInit {
  // isShowIndustryMenu: boolean = true;
  // isShowParkMenu: boolean = false;
  // isShowLandMenu: boolean = false;
  // isShowFloorMenu: boolean = false;
  showIndustryMenusControl: any;
  constructor(
    private intermediateService: IntermediateService,
    private store: Store<ContainerStyle>
  ) { }

  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '93%'
      }
    });
    this.showIndustryMenusControl = this.intermediateService.getIndustryMenusControl();
  }
  showIndustryMenus(flag) {
    this.intermediateService.showIndustryMenus(flag);
    this.showIndustryMenusControl = this.intermediateService.getIndustryMenusControl();
    console.log(this.showIndustryMenusControl);
  }

}
