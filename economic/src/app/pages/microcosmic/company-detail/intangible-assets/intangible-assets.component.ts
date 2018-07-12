import { Component, OnInit } from '@angular/core';
import { CompanyAssetsService } from './company-assets.service';

@Component({
  selector: 'app-intangible-assets',
  templateUrl: './intangible-assets.component.html',
  styleUrls: ['./intangible-assets.component.css'],
  providers: [CompanyAssetsService]
})
export class IntangibleAssetsComponent implements OnInit {
  companyName: any;
  companyChangeList = [];
  trademarkList = [];
  patenList = [];
  worksCopyrightList = [];
  softwareCopyrightList = [];
  icpList = [];
  domainList = [];
  trademarkListPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  patentListPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  worksCopyrightPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  softwareCopyrightPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  icpListPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  domainListPramas = { companyName: 'test1', currentPage: 0, pageSize: 3, lastRowKey: '' };
  constructor(private companyAssetsService: CompanyAssetsService) { }

  ngOnInit() {
    this.companyName = 'test1';
    this.getTrademarkList();
    this.getDomainList();
    this.getIcpList();
    this.getPatentList();
    this.getSoftwareCopyright();
    this.getWorksCopyright();
   /* this.companyAssetsService.getTrademarkList(this.companyName).subscribe(res => {
      console.log('商标', res.data);
      this.trademarkList = res.data.iATrademarkPojos;
    });
    this.companyAssetsService.getPatentList(this.companyName).subscribe(res => {
      console.log('专利', res.data);
      this.patenList = res.data.patentPojos;
    });
    this.companyAssetsService.getWorksCopyright(this.companyName).subscribe(res => {
      console.log('作品著作', res.data);
      this.worksCopyrightList = res.data.copyrightPojos;
    });
    this.companyAssetsService.getSoftwareCopyright(this.companyName).subscribe(res => {
      console.log('软件著作', res.data);
      this.softwareCopyrightList = res.data.copyrightPojos;
    });
    this.companyAssetsService.getIcpList(this.companyName).subscribe(res => {
      console.log('ICP', res.data);
      this.icpList = res.data.iAIcpPojos;
    });
    this.companyAssetsService.getDomainList(this.companyName).subscribe(res => {
      console.log('域名', res.data);
      this.domainList = res.data.iAIcpPojo;
    });*/
  }
  getTrademarkList() {
    this.companyAssetsService.getDataList(this.trademarkListPramas, 'companyTrademarkListUrl').subscribe(res => {
      console.log('商标', res.data);
      this.trademarkList = res.data.iATrademarkPojos;
      this.trademarkListPramas.lastRowKey = res.data.pagination.lastRowKey;
    });
  }
  getPatentList() {
    this.companyAssetsService.getDataList(this.patentListPramas, 'companyPatentListUrl').subscribe(res => {
      console.log('专利', res.data);
      this.patenList = res.data.patentPojos;
      this.patentListPramas.lastRowKey = res.data.pagination.lastRowKey;
    });
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
  getIcpList() {
    this.companyAssetsService.getDataList(this.icpListPramas, 'companyIcpListUrl').subscribe(res => {
      console.log('ICP', res.data);
      this.icpList = res.data.iAIcpPojos;
      this.icpListPramas.lastRowKey = res.data.pagination.lastRowKey;
    });
  }
  getDomainList() {
    this.companyAssetsService.getDataList(this.domainListPramas, 'companyDomainListUrl').subscribe(res => {
      console.log('域名', res.data);
      this.domainList = res.data.iAIcpPojo;
      this.domainListPramas.lastRowKey = res.data.pagination.lastRowKey;
    });
  }
  psYReachEnd(traget: string) {
    this[traget]();
    console.log('滚动到底部了==========>执行', traget);
  }

}
