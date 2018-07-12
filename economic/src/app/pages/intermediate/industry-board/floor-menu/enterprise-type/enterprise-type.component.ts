import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';

@Component({
  selector: 'app-enterprise-type',
  templateUrl: './enterprise-type.component.html',
  styleUrls: ['./enterprise-type.component.css']
})
export class EnterpriseTypeComponent implements OnInit, OnDestroy {

  constructor(private intermediateService: IntermediateService) { }

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('FloorMenu');
    this.intermediateService.changeShowHideData('isShowParkBuildBar', true);
  }
  ngOnDestroy() {
    this.intermediateService.changeShowHideData('isShowParkBuildBar', false);
    this.intermediateService.changeShowHideData('isShowParkNameList', false);
  }

}
