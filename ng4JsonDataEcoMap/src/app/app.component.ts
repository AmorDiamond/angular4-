import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoadingLayer } from './core/loading-layer-ngrx/loading-layer.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  showLoading = false;
  loadLayerStore$: any;
  constructor(private loadLayerStore: Store<LoadingLayer>) {
    this.loadLayerStore$ = loadLayerStore.pipe(select('loadingLayer'));
  }
  ngOnInit() {
    this.loadLayerStore$.subscribe(res => {
      console.log(res);
      this.showLoading = res.status;
    });
  }
}
