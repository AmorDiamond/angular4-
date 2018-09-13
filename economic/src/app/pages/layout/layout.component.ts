import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemAnimate, CircleAnimate, ItemPositionAnimate } from '../../shared/animations';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { ContainerStyle } from '../../core/container-ngrx/container.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delay';
import { Subscription } from 'rxjs/Subscription';
import { LayoutService } from './layout.service';
import { IntermediateService } from '../intermediate/intermediate.service';
import { MicrocosmicService } from '../microcosmic/microcosmic.service';
import {ADD_MARKER_MID, ADD_POLYGON, ADD_SINGLE_POLYGON, CLEAR_MARKER} from '../../core/amap-ngrx/amap.actions';
import { Amap } from '../../core/amap-ngrx/amap.model';
declare var $: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  animations: [
    ItemAnimate,
    CircleAnimate,
    ItemPositionAnimate
  ],
  providers: []
})

export class LayoutComponent implements OnInit, OnDestroy {

  private socketSubscription: Subscription;
  private socketStatusSubscription: Subscription;

  // webSocket
  private ws: WebSocket;
  private nowMs = 10;
  // 最大重连时间间隔 /s
  private reconnectMaxTimeS = 100;
  // webSocket地址
  private addr = 'ws://127.0.0.1:1194';
  // 新闻
  news = {
    title: '',
    content: '',
  };
  isShowParkBuildBar = false;
  showTimeColorControl = {
    isShowColorsBar: false,
    isShowTime: false,
    isShowEcoTime: false,
    isShowTopTime: false,
    isShowNatureColor: false,
    isShowInefficientColor: false,
    isShowTopColor: false,
    isShowEcoColor: false,
    isShowSingleColor: false
  };
  showBuildMarkerEl = false;
  choseBuildName: any = '楼宇列表';
  choseParkName: any = '园区';
  parkNameLists: any = [];
  isShowParkNameList: any;
  getShowHideDataFn: any;
  getParkNameFn: any;
  getTimeColorControlFn: any;
  // 其他组件会改变container的样式， 所以用一个Reduce来管理
  tagState$: Observable<ContainerStyle>;
  container: ContainerStyle;
  // 搜索框是否选择状态
  isSearchActive = false;
  // 搜索的关键字
  keyWord = '';
  // 右边面板是否显示
  isRirhtPanelShow = true;
  // 三个按钮
  isCircleMenuShow = false;
  // class = curr 是否添加class
  isCircleMenuShowCopy = false;
  // item动画的状态
  animateState = 'off';
  // item位置的动画状态
  itemPosition = {
    first: 'left',
    second: 'left',
    third: 'left'
  };
  // 三个按钮的路由
  ROUTES = {
    'left': '/mac',
    'middle': '/int',
    'right': '/mic'
  };
  // 是否有新的推送消息，来控制显示隐藏
  hasNotifycation = false;
  // 消息的内容主体的显示与隐藏
  canShowNotifyContent = false;
  /*地块数据的时间显示*/
  ecoRevenueTime: any;
  ecoTopRevenueTime: any;
  /*经济排名单独类别控制*/
  ecoTopIndustry = {
    living: false,
    electron: false,
    yiqi: false,
    other: false,
    service: false
  }
  /*经济产出单独类别控制*/
  ecoOutputIndustry = {
    living: false,
    electron: false,
    yiqi: false,
    other: false,
    service: false
  }
  panelHide: boolean = false;
  PanleHideSubscription: Subscription;
  constructor(private router: Router,
    private layoutService: LayoutService,
    private intermediateService: IntermediateService,
    private microcosmicService: MicrocosmicService,
    private store: Store<ContainerStyle>,
    private storeAmap: Store<Amap>) {
    this.tagState$ = this.store.pipe(select('container'));
  }

  search() {

    /*临时隐藏微观概况面板*/
    this.microcosmicService.changePanleHide(false);
    /*将搜索的关键字储存用于详情页返回列表页*/
    localStorage.setItem('searchName', this.keyWord);
    /*this.layoutService.search({
      keyWord: this.keyWord
    });*/

    this.router.navigate(['/mic/companyList', this.keyWord]);
    /*点击搜索后重置*/
    this.keyWord = '';
  }

  ngOnInit() {
    this.ecoRevenueTime = this.ecoTopRevenueTime = this.intermediateService.getInitRevenueTime();
    /*临时用于隐藏微观概况面板*/
    this.PanleHideSubscription = this.microcosmicService.getPanleHide().subscribe(res => {
      if (res.hide) {
        this.panelHide = true;
      }else {
        this.panelHide = false;
      }
    })
    /*监听搜索状态*/
    this.layoutService.getSearchStatusSubject().subscribe(res => {
      console.log('监听搜索', res)
      this.isSearchActive = res.isSearchActive;
    });
    /*经济产出地图时间控制*/
    $("#datetimepicker").datetimepicker({
      autoclose: 1,
      startView: 4,
      minView: 4,
      forceParse: 0,
      startDate: 2015,
      endDate: new Date().getFullYear() - 1,
      initialDate: new Date().getFullYear() - 1
    }).on('changeYear', (ev) => {
      const chooseTime = new Date(ev.date.valueOf()).getFullYear();
      this.ecoRevenueTime = chooseTime;
      this.drawLandPolygon('dataPolygonEcoOutputLands', this.ecoRevenueTime);
    });
    /*经济排名地图时间控制*/
    $("#datetimepicker-top").datetimepicker({
      autoclose: 1,
      startView: 4,
      minView: 4,
      forceParse: 0,
      startDate: 2015,
      endDate: new Date().getFullYear() - 1,
      initialDate: new Date().getFullYear() - 1
    }).on('changeYear', (ev) => {
      const chooseTime = new Date(ev.date.valueOf()).getFullYear();
      this.ecoTopRevenueTime = chooseTime;
      this.drawLandPolygon('dataPolygonEcoTopLands', this.ecoTopRevenueTime);
    });

    this.layoutService.connect();

    this.socketSubscription = this.layoutService.messages
      .retryWhen(errors => errors.delay(1000))
      .subscribe(msg => {
        const message = JSON.parse(msg);
        if (message.messageType === 2 && message.mgs.type === 'NEWS') {
          this.news = {
            title: message.mgs.news.title,
            content: message.mgs.news.content
          };
          this.hasNotifycation = true;
        }
      });

    this.socketStatusSubscription = this.layoutService.connectionStatus.subscribe(status => {
      console.log('connectionStatus=======>', status);
      if (status === 1) {
        this.layoutService.send(JSON.stringify({
          'mgs': { 'content': 'login' },
          'messageType': 1,
          'targetAccount': 'hecheng',
        }));
      }
    });


    this.tagState$.subscribe((state: ContainerStyle) => {
      console.log(state.width);
      this.container = state;
    });
    this.getShowHideDataFn = this.intermediateService.getShowHideData().subscribe(res => {
      this.isShowParkBuildBar = res.isShowParkBuildBar ? res.isShowParkBuildBar : false;
      this.showBuildMarkerEl = res.showBuildMarkerEl ? res.showBuildMarkerEl : false;
      this.isShowParkNameList = res.isShowParkNameList ? res.isShowParkNameList : false;
      this.choseBuildName = res.choseBuildName ? res.choseBuildName : this.choseBuildName;
    });
    this.parkNameLists = this.intermediateService.getParkNameList();
    this.getParkNameFn = this.intermediateService.getParkName().subscribe(res => {
      this.choseParkName = res.choseParkName ? res.choseParkName : this.choseParkName;
    });
    this.getTimeColorControlFn = this.intermediateService.getTimeColorControl().subscribe(res => {
      this.showTimeColorControl.isShowColorsBar = res.isShowColorsBar;
      this.showTimeColorControl.isShowTime = res.isShowTime;
      this.showTimeColorControl.isShowEcoTime = res.isShowEcoTime;
      this.showTimeColorControl.isShowTopTime = res.isShowTopTime;
      this.showTimeColorControl.isShowNatureColor = res.isShowNatureColor;
      this.showTimeColorControl.isShowInefficientColor = res.isShowInefficientColor;
      this.showTimeColorControl.isShowTopColor = res.isShowTopColor;
      this.showTimeColorControl.isShowEcoColor = res.isShowEcoColor;
      this.showTimeColorControl.isShowSingleColor = res.isShowSingleColor;
    });

    setTimeout(() => {
      const userDefaultPage = localStorage.getItem('userDefaultPage');
      const hasVist = sessionStorage.getItem('hasVist');
      // 设置啦偏好页面并在之前未访问过系统执行
      if (userDefaultPage && hasVist == null) {
        sessionStorage.setItem('hasVist', 'true');
        switch (userDefaultPage) {
          case 'weiguan':
            this.router.navigate(['/mic']);
            break;
          case 'zhongguan':
            this.router.navigate(['/int']);
            break;
          case 'hongguan':
            this.router.navigate(['/mac']);
            break;
          case 'manage':
            this.router.navigate(['/admin']);
            break;
        }
        return;
      }
      if (hasVist !== null) {
        return;
      }
      // 未设置个人偏好且没有访问过系统执行
      sessionStorage.setItem('hasVist', 'true');
      this.isCircleMenuShow = !this.isCircleMenuShow;
      this.animateState = this.animateState === 'on' ? 'off' : 'on';
      // 上面的动画执行完成之后，各自回到左中右
      setTimeout(() => {
        this.itemPosition = {
          first: 'left',
          second: 'middle',
          third: 'right'
        };
        this.isCircleMenuShowCopy = this.isCircleMenuShow;
      }, 600);
    }, 1000);

    // 模拟2秒来一个消息
    // TODO 接受到消息时显示消息框
    // setInterval(() => {
    //   this.hasNotifycation = true;
    // }, 60000);

    // this.connect();
  }
  ngOnDestroy() {
    this.getTimeColorControlFn.unsubscribe();
    this.getParkNameFn.unsubscribe();
    this.getShowHideDataFn.unsubscribe();

    this.socketSubscription.unsubscribe();
    this.socketStatusSubscription.unsubscribe();
    this.PanleHideSubscription.unsubscribe();
  }

  noticeClose() {
    this.hasNotifycation = false;
    this.canShowNotifyContent = false;
  }

  showNotifyContent() {
    this.canShowNotifyContent = !this.canShowNotifyContent;
  }

  itemClick(flag: string) {
    if (!this.isCircleMenuShow) {
      /*点击左上角收回的菜单按钮检测搜索是否处于激活，并对激活的时候进行处理Start*/
      this.isRirhtPanelShow = this.isRirhtPanelShow === false ? true : this.isRirhtPanelShow;
      this.isSearchActive = this.isSearchActive === true ? false : this.isSearchActive;
      /*End*/
      this.isCircleMenuShow = !this.isCircleMenuShow;
      this.animateState = this.animateState === 'on' ? 'off' : 'on';
      // 上面的动画执行完成之后，各自回到左中右
      setTimeout(() => {
        this.itemPosition = {
          first: 'left',
          second: 'middle',
          third: 'right'
        };
        this.isCircleMenuShowCopy = this.isCircleMenuShow;
      }, 600);
    } else {
      if (this.ROUTES[flag] === '/mic') {
        this.container = {
          width: '60%'
        };
      }
      // 动画的过程，先统一到一个地方在回到左边
      if (flag) {
        this.itemPosition = {
          first: flag,
          second: flag,
          third: flag
        };
      } else {
        this.itemPosition = {
          first: 'right',
          second: 'right',
          third: 'right'
        };
      }

      setTimeout(() => {
        this.itemPosition = {
          first: 'left',
          second: 'left',
          third: 'left'
        };
        this.isCircleMenuShow = !this.isCircleMenuShow;
        this.isCircleMenuShowCopy = this.isCircleMenuShow;
        this.animateState = this.animateState === 'on' ? 'off' : 'on';
        const TEST = flag ? this.router.navigate([this.ROUTES[flag]]) : '';
      }, 600);
    }
  }

  notSearchActive() {
    /*激活搜索时检测菜单选项是否处于激活，并对激活时的菜单进行处理*/
    if (this.isCircleMenuShow) {
      // this.itemPosition = {
      //   first: 'right',
      //   second: 'right',
      //   third: 'right'
      // };
      this.itemPosition = {
        first: 'left',
        second: 'left',
        third: 'left'
      };
      this.isCircleMenuShow = false;
      this.isCircleMenuShowCopy = this.isCircleMenuShow;
      this.animateState = 'off';
    }
    this.isRirhtPanelShow = this.isSearchActive;
    this.isSearchActive = !this.isSearchActive;
  }

  notRirhtPanelShow() {
    this.isRirhtPanelShow = !this.isRirhtPanelShow;
  }

  changeParkName(park) {

    this.storeAmap.dispatch({
      type: CLEAR_MARKER,
      payload: {
        action: 'CLEAR_MARKER',
        data: ''
      }
    });
    let parkData;
    switch (park) {
      case '高新南区':
        parkData = [{
          'name': '高新南区',
          'center': '104.065706,30.592168',
          'type': 0,
          'subDistricts': []
        }];
        break;
      case '高新西区':
        parkData = [{
          'name': '高新西区',
          'center': '103.922278,30.77348',
          'type': 1,
          'subDistricts': []
        }];
        break;
      case '高新东区':
        parkData = [{
          'name': '高新东区',
          'center': '104.26881,30.277292',
          'type': 1,
          'subDistricts': []
        }];
        break;
    }
    this.storeAmap.dispatch({
      type: ADD_MARKER_MID,
      payload: {
        action: 'ADD_MARKER_MID',
        data: parkData
      }
    });
    this.isShowParkNameList = false;
    this.showBuildMarkerEl = false;
    this.intermediateService.changeParkName(park);
  }
  showParkNameList() {
    this.isShowParkNameList = !this.isShowParkNameList;
    this.showBuildMarkerEl = false;
  }
  drawLandPolygon(type, time) {
    const polygonType = type;
    const revenueTime = time;
    this.storeAmap.dispatch({
      type: ADD_POLYGON,
      payload: {
        action: 'ADD_POLYGON',
        data: {type: polygonType, time: revenueTime, flag: true}
      }
    });
  }
  drawTopSingleIndustryLand(industryType) {
    this.ecoTopIndustry[industryType] = !this.ecoTopIndustry[industryType];
    this.storeAmap.dispatch({
      type: ADD_SINGLE_POLYGON,
      payload: {
        action: 'ADD_SINGLE_POLYGON',
        data: {type: 'dataPolygonTopSingleLands', industry: this.ecoTopIndustry}
      }
    });
  }
  drawEcoSingleIndustryLand(industryType) {
    this.ecoOutputIndustry[industryType] = !this.ecoOutputIndustry[industryType];
    this.storeAmap.dispatch({
      type: ADD_SINGLE_POLYGON,
      payload: {
        action: 'ADD_SINGLE_POLYGON',
        data: {type: 'dataPolygonEcoSingleLands', industry: this.ecoOutputIndustry}
      }
    });
  }
}
