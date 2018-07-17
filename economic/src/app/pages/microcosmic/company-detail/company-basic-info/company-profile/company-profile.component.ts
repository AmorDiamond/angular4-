import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyBasicService } from '../company-basic.service';
import { ToastModalService } from "../../../../../shared/toast-modal/toast-modal.service";

declare var $: any;

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService,
    private companyBasicService: CompanyBasicService,
    private toastModalService: ToastModalService
  ) { }
  keyWord: any;
  baseInfo: any;
  contactPeopleInfo = {name: '测试', job: '工程师', phone: '123456789'};
  changeContactPeopleInfo = {name: this.contactPeopleInfo.name, job: this.contactPeopleInfo.job, phone: this.contactPeopleInfo.phone};
  CompanyProfile = '加载中...';
  CompanyIntroductionTips = '加载中...';
  CompanyContactPeopleTips = '加载中...';
  changeContactPeopleConfirmTips = '确定修改该公司联系人信息吗？';
  ngOnInit() {

    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.getCompanyProfile(this.keyWord);
    this.getContactPeopleInfo(this.keyWord);
  }
  getCompanyProfile(companyName) {
    console.log(companyName);
    this.companyBasicService.getCompanyProfile(companyName).subscribe(res => {
      console.log('企业概况', res);
      if (res.responseCode === '_200') {
        if (!res.data.baseInfoPojos[0]) {
          this.CompanyProfile = '暂无信息！';
        }
        if (!res.data.baseInfoPojos[0] || !res.data.introduction) {
          this.CompanyIntroductionTips = '暂无信息！';
        }
        this.baseInfo = res.data.baseInfoPojos[0];
        /*判断是否有主要产品信息*/
        if (this.baseInfo && this.baseInfo.businessScope) {
          const options = this.baseInfo.businessScope.split(/[。、；]/);
          this.creat3DcloudTag(options);
        }
      }
    });
  }
  /*获取企业联系人（政企联系人）*/
  getContactPeopleInfo (company) {
    this.companyBasicService.findListByUrl({companyName: company}, 'companyContactPeopleUrl').subscribe(res => {
      console.log('企业联系人', res)

      if (!res.data.eIIRelationPojo[0]) {
        this.CompanyContactPeopleTips = '暂无信息！';
      }
    })
  }
  /*取消纠错*/
  cancelChangeContactPeople() {
    this.changeContactPeopleInfo = {name: this.contactPeopleInfo.name, job: this.contactPeopleInfo.job, phone: this.contactPeopleInfo.phone};
  }
  /*提交修改联系人*/
  submitChangeContactPeople(template) {
    this.toastModalService.showModal(template)
  }
  /*确认提交修改*/
  saveChangeInfo() {
    this.toastModalService.hideModal();
    this.toastModalService.showSuccessToast({tipsMsg: '修改成功！'});
  }
  /*撤销提交操作*/
  declineSaveChangeInfo() {
    this.toastModalService.hideModal();
  }
  /*创建3D云标签*/
  creat3DcloudTag(options) {
    // --------------------------3D 词云图 -----------------
    const entries = [
      { label: '', fontColor: 'red', fontSize: 38, target: '_button' },
      { label: '', fontColor: '#C71585', fontSize: 28, target: '_top' },
      { label: '', url: '', target: '_top' },
      { label: '', fontColor: '#0000FF', fontSize: 28, target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '', target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '', fontColor: '#6495ED', fontSize: 28,  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '', fontColor: '#98FB98', fontSize: 28,  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '', target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
      { label: '',  target: '_top' },
    ];
    options.forEach((v, i) => {
      if (entries[i]) {
        entries[i].label = v;
      }else {
        entries.push({ label: v,  target: '_top' })
      }
    })
    /*for (let i = 0; i < options.value.length; i++) {
      entries[i].label = options.value[i];
    }*/
    const settings = {
      entries: entries,
//                width: "100%",
      width: 500,
      height: 200,
//                radius: '65%',//图像大小
      radiusMin: 75,
      bgDraw: true,
      bgColor: 'transparent',
      opacityOver: 1.00,
      opacityOut: 0.3, // 控制悬停与一个标签上时,其他标签的透明度
      opacitySpeed: 6,
      fov: 800,
      speed: 0.5, // 控制旋转速度
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '18',
      fontColor: '#8B4513',
      fontWeight: 'normal', // bold
      fontStyle: 'normal', // italic
      fontStretch: 'normal', // wider, narrower, ultra-condensed, extra-condensed
      fontToUpperCase: true,
      tooltipFontFamily: 'Oswald, Arial, sans-serif',
      tooltipFontSize: '11',
      tooltipFontColor: 'red',
      tooltipFontWeight: 'normal', // bold
      tooltipFontStyle: 'normal', // italic
      tooltipFontStretch: 'normal', // wider, narrower, ultra-condensed, extra-condensed, condensed
      tooltipFontToUpperCase: false,
      tooltipTextAnchor: 'left',
      tooltipDiffX: 0,
      tooltipDiffY: 10

    };

    // var svg3DTagCloud = new SVG3DTagCloud( document.getElementById( 'holder'  ), settings );
    $( '#holderProduct' ).svg3DTagCloud( settings );
  }

}
