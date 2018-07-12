import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';

@Component({
  selector: 'app-business-problem-ledger',
  templateUrl: './business-problem-ledger.component.html',
  styleUrls: ['./business-problem-ledger.component.css']
})
export class BusinessProblemLedgerComponent implements OnInit {

  constructor(private routerInfo: ActivatedRoute, private microcomicService: MicrocosmicService) { }
  keyWord: any;
  ngOnInit() {
    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.getBusinessProblem(this.keyWord);
  }
  getBusinessProblem(companyName) {
    console.log(companyName);
  }

}
