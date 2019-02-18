import { Component, OnInit } from '@angular/core';
import { ADDPARKMARK } from "../../core/map-store/map.actions";
import { MapStore } from "../../core/map-store/map.model";
import { Store, select } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from "./home.service";
import { LoadingStore } from "../../core/loading-store/loading.model";
import { CHANGE } from "../../core/loading-store/loading.actions";
import { MapService } from "../../core/map/map.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private mapStore: Store<MapStore>,
    private loadingStore: Store<LoadingStore>,
    private routerInfo: ActivatedRoute,
    private router: Router,
    private homeService: HomeService,
    private mapService: MapService,
  ) {
    this.mapStore$ = this.mapStore.pipe(select('map'))
    this.loadingStore$ = this.loadingStore.pipe(select('loading'))
  }
  mapStore$: any;
  loadingStore$: any;
  parkEnterpriseTotal: any;
  areaParkName;
  typeEnterprises = {
    doubleCreation: '',
    policySupport: '',
    incubator: '',
    publicTechnology: '',
  };
  queryParkName: any;
  ngOnInit() {
    // console.log('mapStore$', this.mapStore$)
    this.routerInfo.queryParams.subscribe(res => {
      console.log('home', res)
      this.areaParkName = res.park;
      this.queryParkName = res.park;
      if (!res.park) {
        this.areaParkName = '高新南区';
        /*this.router.navigate(['home'], {
          queryParams: {
            park: '高新南区'
          }
        })*/
      }
      if (this.areaParkName) {
        this.getParkInfo();
        this.creatAreaMark();
      }
    });
    this.homeService.getHeatmapData().subscribe(res => {
      let hasData = false;
      for (const i in res) {
        if (res[i].length > 0) {
          hasData = true
        }
      }
      !hasData && this.getCompanyCountHeatmap();
    });
  }
  creatAreaMark() {
    this.mapStore$.dispatch({
      type: ADDPARKMARK,
      payload: {
        data: {type: ADDPARKMARK, options: this.queryParkName}
      }
    })
  }
  getParkInfo () {
    console.log(this.areaParkName);
    this.parkEnterpriseTotal = this.mapService.getParkEnterprise()[this.areaParkName];
    const params = {landName: this.areaParkName};
    this.homeService.httpRequest('getParkOverviewUrl', params).subscribe(res => {
      if (res.responseCode === '_200') {
        this.typeEnterprises.doubleCreation = res.data['双创企业'];
        this.typeEnterprises.policySupport = res.data['政策扶持企业'];
        this.typeEnterprises.incubator = res.data['孵化器'];
        this.typeEnterprises.publicTechnology = res.data['公共技术服务平台'];
      }
    })
  }
  getCompanyCountHeatmap () {
    this.loadingStore$.dispatch({
      type: CHANGE,
      payload: {
        fullStatus: true
      }
    });
    const list = [
      {findParams: {landName: '高新西区'}, url: 'enterprisePositions'},
      {findParams: {landName: '高新南区'}, url: 'enterprisePositions'},
      {findParams: {landName: '高新东区'}, url: 'enterprisePositions'},
      {findParams: {landName: '天府国际生物城'}, url: 'enterprisePositions'}
    ];
    this.homeService.getRequestByForkJoin(list).subscribe(res => {
      this.loadingStore$.dispatch({
        type: CHANGE,
        payload: {
          fullStatus: false
        }
      });
      // const allPositions = [...res[0].data, ...res[1].data, ...res[2].data, ...res[3].data];
      // const heatmapData = [];
      const westData = res[0].data;
      const westHeatmapData = [];
      const southData = res[1].data;
      const southHeatmapData = [];
      const eastData = res[2].data;
      const eastHeatmapData = [];
      const biologicalData = res[3].data;
      const biologicalHeatmapData = [];
      westData.forEach(item => {
        const lngLat = item[0].split(',');
        const data = {
          "lng": lngLat[0],
          "lat": lngLat[1],
          "count": item[1]
        };
        westHeatmapData.push(data);
      });
      southData.forEach(item => {
        const lngLat = item[0].split(',');
        const data = {
          "lng": lngLat[0],
          "lat": lngLat[1],
          "count": item[1]
        };
        southHeatmapData.push(data);
      });
      eastData.forEach(item => {
        const lngLat = item[0].split(',');
        const data = {
          "lng": lngLat[0],
          "lat": lngLat[1],
          "count": item[1]
        };
        eastHeatmapData.push(data);
      });
      biologicalData.forEach(item => {
        const lngLat = item[0].split(',');
        const data = {
          "lng": lngLat[0],
          "lat": lngLat[1],
          "count": item[1]
        };
        biologicalHeatmapData.push(data);
      });
      this.homeService.setHeatmapData(westHeatmapData, southHeatmapData, eastHeatmapData, biologicalHeatmapData);
    })
  }
}
