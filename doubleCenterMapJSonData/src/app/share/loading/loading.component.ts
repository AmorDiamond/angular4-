import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoadingStore } from "../../core/loading-store/loading.model";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

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
      this.showLoading = res.status;
    })
  }
  ngOnDestroy () {
    this.loadingUnsub.unsubscribe()
  }

}
