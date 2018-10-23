import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { Store } from '@ngrx/store';
import { ContainerStyle } from '../../../core/container-ngrx/container.model';
import { DataApplicationService } from '../data-application.service';
import { ToastModalService } from '../../../shared/toast-modal/toast-modal.service';
import { LayoutService } from '../../layout/layout.service';
import { Subscription } from 'rxjs/Subscription';
import { TreeNode } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-output',
  templateUrl: './data-output.component.html',
  styleUrls: ['./data-output.component.css']
})
export class DataOutputComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<ContainerStyle>,
    private dataApplicationService: DataApplicationService,
    private toastModalService: ToastModalService,
    private layoutService: LayoutService,
    private router: Router,
  ) { }
  dataList = [];
  allSelectedStatus = false;
  downLoadData = {
    registerType: true,
    registerMoney: true,
    address: true,
    industryType: true,
    contactPeople: true,
    contactPhone: true,
    operatingIncome: true,
    taxPay: true
  };
  downLoadDataExcelName = '数据输出信息表';
  accessControlSubject: Subscription;
  hasSearch = false;
  hasDownload = false;
  searchParams = {
    industryTypeId: '',
    enterpriseTypeId: '',
    industryClassTypeId: '',
    supervisory: false,
    whetherAuthentication: false,
    whetherGazelles: false,
    enrollmentOfFundsEnum: '',
    establishDate: '',
    address: '',
    companyName: '',
    iabels: '',
    year: '',
    staffSizeEnum: '',
    incomeScaleEnum: '',
    taxScaleEnum: '',
    energyConsumptionEnum: '',
    sewageScaleEenum: '',
    page: 0,
    size: 30,
  };
  pageParams = {
    maxSize: 5,
    itemsPerPage: this.searchParams.size,
    bigTotalItems: 10,
    bigCurrentPage: 1,
    numPages: 0
  };
  /*行业类型*/
  tradeTypeList: TreeNode[];
  /*注册类型*/
  registerTypeList: TreeNode[];
  /*产业类型*/
  industryTypeList: TreeNode[];
  /*自定义标签*/
  labelLists = ['高企', '上规', '瞪羚'];
  /*注册资金枚举*/
  RegisterMoneyEnums = [];
  /*人员规模枚举*/
  StaffSizeEnums = [];
  /*营收规模枚举*/
  IncomeScaleEnums = [];
  /*税收规模枚举*/
  TaxScaleEnums = [];
  /*能耗规模枚举*/
  EnergyConsumptionEnums = [];
  /*排污规模枚举*/
  SewageScaleEenums = [];
  /*搜索的企业列表*/
  companyList = [];
  allSelectedCompanyStatus = false;
  files: TreeNode[];
  selectedRegisterTypeFile: any;
  selectedTradeTypeFile: any;
  selectedIndustryTypeFile: any;
  openRegisterTypeTree = false;
  openTradeTypeTree = false;
  openIndustryTypeTree = false;
  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
    this.getCoustomLabel();
    this.getRegisterMoneyEnums();
    this.getStaffSizeEnums();
    this.getIncomeScaleEnums();
    this.getTaxScaleEnums();
    this.getEnergyConsumptionEnums();
    this.getSewageScaleEenums();
  }
  /*获取文档的点击事件触发关闭tree弹框*/
  @HostListener('document:click', ['$event'])
  onClick ($event)  {
    this.openTradeTypeTree = false;
    this.openRegisterTypeTree = false;
    this.openIndustryTypeTree = false;
  }
  ngOnDestroy() {
    // this.accessControlSubject.unsubscribe();
  }
  /*通过条件搜索*/
  search() {
    this.searchParams.enterpriseTypeId = this.selectedRegisterTypeFile ? this.selectedRegisterTypeFile.data : '';
    this.searchParams.industryTypeId = this.selectedTradeTypeFile ? this.selectedTradeTypeFile.data : '';
    this.searchParams.industryClassTypeId = this.selectedIndustryTypeFile ? this.selectedIndustryTypeFile.data : '';
    if (this.searchParams.iabels) {
      if (this.searchParams.iabels === '高企') {
        this.searchParams.whetherAuthentication = true;
        this.searchParams.iabels = '';
      }else if (this.searchParams.iabels === '上规') {
        this.searchParams.supervisory = true;
        this.searchParams.iabels = '';
      }else if (this.searchParams.iabels === '瞪羚') {
        this.searchParams.whetherGazelles = true;
        this.searchParams.iabels = '';
      }
    }
    if (this.searchParams.staffSizeEnum || this.searchParams.incomeScaleEnum || this.searchParams.taxScaleEnum || this.searchParams.energyConsumptionEnum || this.searchParams.sewageScaleEenum) {
      if (!this.searchParams.year) {
        this.toastModalService.addToasts({tipsMsg: '请输入要查询的年份！', type: 'error'});
        return;
      }
    }
    console.log('this.searchParams', this.searchParams);
    this.dataApplicationService.changeOutputSearchParams(this.searchParams);
    this.router.navigate(['/dataApplication/outputList']);
  }
  /*获取自定义标签数据*/
  getCoustomLabel() {
    this.dataApplicationService.requestByParams({}, 'customizeLabelUrl').subscribe(res => {
      console.log('标签', res);
      if (res.responseCode === '_200') {
        const data = res.data;
        data.forEach(item => {
          this.labelLists.push(item.content);
        });
      }
    });
  }
  /*获取注册资金枚举*/
  getRegisterMoneyEnums() {
    this.dataApplicationService.requestByParams({enumsName: 'EnrollmentOfFundsEnum'}, 'getEnumsUrlEnrollmentOfFundsEnum').subscribe(res => {
      console.log('枚举', res);
      if (res.responseCode === '_200') {
        this.RegisterMoneyEnums = res.data;
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }
  /*获取人员规模枚举*/
  getStaffSizeEnums() {
    this.dataApplicationService.requestByParams({enumsName: 'StaffSizeEnum'}, 'getEnumsUrlStaffSizeEnum').subscribe(res => {
      if (res.responseCode === '_200') {
        this.StaffSizeEnums = res.data;
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }
  /*获取收入规模枚举*/
  getIncomeScaleEnums() {
    this.dataApplicationService.requestByParams({enumsName: 'IncomeScaleEnum'}, 'getEnumsUrlIncomeScaleEnum').subscribe(res => {
      if (res.responseCode === '_200') {
        this.IncomeScaleEnums = res.data;
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }
  /*获取税收规模枚举*/
  getTaxScaleEnums() {
    this.dataApplicationService.requestByParams({enumsName: 'TaxScaleEnum'}, 'getEnumsUrlTaxScaleEnum').subscribe(res => {
      if (res.responseCode === '_200') {
        this.TaxScaleEnums = res.data;
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }
  /*获取能耗规模枚举*/
  getEnergyConsumptionEnums() {
    this.dataApplicationService.requestByParams({enumsName: 'EnergyConsumptionEnum'}, 'getEnumsUrlEnergyConsumptionEnum').subscribe(res => {
      if (res.responseCode === '_200') {
        this.EnergyConsumptionEnums = res.data;
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }
  /*获取排污规模枚举*/
  getSewageScaleEenums() {
    this.dataApplicationService.requestByParams({enumsName: 'SewageScaleEenum'}, 'getEnumsUrlSewageScaleEenum').subscribe(res => {
      if (res.responseCode === '_200') {
        this.SewageScaleEenums = res.data;
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }
  /*获取树结构*/
  getTreeData(id?, parent?) {
    const params = {id: id ? id : 'registration'};
    this.dataApplicationService.requestByParams(params, 'treeTypesUrl').subscribe((res: any) => {
      console.log(res);
      const treeFormatData = [];
      const treeData = res;
      treeData.forEach(item => {
        const hasChildren = item.children ? item.children : false;
        treeFormatData.push(
          {
            'label': item.text,
            'data': item.id,
            // "formatparent": item.data ? item.data : '',
            'expandedIcon': 'fa fa-folder-open',
            'collapsedIcon': 'fa fa-folder',
            'leaf': !hasChildren // leaf为false时有下级加载
          }
        );
      });
      if (id === 1) {
        this.registerTypeList = <TreeNode[]> treeFormatData;
      }else if (id === 2) {
        this.tradeTypeList = <TreeNode[]> treeFormatData;
      }else if (id === 3) {
        this.industryTypeList = <TreeNode[]> treeFormatData;
      }
    });
  }
  /*获取具体产业类型详情/获取具体产业下属的行业类型树结构*/
  getTradeTypesTree(id) {
    const params = {industryClassTypeId: id ? id : ''};
    this.dataApplicationService.requestByParams(params, 'getIndustryTypeInfoUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        const treeFormatData = [];
        const treeData = res.data.includingIndustry;
        treeData.forEach(item => {
          const hasChildren = item.children || item.childCount > 0 ? true : false;
          treeFormatData.push(
            {
              'label': item.name,
              'data': item.id,
              // "formatparent": item.data ? item.data : '',
              'expandedIcon': 'fa fa-folder-open',
              'collapsedIcon': 'fa fa-folder',
              'leaf': !hasChildren // leaf为false时有下级加载
            }
          );
        });
        this.tradeTypeList = <TreeNode[]> treeFormatData;
      }
    });
  }

  /*获取数据组装*/
  loadNode(event) {
    if (event.node && !event.node.children) {
      // in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
      console.log(event.node);
      const id = event.node.data;
      const parent = event.node.formatparent;
      const params = {id: id ? id : 'registration'};
      this.dataApplicationService.requestByParams(params, 'treeTypesUrl').subscribe((res: any) => {
        console.log(res);
        const treeFormatData = [];
        const treeData = res;
        treeData.forEach(item => {
          const hasChildren = item.children ? item.children : false;
          treeFormatData.push(
            {
              'label': item.text,
              'data': item.id,
              // "formatparent": item.data ? item.data : '',
              'expandedIcon': 'fa fa-folder-open',
              'collapsedIcon': 'fa fa-folder',
              'leaf': !hasChildren // leaf为false时有下级加载
            }
          );
        });
        event.node.children = treeFormatData;
      });
    }
  }
  /*选择产业类型后重置行业类型数据*/
  changeTradeTypeList(event?) {
    this.tradeTypeList = null;
    this.selectedTradeTypeFile = '';
  }
  /*组装所需格式数据*/
  formatOutputData() {}
}
