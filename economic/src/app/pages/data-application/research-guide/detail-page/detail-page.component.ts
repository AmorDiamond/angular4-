import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from "../../../microcosmic/microcosmic.service";

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {

  constructor(private microcomicService: MicrocosmicService) { }
  detaileData = {};
  companyName: any;
  downLoadName = '调查问卷';
  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.downLoadName = this.companyName + '调查问卷';
    this.getDetailData();
  }
  /*获取详细数据*/
  getDetailData() {
    this.detaileData = {}
  }
}
