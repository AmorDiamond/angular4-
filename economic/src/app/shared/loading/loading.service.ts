import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class LoadingService {
  showLoading = false;
  private loadingSubject = new BehaviorSubject<any>(0);

  constructor(private http: HttpClient) { }

  loadingStart() {
    this.showLoading = true;
    this.loadingSubject.next({'showLoading': this.showLoading});
  }
  loadingStop() {
    this.showLoading = false;
    this.loadingSubject.next({'showLoading': this.showLoading});
  }
  getShowLoading() {
    return this.loadingSubject.asObservable();
  }

}
