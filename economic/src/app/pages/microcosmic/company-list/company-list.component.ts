import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ContainerStyle } from '../../../core/container-ngrx/container.model';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { LayoutService, SearchResponse, SearchParams } from '../../layout/layout.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { MicrocosmicService } from '../microcosmic.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Amap } from '../../../core/amap-ngrx/amap.model';
import { ADD_COMPANY_ADDRESS } from '../../../core/amap-ngrx/amap.actions';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit, OnDestroy {

  hasLoading = false;
  subscription: Subscription;
  keyWord = '';
  companys: any;
  industryTypeList = [];
  // 分页参数
  pageParam: any;
  // 当前分类是否选中
  enterpriseTypeActive = {};
  // 产业分类的数两
  enterpriseTypesNumber: any;
  // 筛选的分类
  selectType: any;
  // 能不能push产业分类，因为选择了分类过后传回来的分类只有一个了
  canPushEnterpriseTypes = true;
  // 搜索的参数
  searchParams: SearchParams = {
    keyWord: '',
    industryType: '',
    page: 0,
    size: 20
  };
  pageParams = {
    total: ''
  }
  private searchUrl = 'assets/jsonData/epBaseInfoPojo/listCompanysPage.json';
  constructor(
    private domSanitizer: DomSanitizer,
    private routerInfo: ActivatedRoute,
    private layoutService: LayoutService,
    private microcosmicService: MicrocosmicService,
    private http: HttpClient,
    private store: Store<ContainerStyle>,
    private storeAmap: Store<Amap>,
    private router: Router,
    ) {
    this.store.pipe(select('container'));
    this.storeAmap.pipe(select('amap'));
  }

  ngOnInit() {
    /*避免五搜索记录从数据应用过来的返回*/
    if (!localStorage.getItem('searchName')) {
      this.routerInfo.params.subscribe((params: Params) => {
        this.searchParams.keyWord = params['name'];
        this.keyWord = this.searchParams.keyWord;
        this.searchParams.page = 0;
        this.searchParams.industryType = '';
        this.search(true);
      });
    }else {
      this.routerInfo.params.subscribe((params: Params) => {
        this.searchParams.keyWord = params['name'];
        this.keyWord = this.searchParams.keyWord;
        this.searchParams.page = 0;
        this.searchParams.industryType = '';
        this.search();
      });
    }
    /*this.subscription = this.layoutService.getSubject()
      .subscribe((res) => {
        if (!res) {
          this.routerInfo.params.subscribe((params: Params) => {
            this.searchParams.keyWord = params['name'];
            this.companys = [];
            this.search();
          });
          return false;
        }

        this.enterpriseTypes = this.layoutService.getTypeList().list;
        this.enterpriseTypesNumber = this.layoutService.getTypeList().num;


        const that = this;
        this.pageParam = res.data.pageParam;
        this.keyWord = res.data.keyWord;
        this.searchParams.keyWord = this.keyWord;
        this.companys = res.data.companys;
        this.selectType = res.data.ohterSearchMap.industryType;
        /!*while (this.canPushEnterpriseTypes) {
            console.log(123, this.canPushEnterpriseTypes)
          const Types = res.data.enterpriseTypes;
          this.enterpriseTypesNumber = Types;
          for (const key in Types) {
            if (Types.hasOwnProperty(key)) {
              that.enterpriseTypes.push(key);
            }
          }
          this.canPushEnterpriseTypes = false;
        }*!/
        this.companys.forEach(item => {
          if (item.coordinate) {
            console.log('搜索列表监听', item);
          }
        });
      });*/
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '640px'
      }
    });
  }

  search(typeSearch?) {
    if (!typeSearch) {
      this.industryTypeList = [];
    }
    console.log('searchParams==========>\n', this.searchParams);
    let paramsString = '';
    const SearchParams = this.searchParams;
    for (const key in SearchParams) {
      if (SearchParams.hasOwnProperty(key)) {
        paramsString += SearchParams[key] ? `${key}=${SearchParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    this.http.get(this.searchUrl, { params }).subscribe((res: any) => {
      console.log(res)
      if (res.responseCode === '_200') {
        const data = res.data;
        this.pageParams.total = data.pageParam.total;
        if (this.industryTypeList.length < 1) {
          for (const item in data.industryType) {
            if (item) {
              this.industryTypeList.push({industryType: item, number: data.industryType[item]});
            }
          }
        }
        this.companys = data.companys && data.companys.length > 0 ? data.companys : [];
        this.selectType = data.ohterSearchMap.industryType;
        this.pageParam = data.pageParam;
        const companysAddress = [];
        this.companys.forEach(item => {
          if (item.company.coordinate && item.company.coordinate.split(',')[1]) {
            companysAddress.push({id: item.company.rowKey, company: item.company.name, address: item.company.coordinate})
          }
        });
        this.storeAmap.dispatch({
          type: ADD_COMPANY_ADDRESS,
          payload: {
            action: 'ADD_COMPANY_ADDRESS',
            data: companysAddress
          }
        });
      }
    });
    // this.layoutService.search(this.searchParams);
  }
  /*查看企业详情*/
  viewCompanyData(name) {
    sessionStorage.setItem('backRouteUrl', '');
    this.router.navigate(['/mic/companyDetail/basic/company-profile'], {
      queryParams: {name: '成都国腾实业集团有限公司'}
    });
  }
  setCompanyName(companyName: string) {
    this.microcosmicService.setCompanyName(companyName);
  }

  enterpriseTypeClick(enterpriseType?: string) {
    for (const key in this.enterpriseTypeActive) {
      if (this.enterpriseTypeActive.hasOwnProperty(key)) {
        this.enterpriseTypeActive[key] = false;
      }
    }
    this.enterpriseTypeActive[enterpriseType] = true;
    this.searchParams.industryType = enterpriseType;
    this.searchParams.page = 0;
    this.search(true);
  }

  consolePage(page: number) {
    console.log(`from pagination component =========> ${page}`);
    this.companys = [];
    this.searchParams.page = page - 1;
    this.search(true);
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    console.log('COMPANY LIST ON DESTROY++++++++++++');
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
