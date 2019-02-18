import { Component, OnInit } from '@angular/core';
import { LayoutService } from "../../layout/layout.service";
import { DataRequestService } from "../../../core/http/data-request.service";
import { ADDENTERPRISEMARK } from "../../../core/map-store/map.actions";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from '@ngrx/store';
import { MapStore } from "../../../core/map-store/map.model";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(
    private dataRequestService: DataRequestService,
    private layoutService: LayoutService,
    private routerInfo: ActivatedRoute,
  private store: Store<MapStore>,
  ) {
    this.mapStore$ = this.store.pipe(select('map'));
  }

  enterpriseList: Array<any> = [];
  enterpriseTotal: any;
  mapStore$: any;
  searchWord: any;
  requestParams = {
    page: 0,
    size: 15,
    keyWord: ''
  };
  paginationParams = {
    currentPage: 1,
    totalPages: 10,
    maxSize: 5,
    totalItems: 0
  };
  enterpriseMark: any;
  scrollToTop = false;
  ngOnInit() {
    this.routerInfo.params.subscribe(res => {
      if (res.name) {
        this.searchWord = res.name;
        this.search();
      }
    });
  }
  search () {
    this.requestParams.keyWord = this.searchWord;
    this.dataRequestService.httpRequest('searchUrl', 'get', this.requestParams).subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        this.enterpriseList = res.data.companys ? res.data.companys : this.enterpriseList;
        this.enterpriseTotal = res.data.pageParam.total;
        this.paginationParams.totalItems = res.data.pageParam.total;
        this.paginationParams.totalPages = res.data.pageParam.totalPage;
        this.enterpriseList.forEach(item => {
          item.prefixName = item.company.name ? item.company.name.slice(0, 2) : '';
          item.position = item.company.coordinate ? item.company.coordinate.split(',') : null;
          item.name = item.company.name ? item.company.name : '';
          item.hilightName = item.company.hilightName ? item.company.hilightName : '';
          item.id = item.company.id ? item.company.id : '';
        });
        console.log(this.enterpriseList)
        this.mapStore$.dispatch({
          type: ADDENTERPRISEMARK,
          payload: {
            data: {type: ADDENTERPRISEMARK, img: this.enterpriseMark, options: this.enterpriseList}
          }
        })
      }
    })
  }
  changePage (event) {
    this.scrollToTop = true;
    console.log('changePage', event)
    this.requestParams.page = event - 1;
    this.search();
  }

}
