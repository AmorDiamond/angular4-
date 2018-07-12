import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContainerStyle } from '../../../core/container-ngrx/container.model';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { LayoutService, SearchResponse, SearchParams } from '../../layout/layout.service';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { MicrocosmicService } from '../microcosmic.service';
import { ActivatedRoute, Params } from '@angular/router';

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
  enterpriseTypes = [];
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
    enterpriseType: '',
    page: 0,
    size: 20
  };
  constructor(
    private domSanitizer: DomSanitizer,
    private routerInfo: ActivatedRoute,
    private layoutService: LayoutService,
    private microcosmicService: MicrocosmicService,
    private store: Store<ContainerStyle>) {
    this.store.select('container');
  }

  ngOnInit() {
    this.subscription = this.layoutService.getSubject()
      .subscribe((res) => {
        if (!res) {
          this.routerInfo.params.subscribe((params: Params) => {
            this.searchParams.keyWord = params['name'];
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
        this.selectType = res.data.ohterSearchMap.enterpriseType;
        /*while (this.canPushEnterpriseTypes) {
            console.log(123, this.canPushEnterpriseTypes)
          const Types = res.data.enterpriseTypes;
          this.enterpriseTypesNumber = Types;
          for (const key in Types) {
            if (Types.hasOwnProperty(key)) {
              that.enterpriseTypes.push(key);
            }
          }
          this.canPushEnterpriseTypes = false;
        }*/
      });
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '640px'
      }
    });
  }

  search() {
    console.log('searchParams==========>\n', this.searchParams);
    this.layoutService.search(this.searchParams);
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
    this.searchParams.enterpriseType = enterpriseType;
    this.searchParams.page = 0;
    this.search();
  }

  consolePage(page: number) {
    console.log(`from pagination component =========> ${page}`);
    this.searchParams.page = page - 1;
    this.search();
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    console.log('COMPANY LIST ON DESTROY++++++++++++');
    this.subscription.unsubscribe();
  }

}
