import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ADDENTERPRISEMARK } from "../../../core/map-store/map.actions";
import { Store, select } from '@ngrx/store';
import { MapStore } from "../../../core/map-store/map.model";
import { DataRequestService} from "../../../core/http/data-request.service";

@Component({
  selector: 'app-enterprise-list',
  templateUrl: './enterprise-list.component.html',
  styleUrls: ['./enterprise-list.component.css']
})
export class EnterpriseListComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private http: HttpClient,
    private store: Store<MapStore>,
    private dataRequestService: DataRequestService
  ) {
    this.mapStore$ = this.store.pipe(select('map'));
  }
  areaParkName: any;
  enterpriseList: Array<any> = [];
  enterpriseListAll: Array<any> = [];
  enterpriseListAllPages: Array<any> = [];
  enterpriseTotal: any;
  mapStore$: any;
  enterpriseMarks = {};
  requestParams: any = {
    name: '',
    page: 0,
    size: 50,
    wa: false, // 是否高企
    technology: false, // 是否科技型企业
    doubleCreation: false, // 是否双创企业
    seed: false, // 是否种子企业
    gazelle: false, // 是否瞪羚企业
    unicorn: false // 是否独角兽企业
  };
  paginationParams = {
    currentPage: 1,
    itemsPerPage: this.requestParams.size,
    totalPages: 10,
    maxSize: 5,
    totalItems: 0
  };
  enterpriseMark: any;
  searchActive = false;
  searchWord = '';
  showSearch = true;
  scrollToTop = false;
  @HostListener('click', ['$event.target'])
  onClick(Element: HTMLElement) {
     // 点击搜索以外的区域关闭搜索层
    if (this.searchActive) {
      this.searchWord = '';
      this.searchActive = false;
    }
  }
  ngOnInit() {
    this.enterpriseMarks = this.dataRequestService.getEnterpriseMarks();
    this.routerInfo.params.subscribe(res => {
      if (res.name) {
        const router = this.router.url.split('/')[1];
        this.enterpriseMark = this.enterpriseMarks[router];
        this.areaParkName = res.name;

        if (this.areaParkName === '孵化器' || this.areaParkName === '科技中介机构' || this.areaParkName === '公共技术平台') {
          this.getEnterpriseListAll();
        } else {
          this.getEnterpriseList();
        }
      }
    });
  }
  getEnterpriseList () {
    this.scrollToTop = true;
    let url;
    if (this.areaParkName === '孵化器') {
      url = 'incubatorListUrl';
    } else if (this.areaParkName === '科技中介机构') {
      url = 'technologyIntermediaryUrl';
    } else if (this.areaParkName === '科技型企业') {
      url = 'enterpriseListUrl';
      this.requestParams.technology = true;
    } else if (this.areaParkName === '双创企业') {
      url = 'enterpriseListUrl';
      this.requestParams.doubleCreation = true;
    } else if (this.areaParkName === '种子企业') {
      url = 'enterpriseListUrl';
      this.requestParams.seed = true;
    } else if (this.areaParkName === '瞪羚企业') {
      url = 'enterpriseListUrl';
      this.requestParams.gazelle = true;
    } else if (this.areaParkName === '独角兽企业') {
      url = 'enterpriseListUrl';
      this.requestParams.unicorn = true;
    } else if (this.areaParkName === '公共技术平台') {
      url = 'technologyPlatformUrl';
    } else if (this.areaParkName === '高新西区' || this.areaParkName === '高新南区' || this.areaParkName === '高新东区' || this.areaParkName === '天府国际生物城') {
      url = 'getCompanyByLandUrl';
      this.requestParams.landName = this.areaParkName;
      this.showSearch = false;
    }
    this.dataRequestService.httpRequest(url, 'get', this.requestParams).subscribe(res => {
      if (res.responseCode === '_200') {
        this.enterpriseList = res.data.content;
        this.enterpriseTotal = res.data.totalElements;
        this.paginationParams.totalItems = res.data.totalElements;
        this.paginationParams.totalPages = res.data.totalPages;
        this.enterpriseList.forEach(item => {
          item.prefixName = item.name.slice(0, 2);
          item.position = item.coordinate ? item.coordinate.split(',') : null;
        });
        console.log(this.enterpriseList)
        this.mapStore$.dispatch({
          type: ADDENTERPRISEMARK,
          payload: {
            data: {type: ADDENTERPRISEMARK, img: this.enterpriseMark, options: this.enterpriseList}
          }
        })
      }
    });
  }
  getEnterpriseListAll () {
    this.enterpriseListAllPages = [];
    this.scrollToTop = true;
    this.requestParams.size = null;
    let url;
    if (this.areaParkName === '孵化器') {
      url = 'incubatorListUrl';
    } else if (this.areaParkName === '科技中介机构') {
      url = 'technologyIntermediaryUrl';
    } else if (this.areaParkName === '公共技术平台') {
      url = 'technologyPlatformUrl';
    }
    this.dataRequestService.httpRequest(url, 'get', this.requestParams).subscribe(res => {
      if (res.responseCode === '_200') {
        this.enterpriseListAll = res.data;
        this.enterpriseTotal = res.data.length;
        this.paginationParams.totalItems = this.enterpriseTotal;
        this.paginationParams.totalPages = Math.ceil(this.enterpriseTotal / this.paginationParams.itemsPerPage);
        // 处理数据进行分页储存
        if (this.paginationParams.totalPages) {
          for(let i = 0 ; i < this.paginationParams.totalPages; i++){
            this.enterpriseListAllPages.push(res.data.slice(i*this.paginationParams.itemsPerPage,i*this.paginationParams.itemsPerPage+this.paginationParams.itemsPerPage))
          }
        }

        this.enterpriseList = this.enterpriseListAllPages[0] ? this.enterpriseListAllPages[0] : [];
        this.enterpriseListAll.forEach(item => {
          item.prefixName = item.name.slice(0, 2);
          item.position = item.coordinate ? item.coordinate.split(',') : null;
        });
        this.mapStore$.dispatch({
          type: ADDENTERPRISEMARK,
          payload: {
            data: {type: ADDENTERPRISEMARK, img: this.enterpriseMark, options: this.enterpriseListAll}
          }
        })
      }
    });
  }
  /*处理所有数据进行分页*/
  pageHandleForAll () {
    this.scrollToTop = true;
    this.enterpriseList = this.enterpriseListAllPages[this.requestParams.page];
  }
  changePage (event) {
    console.log('changePage', event)
    this.requestParams.page = event - 1;
    if (this.areaParkName === '孵化器' || this.areaParkName === '科技中介机构' || this.areaParkName === '公共技术平台') {
      this.pageHandleForAll();
    } else {
      this.getEnterpriseList();
    }
  }
  searchHandle (event) {
    event.stopPropagation();
    this.searchActive = true;
    if (this.searchWord.trim() && this.searchActive) {
      this.requestParams.name = this.searchWord;
      this.requestParams.page = 0;
      // 使用的ngModel双向绑定currentPage数据，重新获取数据需要重置，避免分页显示bug
      this.paginationParams.currentPage = 1;

      if (this.areaParkName === '孵化器' || this.areaParkName === '科技中介机构' || this.areaParkName === '公共技术平台') {
        this.getEnterpriseListAll();
      } else {
        this.getEnterpriseList();
      }
      this.searchWord = '';
      this.searchActive = false;
    } else {}
  }
}
