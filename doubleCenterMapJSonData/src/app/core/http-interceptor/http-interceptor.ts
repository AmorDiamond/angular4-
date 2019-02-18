import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { LoadingStore } from "../loading-store/loading.model";
import { CHANGE } from "../loading-store/loading.actions";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private store: Store<LoadingStore>
  ) {
    this.loadingStore$ = this.store.pipe(select('loading'))
  }
  loadingStore$: any;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingStore$.dispatch({
      type: CHANGE,
      payload: {
        status: true
      }
    });
    return next.handle(req).pipe(tap(event => {
      if (event instanceof HttpResponse) {
        this.loadingStore$.dispatch({
          type: CHANGE,
          payload: {
            status: false
          }
        });
      }
      // return event;
    }));
  }
}
