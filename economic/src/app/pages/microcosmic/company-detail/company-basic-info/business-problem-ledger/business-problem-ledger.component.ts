import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyBasicService } from '../company-basic.service';

@Component({
  selector: 'app-business-problem-ledger',
  templateUrl: './business-problem-ledger.component.html',
  styleUrls: ['./business-problem-ledger.component.css']
})
export class BusinessProblemLedgerComponent implements OnInit {

  constructor(
    private routerInfo: ActivatedRoute,
    private companyBasicService: CompanyBasicService,
    private microcomicService: MicrocosmicService
  ) { }
  keyWord: any;
  problemTipsMsg = '加载中...';
  problemList = [];
  problemParams = {
    companyName: '',
    currentPage: 0,
    pageSize: 15,
    lastRowKey: ''
  };
  ngOnInit() {
    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.problemParams.companyName = this.keyWord;
    this.getBusinessProblem();
  }
  getBusinessProblem() {
    this.companyBasicService.findListByUrl(this.problemParams, 'companyProblemesUrl').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        if (res.data.eIIRelationPojo.length < 1) {
          this.problemTipsMsg = '暂无信息！';
        }
        this.problemList = [...this.problemList, ...res.data.eIIRelationPojo];
        this.problemParams.lastRowKey = res.data.pagination.lastRowKey;
        // this.problemParams.currentPage = res.data.pagination.currentPage + 1;
      }
    });
  }

}
