import { Component, OnInit } from '@angular/core';
// import { ToastModalService } from '../../../shared/toast-modal/toast-modal.service';
// import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-area-overview',
  templateUrl: './area-overview.component.html',
  styleUrls: ['./area-overview.component.css']
})
export class AreaOverviewComponent implements OnInit {

  constructor(
  ) { }
  // area = '';
  ngOnInit() {
    // this.area = this.routerInfo.snapshot.queryParams['area'];
  }

}
