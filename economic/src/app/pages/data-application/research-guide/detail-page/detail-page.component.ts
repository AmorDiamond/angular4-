import { Component, OnInit, OnDestroy } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic/microcosmic.service';
import { CHANGE } from '../../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../../core/container-ngrx/container.model';
import { Store } from '@ngrx/store';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { DataApplicationService } from '../../data-application.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit, OnDestroy {

  constructor(
    private microcomicService: MicrocosmicService,
    private store: Store<ContainerStyle>,
    private toastModalService: ToastModalService,
  private dataApplicationService: DataApplicationService,
  ) { }
  detaileData = {};
  isMeridian = false;
  showSpinners = true;
  companyName: any;
  downLoadName = '调查问卷';
  selectedList: any = [];
  localList: any = [];
  editAddressInfo = '';
  editAddressStatus = false;
  editAddressId: any;
  startResearchTime: any;
  endResearchTime: any;
  startWorkerTime: any;
  endWorkerTime: any;
  backGroupTime: any;
  timeoutFn: any;
  /*用于判断调研开始时间有改动重新渲染列表，已达到更新列表时间控件的初始化*/
  changeResearchTimeStatus = false;
  ngOnInit() {
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '93%'
      }
    });
    const todayTime = new Date();
    const todayDate = todayTime.getFullYear() + '-' + (todayTime.getMonth() + 1) + '-' + todayTime.getDate();
    this.startWorkerTime = new Date(todayDate).getTime() + 33 * 60 * 60 * 1000; // 第二天早上九点
    this.endWorkerTime = new Date(todayDate).getTime() + 41 * 60 * 60 * 1000; // 第二天下午五点
    this.startResearchTime = new Date(todayDate).getTime() + 33 * 60 * 60 * 1000;
    this.companyName = this.microcomicService.getUrlParams('name');
    this.downLoadName = this.companyName + '调查问卷';
    const selectedList = this.dataApplicationService.getSelectedList();
    this.localList = selectedList;
    this.getDetailData(selectedList);
  }
  ngOnDestroy() {
    clearTimeout(this.timeoutFn);
  }
  /*获取详细数据*/
  getDetailData(selectedList) {
    const params = {lists: []};
    selectedList.forEach(item => {
      params.lists.push(item.company.rowKey);
    });
    this.dataApplicationService.requestByParams(params, 'bestRouteUrl', 'post').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        const list = res.data;
        for (let i = 0; i < list.length; i++) {
          if (list[i].name === '成都高新区管委会') {
            /*不管是否存在无法识别地址的企业都将管委会放置最后*/
            list.push(list.splice(i, 1)[0]);
            break;
          }
        }
        list.forEach(item => {
          if (!item.referenceTime) {
            /*1、给地址匹配不到的企业设置错误地址标识*/
            /*2、默认给地址匹配不到的企业设置行程时间60分钟*/
            /*3、存在有无法识别地址时回管委会时间设置为60分钟*/
            /*4、将管委会后面的企业order减1*/
            item.errorAddress = true;
            item.referenceTime = 60;
            list[list.length - 1].referenceTime = 60;
            item.order = item.order - 1;
          }
        });
        this.backGroupTime = list.splice(list.length - 1, 1)[0].referenceTime * 60 * 1000; // 返回管委会所需时间
        this.selectedList = list;
        console.log(this.selectedList)
        this.initformatTimes();
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*初始化处理列表时间*/
  initformatTimes() {
    const len = this.selectedList.length;
    for (let i = 0; i < len; i++) {
      if (i === 0) {
        this.selectedList[i].startDate = this.startResearchTime + this.selectedList[i].referenceTime * 60 * 1000; // 开始时间+行车时间
        this.selectedList[i].endDate = this.selectedList[i].startDate + 30 * 60 * 1000; // 默认调研时间30分钟
      }else {
        this.selectedList[i].startDate = this.selectedList[i - 1].endDate + this.selectedList[i].referenceTime * 60 * 1000;
        this.selectedList[i].endDate = this.selectedList[i].startDate + 30 * 60 * 1000; // 默认调研时间30分钟
      }
      /*处理企业的行业类型*/
      for (let j = 0; j < this.localList.length; j++) {
        if (this.selectedList[i].name === this.localList[j].name) {
          this.selectedList[i].industryType = this.localList[j].industryType.replace(/[^\u4e00-\u9fa5]/gi, '');
        }
      }
    }
    this.endResearchTime = this.selectedList[this.selectedList.length - 1].endDate + this.backGroupTime;
  }
  /*上下移动和删除处理列表时间*/
  moveFormatTimes() {
    const len = this.selectedList.length;
    for (let i = 0; i < len; i++) {
      this.selectedList[i + 1].startDate = this.selectedList[i].endDate + this.selectedList[i].referenceTime * 60 * 1000;
      this.selectedList[i + 1].endDate = this.selectedList[i].startDate + 30 * 60 * 1000; // 默认调研时间30分钟
    }
  }
  /*上下移动处理列表时间*/
  changeTimeFormatTimes() {
    /*重新渲染列表*/
    this.handleAfterLoad();
    const len = this.selectedList.length;
    for (let i = 0; i < len - 1; i++) {
      /*如果下一家企业调研开始时间不合理则重新处理*/
      if (this.selectedList[i + 1].startDate <= this.selectedList[i].endDate + this.selectedList[i + 1].referenceTime * 60 * 1000) {
        this.selectedList[i + 1].startDate = this.selectedList[i].endDate + this.selectedList[i + 1].referenceTime * 60 * 1000;
        /*如果下一家企业调研结束时间不合理则重新处理*/
        if (this.selectedList[i + 1].endDate <= this.selectedList[i + 1].startDate) {
          this.selectedList[i + 1].endDate = this.selectedList[i + 1].startDate + 30 * 60 * 1000; // 默认调研时间30分钟
        }
      }
    }
    this.endResearchTime = this.selectedList[this.selectedList.length - 1].endDate + this.backGroupTime;
    if (this.selectedList[len - 1].endDate > this.endWorkerTime) {
      this.toastModalService.addToasts({tipsMsg: '调研时间超过当天工作时间，请调整！', type: 'warning', timeout: 3000});
    }
    if (this.selectedList[0].startDate < this.startWorkerTime) {
      this.toastModalService.addToasts({tipsMsg: '调研时间不在当天工作时间，请调整！', type: 'warning', timeout: 3000});
    }
    /*延迟更新状态，避免页面不更新*/
    this.loadAfterView();
  }
  /*删除处理时间*/
  removeFormatTimes(index) {
    /*重新渲染列表*/
    this.handleAfterLoad();
    const len = this.selectedList.length;
    for (let i = index; i < len; i++) {
      if (i === 0) {
        this.selectedList[i].startDate = this.startResearchTime + this.selectedList[i].referenceTime * 60 * 1000; // 开始时间+行车时间
        this.selectedList[i].endDate = this.selectedList[i].startDate + 30 * 60 * 1000; // 默认调研时间30分钟
      }else {
        this.selectedList[i].startDate = this.selectedList[i - 1].endDate + this.selectedList[i].referenceTime * 60 * 1000;
        this.selectedList[i].endDate = this.selectedList[i].startDate + 30 * 60 * 1000; // 默认调研时间30分钟
      }
    }
    this.endResearchTime = this.selectedList[this.selectedList.length - 1].endDate + this.backGroupTime;
    /*延迟更新状态，避免页面不更新*/
    this.loadAfterView();
  }
  /*改变列表时间触发事件*/
  changeTime(event, index, dateType) {
    const newTime = new Date(event).getTime();
    const oldTime = this.selectedList[index][dateType];
    if (newTime === oldTime) {
      return;
    }
    if (newTime < this.startResearchTime) {
      this.toastModalService.addToasts({tipsMsg: '所选时间不在工作时间，请重新选择！', type: 'warning', timeout: 3000});
      return;
    }
    if (newTime > this.endWorkerTime) {
      this.toastModalService.addToasts({tipsMsg: '所选时间不在工作时间，请重新选择！', type: 'warning', timeout: 3000});
      return;
    }
    if (dateType === 'startDate' && index > 0) {
      if (newTime < this.selectedList[index - 1].endDate + this.selectedList[index].referenceTime * 60 * 1000) {
        this.toastModalService.addToasts({tipsMsg: '时间小于上一家公司结束时间加行程时间！', type: 'warning', timeout: 3000});
        return;
      }
    }
    this.selectedList[index][dateType] = new Date(event).getTime();
    if (dateType === 'startDate') {
      if (newTime >= this.selectedList[index].endDate) {
        this.selectedList[index].endDate = this.selectedList[index].startDate + 30 * 60 * 1000;
        this.changeTimeFormatTimes();
      }
    }
    if (dateType === 'endDate') {
      this.changeTimeFormatTimes();
    }
  }
  /*改变调研乘车出发时间触发事件*/
  changeStartResearchTime(event) {
    // const newTime = new Date(event).getTime();
    const newTime = new Date(event);
    const chooseTime = new Date(event).getTime();
    const todayDate = newTime.getFullYear() + '-' + (newTime.getMonth() + 1) + '-' + newTime.getDate();
    const startWorkerTime = new Date(todayDate).getTime() + 9 * 60 * 60 * 1000; // 所选日期当天早上九点;
    const endWorkerTime = new Date(todayDate).getTime() + 17 * 60 * 60 * 1000; // 所选日期当天下午五点;
    if (chooseTime < startWorkerTime) {
      this.toastModalService.addToasts({tipsMsg: '所选时间不在工作时间，请重新选择！', type: 'warning', timeout: 3000});
      return;
    }
    if (chooseTime > endWorkerTime) {
      this.toastModalService.addToasts({tipsMsg: '所选时间不在工作时间，请重新选择！', type: 'warning', timeout: 3000});
      return;
    }
    /*重新渲染列表*/
    this.handleAfterLoad();
    this.startResearchTime = chooseTime;
    this.startWorkerTime = startWorkerTime; // 所选日期当天早上九点;
    this.endWorkerTime = endWorkerTime; // 所选日期当天下午五点;
    /*判断第一家调研开始时间是否满足乘车到公司时间*/
    /*const firstResearchTime = this.startResearchTime + this.selectedList[0].referenceTime * 60 * 1000;
    if (this.selectedList[0].startDate < firstResearchTime) {
      this.selectedList[0].startDate = firstResearchTime;
      /!*再次判断第一家的结束时间是否不合理，不合理设置为默认调研时间30分钟*!/
      if (this.selectedList[0].endDate < this.selectedList[0].startDate) {
        this.selectedList[0].endDate = this.selectedList[0].startDate + 30 * 60 * 1000;
      }
      this.changeTimeFormatTimes();
    }*/
    /*重新初始化时间*/
    this.initformatTimes();
    /*延迟更新状态，避免页面不更新*/
    this.loadAfterView();
  }
  /*修改地址*/
  editAddress(id, index) {
    this.editAddressStatus = true;
    this.editAddressId = id;
    this.editAddressInfo = this.selectedList[index].address;
  }
  /*提交地址的修改*/
  saveAddress(index) {
    this.editAddressInfo = this.editAddressInfo.trim();
    if (!this.editAddressInfo || this.selectedList[index].address === this.editAddressInfo) {
      return;
    }
    /*给修改了不能识别地址的企业添加标识*/
    if (this.selectedList[index].errorAddress) {
      this.selectedList[index].hasEditAddress = true;
    }
    const params = {rowKey: this.editAddressId, newAddress: this.editAddressInfo};
    this.dataApplicationService.requestByParams(params, 'editAddressUrl', 'post').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.selectedList[index].address = this.editAddressInfo.trim();
        this.toastModalService.addToasts({tipsMsg: '修改成功！', type: 'success'});
        this.editAddressId = '';
        this.editAddressStatus = false;
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });

  }
  /*上移下移操作*/
  prevNextMove(type, index) {
    if (type === 'prev') {
      this.prevMove(this.selectedList, index);
    }else if (type === 'next') {
      this.nextMove(this.selectedList, index);
    }
  }
  /*移除操作*/
  removeCompany(index) {
    this.selectedList.splice(index, 1);
    this.removeFormatTimes(index);
  }
  /*交换数组元素*/
  swapArrayElements(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }
  /*上移*/
  prevMove(arr, $index) {
    if ($index === 0) {
      return;
    }
    this.swapArrayElements(arr, $index, $index - 1);
    this.changeTimeFormatTimes();
  }
  /*下移*/
  nextMove(arr, $index) {
    if ($index === arr.length - 1) {
      return;
    }
    this.swapArrayElements(arr, $index, $index + 1);
    this.changeTimeFormatTimes();
  }
  /*操作后处理渲染*/
  handleAfterLoad() {
    this.changeResearchTimeStatus = true;
    this.store.dispatch({
      type: CHANGE,
      payload: {
        show: true
      }
    });
  }
  /*处理完操作后显示信息*/
  loadAfterView() {
    this.timeoutFn = setTimeout(() => {
      this.changeResearchTimeStatus = false;
      this.store.dispatch({
        type: CHANGE,
        payload: {
          show: false
        }
      });
    }, 100);
  }
  /*下载操作*/
  downLoad() {
    const researchTime = new Date(this.startResearchTime);
    const year = researchTime.getFullYear();
    const month = researchTime.getMonth() + 1;
    const day = researchTime.getDate();
    const startHour = researchTime.getHours() < 10 ? '0' + researchTime.getHours() : researchTime.getHours();
    const startMin = researchTime.getMinutes() < 10 ? '0' + researchTime.getMinutes() : researchTime.getMinutes();
    const lastCompanyEndTime = new Date(this.selectedList[this.selectedList.length - 1].endDate + this.backGroupTime);
    const endHour = lastCompanyEndTime.getHours() < 10 ? '0' + lastCompanyEndTime.getHours() : lastCompanyEndTime.getHours();
    const endMin = lastCompanyEndTime.getMinutes() < 10 ? '0' + lastCompanyEndTime.getMinutes() : lastCompanyEndTime.getMinutes();
    const params = {list: [], wordMap: {title: '', year: year, month: month, day: day, startTime: startHour + ':' + startMin, endTime:  endHour + ':' + endMin}};
    const todayTime = new Date();
    for (let i = 0; i < this.selectedList.length; i++) {
      const res = this.selectedList[i];
      /*判断是否存在不能识别地址的未修改*/
      if (res.errorAddress && !res.hasEditAddress) {
        this.toastModalService.addToasts({tipsMsg: '存在不能识别的地址，请修改或删除！', type: 'warning', timeout: 3000});
        return;
      }
      params.list.push({
        order: res.order,
        name: res.name,
        startDate: res.startDate,
        endDate: res.endDate,
        address: res.address,
        referenceTime: res.referenceTime,
        researchTime: 30,
      });
    }
    /*this.dataApplicationService.downLoadFile(params, 'downLoadBestRouteUrl', 'post').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.toastModalService.addToasts({tipsMsg: '下载完成！', type: 'success', timeout: 3000});
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });*/
    const todayDate = todayTime.getFullYear() + '-' + (todayTime.getMonth() + 1) + '-' + todayTime.getDate();
    this.dataApplicationService.export(params, '调研计划向导' + todayDate, 'application/msword');
  }
}
