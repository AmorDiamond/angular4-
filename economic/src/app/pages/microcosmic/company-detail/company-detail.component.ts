import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Amap } from '../../../core/amap-ngrx/amap.model';
import { Store } from '@ngrx/store';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { MicrocosmicService } from '../microcosmic.service';
import { Subscription } from 'rxjs/Subscription';
import { CompanyDetailService, AttentionParams } from './company-detail.service';
import { CompanyBasicService } from './company-basic-info/company-basic.service';
import { ToastModalService } from '../../../shared/toast-modal/toast-modal.service';
import { ADD_COMPANY_ADDRESS } from '../../../core/amap-ngrx/amap.actions';
import { ContainerStyle } from '../../../core/container-ngrx/container.model';

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
  /*搜索的关键字*/
  searchName: any;
  // 判断一级菜单是否选中
  showIndustryMenusControl = '';
  /*返回路由*/
  backRouterUrl = '/mic/companyList';
  constructor(
    private routeInfo: ActivatedRoute,
    private router: Router,
    private companyDetailService: CompanyDetailService,
    private companyBasicService: CompanyBasicService,
    private microcomicService: MicrocosmicService,
    private toastModalService: ToastModalService,
    private store: Store<ContainerStyle>,
    private storeAmap: Store<Amap>
  ) { }

  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
    /*避免刷新不展开一级菜单*/
    const visitUrl = this.router.url.slice(this.router.url.indexOf('companyDetail/') + 'companyDetail/'.length);
    let nowVisitPage;
    nowVisitPage = visitUrl.indexOf('/') > 0 ? visitUrl.slice(0, visitUrl.indexOf('/')) : visitUrl.slice(0, visitUrl.indexOf('?'));
    console.log(nowVisitPage);
    switch (nowVisitPage) {
      case 'basic':
        this.showIndustryMenusControl = 'basic';
        break;
      case 'qualifications':
        this.showIndustryMenusControl = 'qualifications';
        break;
      case 'credit':
        this.showIndustryMenusControl = 'credit';
        break;
      case 'assets':
        this.showIndustryMenusControl = 'assets';
        break;
      case 'economicIndicators':
        this.showIndustryMenusControl = 'economicIndicators';
        break;
      case 'overview':
        this.showIndustryMenusControl = 'overview';
        break;
    }
    this.rowKey = this.microcomicService.getUrlParams('name');
    /*获取储存的搜索关键字用于从详情返回*/
    this.searchName = localStorage.getItem('searchName') ? localStorage.getItem('searchName') : this.rowKey;
    const backRouterUrl = sessionStorage.getItem('backRouteUrl');
    if (backRouterUrl) {
      this.backRouterUrl = backRouterUrl;
      if (this.backRouterUrl !== '/mic/companyList') {
        this.searchName = '';
      }
    }
    console.log('this.backRouterUrl', this.backRouterUrl);
    this.getBaseInfo(this.rowKey);
    /*this.subscription = this.microcomicService.getCompanyName()
      .subscribe(res => {
        console.log('CompanyName ==============>', res.companyName);
        this.rowKey = res.companyName;
        /!*避免在企业详情里刷新出错*!/
        /!*if (this.router.url.indexOf('/basic/') < 0 && this.router.url.indexOf('/basic') > -1) {
          // this.router.navigate(['/mic/companyDetail/basic/company-profile', this.rowKey]);
          this.router.navigate(['/mic/companyDetail/basic/company-profile'], {
            queryParams: {
              name: this.rowKey
            }
          });
        }*!/
        // this.getBaseInfo(res.companyName);
      });*/
  }

  notFollow() {
    const params: AttentionParams = { rowkey: this.rowKey, type: '' };
    params.type = this.isFollow ? 'unsubscribe' : 'attention';
    this.companyDetailService.attentionOrUnsubscribe(params)
      .subscribe((res: any) => {
        console.log('关注与取关', res);
        if (res.responseCode === '_200') {
          this.isFollow = !this.isFollow;
          let tipsMsg = params.type === 'attention' ? '关注成功！' : '取消关注成功！';
          this.toastModalService.showSuccessToast({tipsMsg: tipsMsg});
        }else {
          this.toastModalService.showErrorToast({errorMsg: res.errorMsg ? res.errorMsg : '关注失败！', });
        }
      });
  }

  getBaseInfo(name) {
    const loginUserId = sessionStorage.getItem('userId');
    this.companyBasicService.getCompanyProfile(name)
      .subscribe(res => {
        console.log('获取关注人', res);
        if (res.responseCode === '_200') {
          const data = res.data.baseInfoPojos;
          /*获取关注人列表里是否存在当前登录的用户*/
          const hasFollow = data.concernedPeople && data.concernedPeople.split(',').indexOf('|' + loginUserId + '|') > -1 ? true : false;
          this.isFollow = data.concernedPeople && hasFollow ? true : false;

          const company = data;
          const companysAddress = [];
          if (company.coordinate && company.coordinate.split(',')[1]) {
            companysAddress.push({id: company.rowKey, company: company.name, address: company.coordinate})
          }
          this.storeAmap.dispatch({
            type: ADD_COMPANY_ADDRESS,
            payload: {
              action: 'ADD_COMPANY_ADDRESS',
              data: companysAddress
            }
          });
        }else {
          this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
        }
      });
  }

  showIndustryMenus(flag: string) {
    this.showIndustryMenusControl = this.showIndustryMenusControl === flag ? '' : flag;
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();

    this.storeAmap.dispatch({
      type: ADD_COMPANY_ADDRESS,
      payload: {
        action: 'ADD_COMPANY_ADDRESS',
        data: []
      }
    })
  }

}
