import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyBasicService } from '../company-basic.service';
import { ToastModalService } from '../../../../../shared/toast-modal/toast-modal.service';

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
  contactPeopleInfo: any = [];
  contactPeopleInfoIndex: any;
  changeContactPeopleInfo: any = {};
  CompanyProfile = '加载中...';
  CompanyIntroductionTips = '加载中...';
  CompanyContactPeopleTips = '加载中...';
  FamousProductTips = '加载中...';
  changeContactPeopleConfirmTips = '确定修改该公司联系人信息吗？';
  changeContactPeopleStatus = false;
  dataRowkey: any;
  oldContactInfo: any = {};
  // 名优产品
  FamousProduct = [];
  getFamousProductParamas = { companyName: 'test1', pageSize: 10, lastRowKey: '' };
  /*企业诉求*/
  corporateAppeal = [];
  /*综合评价*/
  BusinessEvaluationData = [];
  /*自定义标签*/
  addLabelStatus: false;
  newLabel: any;
  labelLists = [];
  deleteLabelId: number;
  deleteLabelConfirmTips = '确定要删除该标签吗？';
  CompanyCustomLabelTips = '加载中...';
  /*多维排名*/
  IncomeRankEchart: any;
  incomeRankData: any;
  RDRankEchart: any;
  RDRankData: any;
  PaidTaxRankEchart: any;
  PaidTaxRankData: any;
  GOVSupportRankEchart: any;
  GOVSupportRankData: any;
  EnergyConsumptionRankEchart: any;
  EnergyConsumptionRankData: any;
  SocialSecurityRankEchart: any;
  SocialSecurityRankData: any;
  SiteAreaRankEchart: any;
  SiteAreaRankData: any;
  ngOnInit() {

    this.keyWord = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.keyWord);
    this.getFamousProductParamas.companyName = this.keyWord;
    this.getCompanyProfile(this.keyWord);
    this.getContactPeopleInfo(this.keyWord);
    // this.getFamousProduct();
    // this.getBusinessEvaluation();
    this.getCompanyCustomLabel();
    this.getRankData();
  }
  getCompanyProfile(companyName) {
    console.log(companyName);
    this.companyBasicService.getCompanyProfile(companyName).subscribe(res => {
      console.log('企业概况', res);
      if (res.responseCode === '_200') {
        if (!res.data.baseInfoPojos) {
          this.CompanyProfile = '暂无信息！';
        }
        if (!res.data.baseInfoPojos || !res.data.introduction) {
          this.CompanyIntroductionTips = '暂无信息！';
        }
        this.baseInfo = res.data.baseInfoPojos;
        this.corporateAppeal = res.data.companyProblemTypes;
        /*判断是否有主要产品信息*/
        /*if (this.baseInfo && this.baseInfo.businessScope) {
          const options = this.baseInfo.businessScope.split(/[。、；]/);
          this.creat3DcloudTag(options);
        }*/
      }
    });
  }
  /*获取企业联系人（政企联系人）*/
  getContactPeopleInfo (company) {
    this.companyBasicService.findListByUrl({companyName: company}, 'companyContactPeopleUrl').subscribe(res => {
      console.log('企业联系人', res)

      if (res.data.eIIRelationPojo.length < 1) {
        this.CompanyContactPeopleTips = '暂无信息！';
        return;
      }
      this.contactPeopleInfo = res.data.eIIRelationPojo;
    });
  }
  // 名优产品
  getFamousProduct() {
    this.companyBasicService.findListByUrl(this.getFamousProductParamas, 'FamousProduct')
      .subscribe(res => {
        console.log('查询到的名优产品信息=============>', res);
        if (res.responseCode === '_200') {
          if (res.data.eQIFamousProductPojo.length < 1) {
            this.FamousProductTips = '暂无信息！';
          }
          this.getFamousProductParamas.lastRowKey = res.data.pagination.lastRowKey;
          this.FamousProduct = [...this.FamousProduct, ...res.data.eQIFamousProductPojo];
        }
      });
  }
  /*获取综合评价*/
  getBusinessEvaluation() {
    const params = {name: this.keyWord};
    this.companyBasicService.findListByUrl(params, 'businessEvaluationUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        const data = res.data;
        const formatData = [
          {name: '经济指标', number: []},
          {name: '科技创新', number: []},
          {name: '人力资源', number: []},
          {name: '环保排污', number: []},
          {name: '综合能耗', number: []},
          {name: '年末资产', number: []},
        ];
        const copyArry = [];
        for (const item in data) {
          if (item === '综合能耗' || item === '环保排污') {
            const number = [0, 0, 0, 0];
            const numberData = data[item][0];
            number[0] = numberData[0] ? -numberData[0] : 0;
            number[1] = numberData[2] ? -numberData[2] : 0;
            number[2] = numberData[1] ? -numberData[1] : 0;
            number[3] = numberData[3] ? -numberData[3] : 0;
            copyArry.push({name: item, number: number});
          }else {
            copyArry.push({name: item, number: data[item][0]});
          }
        }
        copyArry.forEach(item => {
          formatData.forEach(childItem => {
            if (childItem.name === item.name) {
              childItem.number = item.number;
            }
          });
        });
        this.BusinessEvaluationData = formatData;
        console.log(this.BusinessEvaluationData)
      }
    });
  }
  /*获取多维排名信息*/
  getRankData() {
    const params = {name: this.keyWord};
    this.companyBasicService.findListByUrl(params, 'businessEvaluationUrl').subscribe(res => {
      console.log('排名信息', res);
      if (res.responseCode === '_200') {
        const data = res.data;
        const incomeRankData = this.formatEchartData({type: '营业收入', data: data['经济指标']});
        this.incomeRankData = {rankNumber: incomeRankData.rankData, rankTopName: incomeRankData.firstName, dataNumber: incomeRankData.dataNumber};
        this.creatRankEchart(incomeRankData, 'IncomeRankEchart');

        const RDRankData = this.formatEchartData({type: 'R&D', data: data['研发投入']});
        this.RDRankData = {rankNumber: RDRankData.rankData, rankTopName: RDRankData.firstName, dataNumber: RDRankData.dataNumber};
        this.creatRankEchart(RDRankData, 'RDRankEchart');

        const PaidTaxRankData = this.formatEchartData({type: '实缴税收', data: data['实缴税收']});
        this.PaidTaxRankData = {rankNumber: PaidTaxRankData.rankData, rankTopName: PaidTaxRankData.firstName, dataNumber: PaidTaxRankData.dataNumber};
        this.creatRankEchart(PaidTaxRankData, 'PaidTaxRankEchart');

        const GOVSupportRankData = this.formatEchartData({type: '政府支持', data: data['政府支持']});
        this.GOVSupportRankData = {rankNumber: GOVSupportRankData.rankData, rankTopName: GOVSupportRankData.firstName, dataNumber: GOVSupportRankData.dataNumber};
        this.creatRankEchart(GOVSupportRankData, 'GOVSupportRankEchart');

        /*const EnergyConsumptionRankData = this.formatEchartData({type: '综合能耗', data: data['综合能耗']});
        this.EnergyConsumptionRankData = {rankNumber: EnergyConsumptionRankData.rankData, rankTopName: EnergyConsumptionRankData.firstName};
        this.creatRankEchart(EnergyConsumptionRankData, 'EnergyConsumptionRankEchart');*/

        const SocialSecurityRankData = this.formatEchartData({type: '社保人员', data: data['社保人员']});
        this.SocialSecurityRankData = {rankNumber: SocialSecurityRankData.rankData, rankTopName: SocialSecurityRankData.firstName, dataNumber: SocialSecurityRankData.dataNumber};
        this.creatRankEchart(SocialSecurityRankData, 'SocialSecurityRankEchart');

        const SiteAreaRankData = this.formatEchartData({type: '经营场地面积', data: data['场地面积'] || []});
        this.SiteAreaRankData = {rankNumber: SiteAreaRankData.rankData, rankTopName: SiteAreaRankData.firstName, dataNumber: SiteAreaRankData.dataNumber};
        this.creatRankEchart(SiteAreaRankData, 'SiteAreaRankEchart');
      }
    });
  }
  /*处理绘制仪表盘所需数据*/
  formatEchartData(options) {
    const maxData = options.data[0] ? (options.data[0][3] ? options.data[0][3] : 0) : 10;
    const rankData = options.data[1] ? (options.data[1][0] ? options.data[1][0] : '未知') : '未知'; // 无数据放在最后一名
    const firstName = options.data[0] ? (options.data[0][1] ? options.data[0][1] : '未知') : '未知';
    const dataNumber = options.data[1] ? (options.data[1][2] ? options.data[1][2] : '未知') : '未知';
    return {type: options.type, maxData: maxData, rankData: rankData, firstName: firstName, dataNumber: dataNumber};
  }
  /*点击纠错获取原始值*/
  getChangeContactInfo(index, rowkey) {
    this.changeContactPeopleStatus = true;
    this.dataRowkey = rowkey;
    this.contactPeopleInfoIndex = index;
    this.oldContactInfo = {
      contactsName: this.contactPeopleInfo[index].contactsName,
      duties: this.contactPeopleInfo[index].duties,
      contactInfo: this.contactPeopleInfo[index].contactInfo
    };
    this.changeContactPeopleInfo = {contactsName: this.oldContactInfo.contactsName, duties: this.oldContactInfo.duties, contactInfo: this.oldContactInfo.contactInfo};
  }
  /*取消纠错*/
  cancelChangeContactPeople() {
    this.dataRowkey = null;
    this.changeContactPeopleStatus = false;
    this.changeContactPeopleInfo = {contactsName: '', duties: '', contactInfo: ''};
  }
  /*提交修改联系人*/
  submitChangeContactPeople(template, rowkey) {
    this.dataRowkey = rowkey;
    this.toastModalService.showModal(template);
  }
  /*确认提交修改*/
  saveChangeInfo() {
    this.toastModalService.hideModal();
    const dataId = this.dataRowkey;
    const index = this.contactPeopleInfoIndex;
    const changeParams = {
      dataId: dataId,
      contactsName: this.changeContactPeopleInfo.contactsName,
      duties: this.changeContactPeopleInfo.duties,
      contactInfo: this.changeContactPeopleInfo.contactInfo,
    };
    if (changeParams.contactsName === this.oldContactInfo.contactsName && changeParams.duties === this.oldContactInfo.duties && changeParams.contactInfo === this.oldContactInfo.contactInfo) {
      this.toastModalService.addToasts({tipsMsg: '无数据更新！', type: 'warning'});
      return;
    }
    // this.companyBasicService.findListHasNullByUrl(changeParams, 'changeContactPeopleAllUrl').subscribe(res => {
    this.companyBasicService.changeCompanyConactPeopleUrl(changeParams, 'changeContactPeopleAllUrl', 'post').subscribe(res => {
        if (res.responseCode === '_200') {
          this.toastModalService.addToasts({tipsMsg: '已提交纠错信息！', type: 'success'});
          this.changeContactPeopleStatus = false;
          this.dataRowkey = null;
          this.changeContactPeopleInfo = {contactsName: '', duties: '', contactInfo: ''};
          this.getContactPeopleInfo(this.keyWord);
        }else {
          this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
        }
      });
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

  /*获取企业的自定义标签*/
  getCompanyCustomLabel() {
    this.companyBasicService.findListByUrl({companyName: this.keyWord}, 'companyCustomLabelUrl').subscribe(res => {
      console.log('自定义标签', res);
      if (res.responseCode === '_200') {
        if (res.data.length < 1) {
          this.CompanyCustomLabelTips = '该企业暂不存在自定义标签！';
        }
        this.labelLists = res.data;
      }
    });
  }
  /*添加新自定义标签*/
  addNewLabel() {
    const newLabel = this.newLabel.trim();
    if (newLabel) {
      for (let i = 0; i < this.labelLists.length; i++) {
        if (newLabel === this.labelLists[i].content) {
          this.toastModalService.showErrorToast({errorMsg: '该标签已存在！'});
          return;
        }
      }
      this.companyBasicService.findListByTypeAndUrl({companyName: this.keyWord, content: newLabel}, 'addCompanyCustomLabelUrl', 'post').subscribe(res => {
        console.log(res);
        if (res.responseCode === '_200') {
          this.labelLists.push(newLabel);
          this.toastModalService.showSuccessToast({tipsMsg: '添加标签成功！'});
          this.addLabelStatus = false;
          this.newLabel = '';
          this.getCompanyCustomLabel();
        }else {
          this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
        }
      });
    }
  }
  /*删除标签操作*/
  deleteLabel(option, template) {
    this.deleteLabelId = option;
    this.toastModalService.showModal(template);
  }
  /*确认删除标签操作*/
  confirmDeleteLabel() {
    const iabelID = this.deleteLabelId;
    this.companyBasicService.findListByTypeAndUrl({iabelID: iabelID}, 'deleteCompanyCustomLabelUrl', 'delete').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        // this.labelLists.splice(index, 1);
        this.toastModalService.hideModal();
        this.toastModalService.showSuccessToast({tipsMsg: '删除标签成功！'});
        this.getCompanyCustomLabel();
      }else {
        this.toastModalService.hideModal();
        this.toastModalService.showErrorToast({errorMsg: res.errorMsg});
      }
    });
  }
  /*取消删除标签操作*/
  declineDeleteLabel() {
    this.toastModalService.hideModal();
  }
  /*绘制多维排名图表*/
  creatRankEchart(options, dataName?) {
    const seriseData = [{value: 0, name: '名'}];
    const maxData = options.maxData;
    seriseData[0].value = options.rankData;
    const option = {
      tooltip : {
        confine: true,
        formatter: '{a} <br/>{c} {b}'
      },
      series : [
        {
          name: '排名',
          type: 'gauge',
          center: ['50%', '50%'],
          radius: '95%',
          startAngle: 200,
          endAngle: -20,
          min: maxData,
          max: 0,
          splitNumber: 2,
          itemStyle: {
            normal: {
              color: '#e7e9eb',
            }
          },
          axisLine: {            // 坐标轴线
            show: false,
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 10,
              color: [[0.2, '#5d80c9'], [0.8, '#facc06'], [1, '#ef5227']],
            }
          },
          axisTick: {            // 坐标轴小标记
            /*show: false,
            splitNumber: 5,
            length: 0,
            lineStyle: {
              color: 'auto'
            }*/
            length: 10,
            splitNumber: 100,
            lineStyle: {
              color: {
                image: document.getElementById('linear-pic'),
                repeat: 'no-repeat'
              },
              width: 2
            }
          },
          markPoint: {
            show: false,
            symbol: 'circle',
            symbolSize: 16,
            silent: true,
            itemStyle: {
              color: '#FFF',
              normal: {
                label: {
                  show: false
                }
              }
            },
            data: [
              {
                x: 'center',
                y: 'center',
                show: false,
              }
            ]
          },
          axisLabel: {
            color: '#7c7e80',
            formatter: function (v) {
              switch (v + '') {
                case '0' : return '上';
                case (maxData / 2) + '' : return '中';
                case maxData + '' : return '下';
              }
            }
          },
          splitLine: {           // 分隔线
            show: false,
            length: 6,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              color: 'auto'
            }
          },
          pointer: {
            width: 5,
            length: '55%',
          },
          title : {
            show: false
          },
          detail : {
            show: false
          },
          data: seriseData
        }
      ]
    };
    this[dataName] = option;
  }
}
