import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Amap } from '../../../core/amap-ngrx/amap.model';
import { Store } from '@ngrx/store';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { MicrocosmicService } from '../microcosmic.service';
import { Subscription } from 'rxjs/Subscription';
import { CompanyDetailService, AttentionParams } from './company-detail.service';
import { CompanyBasicService } from './company-basic-info/company-basic.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  providers: [CompanyDetailService, CompanyBasicService]
})
export class CompanyDetailComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  rowKey: string;
  isFollow: boolean;
  // 判断一级菜单是否选中
  showIndustryMenusControl = '';
  constructor(
    private routeInfo: ActivatedRoute,
    private router: Router,
    private companyDetailService: CompanyDetailService,
    private companyBasicService: CompanyBasicService,
    private microcomicService: MicrocosmicService,
    private store: Store<Amap>
  ) { }

  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });

    this.subscription = this.microcomicService.getCompanyName()
      .subscribe(res => {
        console.log('CompanyName ==============>', res.companyName);
        this.rowKey = res.companyName;
        /*避免在企业详情里刷新出错*/
        /*if (this.router.url.indexOf('/basic/') < 0 && this.router.url.indexOf('/basic') > -1) {
          // this.router.navigate(['/mic/companyDetail/basic/company-profile', this.rowKey]);
          this.router.navigate(['/mic/companyDetail/basic/company-profile'], {
            queryParams: {
              name: this.rowKey
            }
          });
        }*/
        // this.getBaseInfo(res.companyName);
      });
  }

  notFollow() {
    const params: AttentionParams = { rowkey: 'test1', type: '' };
    params.type = this.isFollow ? 'unsubscribe' : 'attention';
    this.companyDetailService.attentionOrUnsubscribe(params)
      .subscribe(res => {
        console.log('关注与取关', res);
        this.isFollow = !this.isFollow;
      });
  }

  getBaseInfo(name) {
    console.log(name);
    this.companyBasicService.getCompanyDetail(name)
      .subscribe(res => {
        this.isFollow = res.data.focusOfAttention;
      });
  }

  showIndustryMenus(flag: string) {
    this.showIndustryMenusControl = this.showIndustryMenusControl === flag ? '' : flag;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
