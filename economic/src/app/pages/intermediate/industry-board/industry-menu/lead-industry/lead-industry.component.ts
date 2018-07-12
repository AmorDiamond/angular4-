import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IntermediateService } from '../../../intermediate.service';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';

@Component({
  selector: 'app-lead-industry',
  templateUrl: './lead-industry.component.html',
  styleUrls: ['./lead-industry.component.css']
})
export class LeadIndustryComponent implements OnInit {

  constructor(private store: Store<ContainerStyle>, private intermediateService: IntermediateService) {
    this.store.select('container');
  }

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('IndustryMenu');
  }

}
