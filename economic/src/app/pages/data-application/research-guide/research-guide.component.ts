import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../core/container-ngrx/container.model';
import { Store } from '@ngrx/store';
import { LayoutService } from '../../layout/layout.service';

@Component({
  selector: 'app-research-guide',
  templateUrl: './research-guide.component.html',
  styleUrls: ['./research-guide.component.css']
})
export class ResearchGuideComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<ContainerStyle>,
    private layoutService: LayoutService
  ) { }
  companyList = [];
  industryTypeList = [];
  selectedCompanyList = [];
  searchName: any;
  searchStatus: boolean = true;
  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
  }
  /*搜索数据*/
  getList() {
    this.router.navigate(['/dataApplication/researchGuide/list'], { queryParams: { name: this.searchName } });
  }
  /*enter键触发事件*/
  keyBoardInput($event) {
    this.getList();
  }
}
