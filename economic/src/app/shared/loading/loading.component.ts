import { Component, OnInit, Input } from '@angular/core';
import { LoadingService } from './loading.service';
import { LoadingShow } from '../../core/loading-ngrx/loading.model';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-loading',
  template: `<div class='zdy-cover-mask' *ngIf="showLoading">
        <div class='zdy-big-mask'></div>
        <div class="zdy-mask-con spinner">
          <div class="spinner-container container1">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container2">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container3">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
        </div>
      </div>`
})
export class LoadingComponent implements OnInit {
  @Input() config;
  tagState$: any;
  showLoading = false;
  constructor(private store: Store<LoadingShow>) {
    this.tagState$ = this.store.pipe(select('loading'));
  }
  ngOnInit() {
    this.tagState$.subscribe(res => {
      console.log(res.show);
      this.showLoading = res.show;
    });
  }
}
