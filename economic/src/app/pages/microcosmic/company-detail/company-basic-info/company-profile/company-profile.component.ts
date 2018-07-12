import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyBasicService } from '../company-basic.service';
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
    private companyBasicService: CompanyBasicService
  ) { }
  keyWord: any;
  baseInfo: any;
  CompanyProfile = '加载中...';
  ngOnInit() {

    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.getCompanyProfile(this.keyWord);
  }
  getCompanyProfile(companyName) {
    console.log(companyName);
    this.companyBasicService.getCompanyProfile(companyName).subscribe(res => {
      if (res.responseCode === '_200') {
        console.log('企业概况', res);
        if (!res.data.baseInfoPojos[0]) {
          this.CompanyProfile = '暂无信息！';
        }
        this.baseInfo = res.data.baseInfoPojos[0];
        /*判断是否有主要产品信息*/
        if (this.baseInfo && this.baseInfo.businessScope) {
          const options = this.baseInfo.businessScope.split(',');
          this.creat3DcloudTag(options);
        }
      }
    });
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
      entries[i].label = v;
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
