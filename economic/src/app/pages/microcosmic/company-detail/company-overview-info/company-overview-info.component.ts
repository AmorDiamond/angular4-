import { Component, OnInit } from '@angular/core';
import { CompanyOverviewInfoService } from './company-overview-info.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../microcosmic.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

declare var $: any;

@Component({
  selector: 'app-company-overview-info',
  templateUrl: './company-overview-info.component.html',
  styleUrls: ['./company-overview-info.component.css'],
  providers: [CompanyOverviewInfoService]
})
export class CompanyOverviewInfoComponent implements OnInit {

  constructor(
    private companyOverviewInfoService: CompanyOverviewInfoService,
    private loadingService: LoadingService,
    private routerInfo: ActivatedRoute,
    private microcomicService: MicrocosmicService,
    private toastyService: ToastyService,
    private toastModalService: ToastModalService,
  ) { }
  radarMapEchartData: any;
  inferiorityLists = [];
  echartsParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 20, lastRowKey: '' };
  keyWord: any;
  ngOnInit() {

    this.keyWord = this.microcomicService.getUrlParams('name');

    this.microcomicService.setCompanyName(this.keyWord);
    this.echartsParams.enterpriseName = this.keyWord;
    // this.loadingService.loadingStart();
    const evaluationScoreHttp = this.companyOverviewInfoService.findListByUrl(this.echartsParams, 'companyEvaluationScoreUrl');
    const evaluationTagHttp = this.companyOverviewInfoService.findListByUrl(this.echartsParams, 'companyEvaluationTagUrl');
    const inferiorityHttp = this.companyOverviewInfoService.findListByUrl(this.echartsParams, 'companyInferiorityUrl');
    Observable.forkJoin([evaluationScoreHttp, evaluationTagHttp, inferiorityHttp])
      .subscribe(results => {
        console.log(results);
        if (results[0].data.eAEvaluationPojos.length > 0) {
          this.creatRadarMap(results[0].data.eAEvaluationPojos);
        }else {
          const indicator = [
            { scoringType: '资质评分', score: 5 },
            { scoringType: '经济指标评分', score: 6 },
            { scoringType: '能耗评分', score: 4 },
            { scoringType: '信用评分', score: 3 },
            { scoringType: '企业业务活跃度评分', score: 8 },
            { scoringType: '发展事态评分', score: 7 }
          ]
          this.creatRadarMap(indicator);
        }
        if (results[1].data.eAEvaluationPojos.length > 0) {
          this.creat3DcloudTag(results[1].data.eAEvaluationPojos);
        }else {
          const options = [
            {label: '测试数据'},
            {label: '测试数据'},
            {label: '测试数据'},
            {label: '测试数据'},
            {label: '测试数据'},
            {label: '测试数据'},
            {label: '测试数据'},
            {label: '测试数据'},
            {label: '测试数据'}
            ]
          this.creat3DcloudTag(options);
        }
        if (results[2].data.eAEvaluationPojos.length > 0) {
          this.inferiorityLists = results[2].data.eAEvaluationPojos;
        }else {
          const options = [
            {inferiorityType: '资质劣势', inferiority: '暂无'},
            {inferiorityType: '经济指标劣势', inferiority: '暂无'},
            {inferiorityType: '能耗劣势', inferiority: '暂无'},
            {inferiorityType: '信用劣势', inferiority: '暂无'},
            {inferiorityType: '发展事态劣势', inferiority: '暂无'}
          ];
          this.inferiorityLists = options;
        }
        // this.loadingService.loadingStop();
      }, err => {
        // alert('数据请求出错！');
        // this.addToast('数据请求出错！');
        this.toastModalService.showErrorToast({errorMsg: '数据请求出错！'});
        // this.loadingService.loadingStop();
      });
  }
  /*绘制评价雷达图*/
  creatRadarMap(options) {
    const echartData = {indicatorData: [], serviceData: []};
    options.forEach((v, i) => {
      echartData.indicatorData.push({ text: v.scoringType, max: 10 , color: '#f9b620'});
      echartData.serviceData.push(v.score);
    });
    const option = {
      title: {
        text: '评分',
        left: 'center',
        textStyle: {
          color: '#bcbdbf'
        }
      },
      toolbox: {
        feature: {
          dataView: {
            show: true,
            readOnly: false
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      legend: {
        data: ['评分', '评价'],
        textStyle: {
          color: '#bcbdbf'
        },
        top: 40
      },
      radar: [
        {
          indicator: echartData.indicatorData,
          radius: 135
        }
      ],
      series: [
        {
          name: '评分 (分)',
          type: 'radar',
          data: [
            {
              // value: JSON.parse(result.evaluate).num,
              value: echartData.serviceData,
              name: '评分',
              label: {
                normal: {
                  color: '#20d1f9',
                  show: true,
                  formatter: function(params) {
                    return params.value + '分';
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: '#20d1f9',
                }
              },
              lineStyle: {
                normal: {
                  color: '#20d1f9'
                }
              }
            }
          ]
        }
      ]
    };
    this.radarMapEchartData = option;
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
        entries[i].label = v.label;
      })
      /*for (let i = 0; i < options.value.length; i++) {
        entries[i].label = options.value[i];
      }*/
      const settings = {
        entries: entries,
//                width: "100%",
        width: 500,
        height: 300,
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
      $( '#holder' ).svg3DTagCloud( settings );
  }

  addToast(msg) {
    // Just add default Toast with title only
    // this.toastyService.default('Hi there');
    // Or create the instance of ToastOptions
    const toastOptions: ToastOptions = {
      title: '提示',
      msg: msg,
      showClose: true,
      timeout: 2000,
      // theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }

}
