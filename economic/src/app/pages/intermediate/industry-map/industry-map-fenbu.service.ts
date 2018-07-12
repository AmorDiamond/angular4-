import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class IndustryMapFenbuService {
  private subjectParkIndustry = new BehaviorSubject<any>(0);
  private subjectLeadIndustry = new BehaviorSubject<any>(0);
  private subjectNewIndustry = new BehaviorSubject<any>(0);
  private subjectCustomizeIndustry = new BehaviorSubject<any>(0);
  constructor(private http: HttpClient) { }

  changeSelectParkIndustry(options) {
    this.subjectParkIndustry.next({options});
  }
  getSelectParkIndustry(): Observable<any> {
    return this.subjectParkIndustry.asObservable();
  }
  changeSelectLeadIndustry(options) {
    this.subjectLeadIndustry.next({options});
  }
  getSelectLeadIndustry(): Observable<any> {
    return this.subjectLeadIndustry.asObservable();
  }
  changeSelectNewIndustry(options) {
    this.subjectNewIndustry.next({options});
  }
  getSelectNewIndustry(): Observable<any> {
    return this.subjectNewIndustry.asObservable();
  }
  changeSelectCustomizeIndustry(options) {
    this.subjectCustomizeIndustry.next({options});
  }
  getSelectCustomizeIndustry(): Observable<any> {
    return this.subjectCustomizeIndustry.asObservable();
  }
}
