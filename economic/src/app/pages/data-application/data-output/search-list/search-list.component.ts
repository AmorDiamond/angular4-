import { Component, OnInit } from '@angular/core';
import { DataApplicationService } from '../../data-application.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { Store, select } from '@ngrx/store';
import { ContainerStyle } from '../../../../core/container-ngrx/container.model';
import { CHANGE } from '../../../../core/container-ngrx/container.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit {

  constructor(
    private dataApplicationService: DataApplicationService,
    private toastModalService: ToastModalService,
    private store: Store<ContainerStyle>,
    private router: Router,
  ) {
    this.$containerStore = store.pipe(select('container'));
  }
  $containerStore: any;
  allSelectedCompanyStatus = false;
  searchParams: any = {
    size: 30
  };
  pageParams = {
    maxSize: 5,
    itemsPerPage: this.searchParams.size,
    bigTotalItems: 10,
    bigCurrentPage: 1,
    numPages: 0
  };
  companyList = [];
  ngOnInit() {
    this.$containerStore.dispatch({
      type: CHANGE,
      payload: {
        width: '93%'
      }
    });
    this.searchParams = this.dataApplicationService.getOutputSearchParams();

    if (this.searchParams) {
      this.search();
    }else {
      this.router.navigate(['/dataApplication/dataOutput']);
    }
  }

  /*去企业详情*/
  viewCompanyData(name) {
    sessionStorage.setItem('backRouteUrl', '/dataApplication/outputList');
    this.router.navigate(['/mic/companyDetail/basic/company-profile'], {
      queryParams: {
        name: name
      }
    });
  }
  /*获取企业列表*/
  search() {
    this.companyList = [];
    this.dataApplicationService.requestByParams(this.searchParams, 'getCompanysByTypesUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        this.companyList = res.data.content;
        this.companyList.forEach(item => {
          if (item.employees) {
            item.employees.forEach(employeItem => {
              if (employeItem.dataSupplyTime === this.searchParams.year) {
                item.peopleNumber = Number(employeItem.employees).toFixed(2);
              }
            });
          }
          if (item.incometaxs) {
            item.incometaxs.forEach(incometaxItem => {
              if (incometaxItem.dataSupplyTime === this.searchParams.year) {
                item.taxNumber = Number(incometaxItem.totalActualTax).toFixed(2);
              }
            });
          }
          if (item.industrialoutputs) {
            item.industrialoutputs.forEach(outputItem => {
              if (outputItem.dataSupplyTime === this.searchParams.year) {
                item.incomeNumber = Number(outputItem.operatingIncome).toFixed(2);
              }
            });
          }
          if (item.energyConsumptions) {
            item.energyConsumptions.forEach(energyItem => {
              if (energyItem.year === this.searchParams.year) {
                item.energyNumber = Number(energyItem.consumption).toFixed(2);
              }
            });
          }
          if (item.environmentals) {
            item.environmentals.forEach(environmentalItem => {
              if (environmentalItem.year === this.searchParams.year) {
                item.sewageNumber = (Number(environmentalItem.cod) + Number(environmentalItem.ammoniaNitrogen) + Number(environmentalItem.so2) + Number(environmentalItem.nox)).toFixed(2);
              }
            });
          }
        });
        this.pageParams.bigTotalItems = res.data.totalElements;
        setTimeout(() => {
          this.pageParams.bigCurrentPage = this.searchParams.page + 1;
        }, 0);
        if (this.companyList.length < 1) {
          this.toastModalService.addToasts({tipsMsg: '暂无信息！', type: 'info'});
        }
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
      }
    });
  }
  /*保存选择的企业去下载数据*/
  goToDownloadPage() {
    const selectedCompanys = [];
    this.companyList.forEach(item => {
      if (item.hasSelected) {
        selectedCompanys.push(item);
      }
    });
    if (selectedCompanys.length < 1) {
      this.toastModalService.addToasts({tipsMsg: '请选择需要导出数据的企业！', type: 'warning', timeout: 2000});
      return;
    }
    this.dataApplicationService.changeSelectedList(selectedCompanys);
    this.router.navigate(['/dataApplication/dataOutput/outputPage']);
  }

  /*翻页搜索*/
  pageChanged($event) {
    this.searchParams.page = $event.page - 1;
    this.search();
  }
  /*单独选中企业后处理事件*/
  singleSelectedCompany() {
    let allSelectedCompany = true;
    for (let i = 0; i < this.companyList.length; i++) {
      if (!this.companyList[i].hasSelected) {
        allSelectedCompany = false;
        break;
      }
    }
    this.allSelectedCompanyStatus = allSelectedCompany;
  }
  /*全选企业列表操作*/
  allSelectedCompany() {
    if (this.allSelectedCompanyStatus) {
      this.companyList.forEach(item => {
        if (!item.hasSelected) {
          item.hasSelected = true;
        }
      });
    }else {
      this.companyList.forEach(item => {
        if (item.hasSelected) {
          item.hasSelected = false;
        }
      });
    }

  }
}
