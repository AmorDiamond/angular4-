import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { LoadingShow } from '../loading-ngrx/loading.model';
import { CHANGE } from '../loading-ngrx/loading.action';
import { Router } from '@angular/router';

import 'rxjs/add/operator/do';
import { finalize, tap } from 'rxjs/operators';
// import { HttpResponse } from 'selenium-webdriver/http';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private store: Store<LoadingShow>, private router: Router) {
        this.store.select('loading');
    }
  httpRequestCount: number = 0;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const started = Date.now();
        let ok: string;
        const clonedRequest = req.clone({});
        console.log('new headers', clonedRequest.headers.keys());
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
            .do(event => {
                if (event instanceof HttpResponse && event.status === 200) {
                  console.log('new End');
                  this.httpRequestCount--;
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
}
