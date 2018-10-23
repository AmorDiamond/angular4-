import { Injectable, OnDestroy } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { LoadingShow } from '../loading-ngrx/loading.model';
import { CHANGE } from '../loading-ngrx/loading.action';
import { CHANGECOUNT } from '../request-count-ngrx/request-count.action';
import { Router } from '@angular/router';
import { ToastModalService } from '../../shared/toast-modal/toast-modal.service';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/do';
import { finalize, tap } from 'rxjs/operators';
import { RequestCount } from '../request-count-ngrx/request-count.model';
// import { HttpResponse } from 'selenium-webdriver/http';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor, OnDestroy {

    constructor(
      private store: Store<LoadingShow>,
      // private requestStore: Store<RequestCount >,
      private router: Router,
      private toastModalService: ToastModalService,
    ) {
      this.loadStore = this.store.pipe(select('loading'));
      this.requestStore = this.store.pipe(select('requestCount'));
      this.requestStoreSubscription = this.requestStore.subscribe(res => {
        this.httpRequestCount = res.requestTimes;
      });
    }
  httpRequestCount: number = 0;
  loadStore: any;
  requestStore: any;
  requestStoreSubscription: Subscription;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const started = Date.now();
        let ok: string;
        const clonedRequest = req.clone({});
        console.log('new headers', clonedRequest.headers.keys(), this.httpRequestCount);
      if (this.httpRequestCount === 0) {
        this.store.dispatch({
          type: CHANGE,
          payload: {
            show: true
          }
        });
      }
      this.httpRequestCount++;
        return next
            .handle(clonedRequest)
            .do((event: any) => {
              if (event instanceof HttpResponse && event.status === 200) {
                  // console.log('new End', this.httpRequestCount);
                  this.httpRequestCount = this.httpRequestCount > 0 ? this.httpRequestCount - 1 : 0;
                  if (this.httpRequestCount === 0) {
                    this.store.dispatch({
                      type: CHANGE,
                      payload: {
                        show: false
                      }
                    });
                  }
                    if ( event.body.errorMsg === 'not found op user!') {
                        this.router.navigate(['/login']);
                        sessionStorage.setItem('hasLogin', '');
                        sessionStorage.setItem('ldapUserId', '');
                        sessionStorage.setItem('userName', '');
                    }
                }
                return event;
            }, err => {
              console.log('拦截器失败', err.error);
              if (err.error.message === 'url Access Denied or login fail!' && err.error.path === '/ldap/security/loginFail' && err.status === 500) {
                this.toastModalService.addToasts({tipsMsg: '请重新登录！', type: 'warning', timeOut: 3000});
                this.router.navigate(['/login']);
              }
              if (err.error.path === '/ldap/security/loginFail') {
                this.toastModalService.addToasts({tipsMsg: '请重新登录！', type: 'warning', timeOut: 3000});
                this.router.navigate(['/login']);
              }
              if (err.error.error.message) {
                this.toastModalService.addToasts({tipsMsg: err.error.error.message, type: 'error', timeout: 'false'});
                this.store.dispatch({
                  type: CHANGE,
                  payload: {
                    show: false
                  }
                });
              }
              if (err.status === 500 && err.error.message === 'url Access Denied or login fail!' && err.error.path === '/login') {
                this.toastModalService.addToasts({tipsMsg: '用户名或密码错误！', type: 'error', timeout: 3000});
                this.store.dispatch({
                  type: CHANGE,
                  payload: {
                    show: false
                  }
                });
              }
              if (err.error.status === 500) {
                this.toastModalService.addToasts({tipsMsg: err.error.message, type: 'error', timeout: 'false'});
                this.store.dispatch({
                  type: CHANGE,
                  payload: {
                    show: false
                  }
                });
              }
              if (err.error.status === 404) {
                this.toastModalService.addToasts({tipsMsg: err.error.message, type: 'error', timeout: 'false'});
                this.store.dispatch({
                  type: CHANGE,
                  payload: {
                    show: false
                  }
                });
              }
              if (err.error.status === 403) {
                this.toastModalService.addToasts({tipsMsg: err.error.message, type: 'error', timeout: 'false'});
                this.store.dispatch({
                  type: CHANGE,
                  payload: {
                    show: false
                  }
                });
              }
            });
        // .pipe(
        //     tap(
        //         // Succeeds when there is a response; ignore other events
        //         event => ok = event instanceof HttpResponse ? 'succeeded' : '',
        //         // Operation failed; error is an HttpErrorResponse
        //         error => ok = 'failed'
        //     ),
        //     // Log when response observable either completes or errors
        //     finalize(() => {
        //         const elapsed = Date.now() - started;
        //         const msg = `${req.method} "${req.urlWithParams}"
        //          ${ok} in ${elapsed} ms.`;
        //         console.log(msg);
        //     })
        // );
    }

  ngOnDestroy() {
    this.requestStoreSubscription.unsubscribe();
  }
}
