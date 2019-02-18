import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ADDENTERPRISEMARK } from "../../../core/map-store/map.actions";
import { Store, select } from '@ngrx/store';
import { MapStore } from "../../../core/map-store/map.model";
import { DataRequestService } from "../../../core/http/data-request.service";

@Component({
  selector: 'app-enterprise-detail',
  templateUrl: './enterprise-detail.component.html',
  styleUrls: ['./enterprise-detail.component.css']
})
export class EnterpriseDetailComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private http: HttpClient,
    private store: Store<MapStore>,
    private dataRequestService: DataRequestService
  ) {
    this.mapStore$ = this.store.pipe(select('map'));
  }
  mapStore$: any;
  enterpriseName: any;
  enterpriseId: any;
  enterpriseData: any;
  enterpriseMarks = {};
  enterpriseMark: any;
  routerUrl: any;
  ngOnInit() {
    this.enterpriseMarks = this.dataRequestService.getEnterpriseMarks();
    this.routerInfo.params.subscribe(res => {
      if (res.name) {
        this.routerUrl = this.router.url.split('/')[1];
        this.enterpriseMark = this.enterpriseMarks[this.routerUrl];
        this.enterpriseId = res.name;
        this.getInfo();
      }
    })
  }
  getInfo () {
    let url = 'enterpriseListDetailUrl'; // 企业列表获取企业详情
    if (this.routerUrl === 'incubator') {
      url = 'incubatorListUrl';
    } else if (this.routerUrl === 'intermediary') {
      url = 'technologyIntermediaryDetailUrl';
    } else if (this.routerUrl === 'technologyPlatform') {
      url = 'technologyPlatformDetailUrl';
    }
    /*else if (
      this.routerUrl === 'search' ||
      this.routerUrl === 'technology' ||
      this.routerUrl === 'doubleVenture' ||
      this.routerUrl === 'seedEnterprise' ||
      this.routerUrl === 'gazelleEnterprise' ||
      this.routerUrl === 'unicornEnterprise'
    ) {
      url = 'enterpriseListDetailUrl';
    }*/
    const params = {id: this.enterpriseId};
    this.dataRequestService.httpRequest(url, 'get', params).subscribe(res => {
      if (res.responseCode === '_200') {
        this.enterpriseData = res.data;
        this.enterpriseData.position = this.enterpriseData.coordinate ? this.enterpriseData.coordinate.split(',') : null;
        console.log(this.enterpriseData)
        this.mapStore$.dispatch({
          type: ADDENTERPRISEMARK,
          payload: {
            data: {type: ADDENTERPRISEMARK, detail: true, img: this.enterpriseMark, options: this.enterpriseData}
          }
        })
      }
    });
  }
  backHistory() {
    history.back();
  }

}
