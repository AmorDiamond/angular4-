import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class CustomizeIndustryFenbuService {
  private subject = new BehaviorSubject<any>(0);
  constructor(private http: HttpClient) { }
  industryMenusControl = {
    isShowIndustryMenu: true,
    isShowParkMenu: false,
    isShowLandMenu: false,
    isShowFloorMenu: false,
  }
  changeShowHideData() {
    this.subject.next({});
  }
  getShowHideData(): Observable<any> {
    return this.subject.asObservable();
  }
}
