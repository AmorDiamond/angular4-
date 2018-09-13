import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-layer',
  template: `<div class="zdy-full-cover-mask">
              <div class="zdy-big-mask"></div>
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
            </div>`,
  styleUrls: ['./loading-layer.component.css']
})
export class LoadingLayerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
