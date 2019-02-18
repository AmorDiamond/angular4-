import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ADDENTERPRISEMARK } from "../../../core/map-store/map.actions";
import { Store, select } from '@ngrx/store';
import { MapStore } from "../../../core/map-store/map.model";
import { DataRequestService } from "../../../core/http/data-request.service";

@Component({
  selector: 'app-platform-detail',
  templateUrl: './platform-detail.component.html',
  styleUrls: ['./platform-detail.component.css']
})
export class PlatformDetailComponent implements OnInit {

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
    let url = 'technologyPlatformDetailUrl';
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
