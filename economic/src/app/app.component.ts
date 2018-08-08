import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from './pages/microcosmic/microcosmic.service';
import { IntermediateService } from './pages/intermediate/intermediate.service';
import { LoadingService} from './shared/loading/loading.service';
import { IndustryMapFenbuService } from './pages/intermediate/industry-map/industry-map-fenbu.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { CHANGE } from "./core/loading-ngrx/loading.action";
import { LoadingShow } from "./core/loading-ngrx/loading.model";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.css'],
  providers: [MicrocosmicService, IntermediateService, LoadingService, IndustryMapFenbuService]
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private http: HttpClient,
    private store: Store<LoadingShow>
  ) {}
  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        /*跳转页面关闭之前的加载层*/
        this.store.dispatch({
          type: CHANGE,
          payload: {
            show: false
          }
        });
        const titleJson = this.http.get('../assets/titleConfig.json').subscribe(res => {
          console.log(this.router.url);
          const title = res[this.router.url] ? res[this.router.url] : '经济指标';
          this.titleService.setTitle(title);
        });
      });
  }
}
