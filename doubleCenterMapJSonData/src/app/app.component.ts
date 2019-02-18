import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { CLEARMARK } from "./core/map-store/map.actions";
import { CHANGE } from "./core/loading-store/loading.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor (
    private router: Router,
    private store: Store<any>
  ) {
    this.mapStore$ = this.store.pipe(select('map'))
    this.loadingStore$ = this.store.pipe(select('loading'))
  }
  mapStore$: any;
  loadingStore$: any;
  ngOnInit () {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event) => {
      this.mapStore$.dispatch({
        type: CLEARMARK,
        payload: {
          data: {
            type: CLEARMARK
          }
        }
      })
      this.loadingStore$.dispatch({
        type: CHANGE,
        payload: {
          status: false
        }
      })
    })
  }
}
