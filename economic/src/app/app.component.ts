import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from './pages/microcosmic/microcosmic.service';
import { IntermediateService } from './pages/intermediate/intermediate.service';
import { LoadingService} from './shared/loading/loading.service';
import { IndustryMapFenbuService } from './pages/intermediate/industry-map/industry-map-fenbu.service';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { CHANGE } from './core/loading-ngrx/loading.action';
import { CHANGECOUNT } from './core/request-count-ngrx/request-count.action';
import { LoadingShow } from './core/loading-ngrx/loading.model';
import { ToastModalService } from './shared/toast-modal/toast-modal.service';
import { RequestCount } from './core/request-count-ngrx/request-count.model';
import { LayoutService } from './pages/layout/layout.service';
// import { titleJson } from '../assets/titleConfig.json';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet><ng2-toasty [position]="\'center-center\'"></ng2-toasty>',
  styleUrls: ['./app.component.css'],
  providers: [MicrocosmicService, IntermediateService, LoadingService, IndustryMapFenbuService, LayoutService]
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private http: HttpClient,
    private store: Store<LoadingShow>,
    private requestStore: Store<RequestCount>,
    private toastModalService: ToastModalService,
  ) {}
  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(() => {
        /*跳转页面关闭之前的加载层*/
        this.store.dispatch({
          type: CHANGE,
          payload: {
            show: false
          }
        });
        /*跳转页面重置请求次数*/
        this.requestStore.dispatch({
          type: CHANGECOUNT,
          payload: {
            requestTimes: 0
          }
        });
        /*关闭未关闭的toast提示框*/
        this.toastModalService.clearAll();
      });
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        /*路由跳转完后获取页面title*/
        this.http.get('../assets/titleConfig.json').subscribe(res => {
          console.log(this.router.url);
          const title = res[this.router.url] ? '成都高新区企业多维数据平台' + res[this.router.url] : '成都高新区企业多维数据平台';
          this.titleService.setTitle(title);
        });
      });
  }
}
