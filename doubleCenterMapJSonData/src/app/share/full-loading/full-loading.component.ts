import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoadingStore } from "../../core/loading-store/loading.model";

@Component({
  selector: 'app-full-loading',
  templateUrl: './full-loading.component.html',
  styleUrls: ['./full-loading.component.css']
})
export class FullLoadingComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<LoadingStore>
  ) {
    this.loadingStore$ = this.store.pipe(select('loading'))
  }
  loadingStore$: any;
  showLoading = false;
  loadingUnsub: any;
  ngOnInit() {
    this.loadingUnsub = this.loadingStore$.subscribe(res => {
      this.showLoading = res.fullStatus;
    })
  }
  ngOnDestroy () {
    this.loadingUnsub.unsubscribe()
  }

}
