import { Component, OnInit } from '@angular/core';
import { CompanyAssetsService } from '../company-assets.service';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styles: []
})
export class CopyrightComponent implements OnInit {

  worksCopyrightList = [];
  worksCopyrightPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  softwareCopyrightList = [];
  softwareCopyrightPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };

  constructor(
    private companyAssetsService: CompanyAssetsService
  ) { }

  ngOnInit() {
    this.getSoftwareCopyright();
    this.getWorksCopyright();
  }

  getWorksCopyright() {
    this.companyAssetsService.getDataList(this.worksCopyrightPramas, 'companyWorksCopyrightUrl').subscribe(res => {
      console.log('作品著作', res.data);
      this.worksCopyrightList = res.data.copyrightPojos;
      this.worksCopyrightPramas.lastRowKey = res.data.pagination.lastRowKey;
    });
  }

  getSoftwareCopyright() {
    this.companyAssetsService.getDataList(this.softwareCopyrightPramas, 'companySoftwareCopyrightUrl').subscribe(res => {
      console.log('软件著作', res.data);
      this.softwareCopyrightList = res.data.copyrightPojos;
      this.softwareCopyrightPramas.lastRowKey = res.data.pagination.lastRowKey;
    });
  }

}
