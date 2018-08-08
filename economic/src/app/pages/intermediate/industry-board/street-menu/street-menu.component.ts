import { Component, OnInit } from '@angular/core';
import { IntermediateService } from "../../intermediate.service";

@Component({
  selector: 'app-street-menu',
  template: '<router-outlet></router-outlet>',
})
export class StreetMenuComponent implements OnInit {

  constructor(private intermediateService: IntermediateService) { }

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('StreetMenu');
  }

}
