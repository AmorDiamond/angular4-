import { Component, OnInit } from '@angular/core';
import { CompanyEconomicInfoService } from './company-economic-info.service';
import { CompanyDetailService } from '../company-detail.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MicrocosmicService } from '../../microcosmic.service';

@Component({
    selector: 'app-company-economic-info',
    templateUrl: './company-economic-info.component.html',
    styleUrls: ['./company-economic-info.component.css'],
    providers: [CompanyEconomicInfoService]
})
export class CompanyEconomicInfoComponent implements OnInit {
    companyName: any;
    businessIncomeData: any;
    businessIncomeRatioData: any;
    numberOfActiveStaffData: any;
    parkNumberData: any;
    StaffCompositionRatioData: any;
    relationPeople: any;
    gobernmentContacts: any;
    projectDeclaration: any;
    notices: any;
    businessIncomeRatioLoading = true;

    echartsParams = { companyName: 'test1', currentPage: 0, pageSize: 20, lastRowKey: '' };
    WinningBidParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '' };
    WinningBid = [];
    PublicOpinionParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 2, lastRowKey: '', type: 'PublicOpinion' };
    PublicOpinions = [];
    EIIRecruitParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '', type: 'EIIRecruit' };
    EIIRecruit = [];
    EquityPledgedParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '', type: 'EquityPledged' };
    EquityPledged = [];
    ChattelMortgageParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '', type: 'ChattelMortgage' };
    ChattelMortgage = [];
    AnnualReportParams = { enterpriseName: 'test1', currentPage: 0, pageSize: 10, lastRowKey: '', type: 'ChattelMortgage' };
    AnnualReport = [];

    //   项目申报
    ProjectDeclarations = [];
    constructor(
        private companyEconomicInfoService: CompanyEconomicInfoService,
        private companyDetailService: CompanyDetailService,
        private routerInfo: ActivatedRoute,
        private microcomicService: MicrocosmicService
    ) { }

    ngOnInit() {
        this.companyName = 'test1';
      this.companyName = this.microcomicService.getUrlParams('name');

      this.microcomicService.setCompanyName(this.companyName);
      this.echartsParams.companyName = this.companyName;
      this.WinningBidParams.enterpriseName = this.companyName;
      this.PublicOpinionParams.enterpriseName = this.companyName;
      this.EIIRecruitParams.enterpriseName = this.companyName;
      this.EquityPledgedParams.enterpriseName = this.companyName;
      this.ChattelMortgageParams.enterpriseName = this.companyName;
      this.AnnualReportParams.enterpriseName = this.companyName;
        /*获取营业收入信息*/
        this.companyEconomicInfoService.findListByUrl(this.echartsParams, 'companyIncomeStatisticsUrl').subscribe(res => {
            console.log('获取营业收入', res)
            this.creatBusinessIncomeEChart(res.data.eIIRevenueAndStaffPojo);
        });
        /*获取收入占比信息*/
        this.companyEconomicInfoService.getRevenueShare(this.companyName, new Date().getFullYear() - 1).subscribe(res => {
            console.log('获取收入占比', res);
          /*const data = {
            2017:{"timestemp":1529639550524,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"5b877abb-e9d9-42d5-a6eb-3e8a5b09cbd1","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":1200,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"75316988-4b84-49e9-acc1-88cacecd6687","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":352,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"b99c91d6-0f05-4909-9e0a-c7314d1d1f8b","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":500,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"bdb5dcc1-6d33-4528-9def-0e2767fa79bf","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":1100,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"d81e707e-3137-4fb2-a45f-31f910598a7f","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":157,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"f97a4444-075c-4252-97c5-9dda887bfc7d","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":850,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
            2016:{"timestemp":1529639635285,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"1d96d4d6-2f56-480d-bd40-6ea217a981a8","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":1850,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"3fcde07e-aaf4-491b-96fa-791e4ac0a2f6","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":200,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"8b676875-03ef-4ac4-8004-34c0cd7df68e","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":100,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"8d4d0f19-87af-4386-b83b-87eaf4b1240c","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":252,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"94e496e1-f9cc-4f79-82ec-7ebddc93d75b","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":157,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"e658ccdf-fcb5-4fda-a500-845c13d63888","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":1100,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
            2015: {"timestemp":1529639682720,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"3ae4e1d2-2f51-4627-a14d-233a4f522ea4","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":600,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"5299a6e9-a03a-4922-a5e0-e809bcc29dcd","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":357,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"64db7775-3fb0-4e8e-8bee-48319aa7b6ee","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":452,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"69e3d6ea-f778-4148-9982-9d7d23bf59e1","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":621,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"a17e8044-e39a-44a3-9340-7fff47200a4d","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":320,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"ec4eb106-e213-47c5-a68f-edcc67618c4b","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":850,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
            2014: {"timestemp":1529640281853,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"5eb2c7d7-1659-487b-937a-c1d664c3d859","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":621,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"67bdd1c6-bc10-4f39-aa0d-e2c2d09bf4ae","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":751,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"96b97bb6-c206-4c0b-896d-a8ee3323318f","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":452,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"9a00cf07-31f3-4ef2-8a47-c2a6efe1e43d","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":621,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"db0a491b-341a-4a29-aa79-7a729eb5f42f","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":557,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"e978d7fc-523b-4b8c-ac51-acf15e02f8d7","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":316,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null}
          }
          let result;
          if (data[new Date().getFullYear() - 1]) {
            result = data[new Date().getFullYear() - 1];
          }else {
            result = res;
          }*/
            this.creatBusinessIncomeRatioEChart(res.data.eIIRevenueAndStaffPojo, new Date().getFullYear() - 1);
        });
        /*获取企业人数*/
        this.companyEconomicInfoService.findListByUrl(this.echartsParams, 'companyNumberOfActiveStaffUrl').subscribe(res => {
            /*获取园区人数占比数据*/
            this.companyEconomicInfoService.findListByUrl(this.echartsParams, 'companyParkNumberUrl').subscribe(proportionres => {
                const options = { number: res.data.eIIRevenueAndStaffPojo, proportion: proportionres.data.eIIRevenueAndStaffPojo };
                this.creatParkNumber(options);
            });
        });
        /*获取四季度收入同比数据*/
        this.companyEconomicInfoService.findListByUrl(this.echartsParams, 'companyRevenueYearOnYearUrl').subscribe(res => {
            this.creatNumberOfActiveStaff(res.data.eIIRevenueAndStaffPojo);
        });
        /*获取关联方数据*/
        this.companyEconomicInfoService.getRelationPeople(this.companyName).subscribe(res => {
            if (res.data.eIIRelationPojo.length > 0) {
              this.creatRelationPeople(res.data.eIIRelationPojo);
            }
        });
        /*获取政企联系人*/
        this.companyEconomicInfoService.getGobernmentContacts(this.companyName).subscribe(res => {
            console.log('获取政企联系人', res)
            this.gobernmentContacts = res.data.eIIRelationPojo;
        });
        /*获取政府项目申报信息*/
        this.companyEconomicInfoService.getProjectDeclaration(this.companyName).subscribe(res => {
            console.log(res);
            this.ProjectDeclarations = res.data.kETProjectDeclarationPojo;
        });

        /*获公告列表信息*/
        this.companyEconomicInfoService.getNotices(this.companyName).subscribe(res => {
            console.log(res);
            this.notices = res.data.eIIAnnouncementsPojos;
        });
        /*获取人员构成占比图表*/
        this.creatStaffCompositionRatioEChart();

        // this.findPublicOpinionPage();
        this.findEIIRecruitPage();
        this.findEquityPledgedPage();
        this.findWinningBidPage();
        // this.findChattelMortgage();
        this.getAnnualReportParamsPage();
    }

    // 招中标信息
    findWinningBidPage() {
        this.companyEconomicInfoService.findListByCompanyName(this.WinningBidParams, 'WinningBid').subscribe(res => {
            console.log(res);
            this.WinningBid = res.data.eIIWinningBidPojos;
        });
    }

    // 热点舆论列表
    findPublicOpinionPage() {
        this.companyDetailService.findListByCompanyName(this.PublicOpinionParams)
            .subscribe(res => {
                if (res.responseCode === '_200') {
                    this.PublicOpinions = [...this.PublicOpinions, ...res.data.eIIAnnouncementsPojos];
                    this.PublicOpinionParams.lastRowKey = res.data.pagination.lastRowKey;
                }
            });
    }
    // 招聘信息
    findEIIRecruitPage() {
        this.companyDetailService.findListByCompanyName(this.EIIRecruitParams)
            .subscribe(res => {
                if (res.responseCode === '_200') {
                    console.log('招聘信息======================>', res);
                    this.EIIRecruit = [...this.EIIRecruit, ...res.data.eIIRecruitPojos];
                    this.EIIRecruitParams.lastRowKey = res.data.pagination.lastRowKey;
                }
            });
    }
    // 股权信息
    findEquityPledgedPage() {
        this.companyDetailService.findListByCompanyName(this.EquityPledgedParams)
            .subscribe(res => {
                if (res.responseCode === '_200') {
                    console.log('股权出资==========>', res);
                    this.EquityPledged = [...this.EquityPledged, ...res.data.eIIEquityPledgedPojos];
                    this.EquityPledgedParams.lastRowKey = res.data.pagination.lastRowKey;
                }
            });
    }
    // 动产抵押
    findChattelMortgage() {
        this.companyDetailService.findListByCompanyName(this.ChattelMortgageParams)
            .subscribe(res => {
                if (res.responseCode === '_200') {
                    console.log('动产抵押==========>', res);
                    this.ChattelMortgage = [...this.ChattelMortgage, ...res.data.eIIChattelMortgagePojos];
                  this.ChattelMortgageParams.lastRowKey = res.data.pagination.lastRowKey;
                }
            });
    }
    // 企业年报
    getAnnualReportParamsPage() {
        this.companyEconomicInfoService.getStock(this.AnnualReportParams).subscribe(res => {
            if (res.responseCode === '_200') {
                console.log('企业年报', res)
                this.AnnualReport = [...this.AnnualReport, ...res.data.eIIApStockChangePojo];
              this.AnnualReportParams.lastRowKey = res.data.pagination.lastRowKey;
            }
        });
    }
    psYReachEnd() {
        console.log('到到到到到到底部了');
    }
    /*获取每年收入占比*/
    changeBusinessIncomeRatioData(event) {
        /*获取收入占比信息*/
        this.businessIncomeRatioLoading = true;
        const time = event.name;
        const BusinessIncomeRatioPramas = { companyName: this.companyName, year: time };
        this.companyEconomicInfoService.findListByUrl(BusinessIncomeRatioPramas, 'companyRevenueShareUrl').subscribe(res => {
            const data = {
                2017:{"timestemp":1529639550524,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"5b877abb-e9d9-42d5-a6eb-3e8a5b09cbd1","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":1200,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"75316988-4b84-49e9-acc1-88cacecd6687","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":352,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"b99c91d6-0f05-4909-9e0a-c7314d1d1f8b","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":500,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"bdb5dcc1-6d33-4528-9def-0e2767fa79bf","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":1100,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"d81e707e-3137-4fb2-a45f-31f910598a7f","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":157,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"f97a4444-075c-4252-97c5-9dda887bfc7d","enterpriseName":"test1","facet":"2","year":"2017","totalMoney":null,"money":850,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
                2016:{"timestemp":1529639635285,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"1d96d4d6-2f56-480d-bd40-6ea217a981a8","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":1850,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"3fcde07e-aaf4-491b-96fa-791e4ac0a2f6","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":200,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"8b676875-03ef-4ac4-8004-34c0cd7df68e","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":100,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"8d4d0f19-87af-4386-b83b-87eaf4b1240c","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":252,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"94e496e1-f9cc-4f79-82ec-7ebddc93d75b","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":157,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"e658ccdf-fcb5-4fda-a500-845c13d63888","enterpriseName":"test1","facet":"2","year":"2016","totalMoney":null,"money":1100,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
                2015: {"timestemp":1529639682720,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"3ae4e1d2-2f51-4627-a14d-233a4f522ea4","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":600,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"5299a6e9-a03a-4922-a5e0-e809bcc29dcd","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":357,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"64db7775-3fb0-4e8e-8bee-48319aa7b6ee","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":452,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"69e3d6ea-f778-4148-9982-9d7d23bf59e1","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":621,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"a17e8044-e39a-44a3-9340-7fff47200a4d","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":320,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"ec4eb106-e213-47c5-a68f-edcc67618c4b","enterpriseName":"test1","facet":"2","year":"2015","totalMoney":null,"money":850,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null},
                2014: {"timestemp":1529640281853,"data":{"pagination":{"currentPage":1,"pageSize":10,"lastRowKey":null},"eIIRevenueAndStaffPojo":[{"rowKey":"5eb2c7d7-1659-487b-937a-c1d664c3d859","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":621,"type":"技术转让","quarter":null,"number":0,"proportion":null},{"rowKey":"67bdd1c6-bc10-4f39-aa0d-e2c2d09bf4ae","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":751,"type":"技术承包","quarter":null,"number":0,"proportion":null},{"rowKey":"96b97bb6-c206-4c0b-896d-a8ee3323318f","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":452,"type":"技术咨询与服务","quarter":null,"number":0,"proportion":null},{"rowKey":"9a00cf07-31f3-4ef2-8a47-c2a6efe1e43d","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":621,"type":"接受委托研究开发","quarter":null,"number":0,"proportion":null},{"rowKey":"db0a491b-341a-4a29-aa79-7a729eb5f42f","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":557,"type":"产品销售","quarter":null,"number":0,"proportion":null},{"rowKey":"e978d7fc-523b-4b8c-ac51-acf15e02f8d7","enterpriseName":"test1","facet":"2","year":"2014","totalMoney":null,"money":316,"type":"商品销售","quarter":null,"number":0,"proportion":null}]},"responseCode":"_200","errorMsg":null}
            }
            let result;
            if (data[time]) {
              result = data[time];
            }else {
                result = res;
            }
            this.creatBusinessIncomeRatioEChart(result.data.eIIRevenueAndStaffPojo, time);
        });
    }
    /*绘制营业收入图表*/
    creatBusinessIncomeEChart(options) {
        // const dataAxis = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
        let dataAxis = [];
        const yMax = 500;
        const dataShadow = [];
        // const tu1 = JSON.parse(options.income);
        const tu1 = options;
        tu1.sort(this.compareFn('year'));
        let data = [];
        for (let i = 0; i < tu1.length; i++) {
            if (tu1[i].year !== String(new Date().getFullYear())) {
                data.push(tu1[i].totalMoney);
                dataAxis.push(tu1[i].year);
            }
        }
        /*7年*/
        if (data.length > 7) {
            data = data.slice(data.length - 7, data.length);
            dataAxis = dataAxis.slice(dataAxis.length - 7, dataAxis.length);
        }

        /*for (let i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }*/

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    const tar = params[0];
                    // console.log(tar)
                    return tar.name + '年总收入' + ' : ' + tar.value + '万';
                }
            },
            title: {
                text: '公司几年内收入变化图',
                left: 'center', // 居中
                top: 20, // 距离上边框距离
                textStyle: {
                    color: '#bcbdbf'          // 主标题文字颜色
                }
            },
            xAxis: {
                name: '年份',
                nameTextStyle: {
                    color: '#bcbdbf'
                },
                position: 'bottom',
                data: dataAxis,
                axisLabel: {
                    inside: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                axisTick: {
                    show: true
                },
                axisLine: {
                    show: true
                },
                z: 10
            },
            yAxis: {
                name: '总销量(万)',
                nameTextStyle: {
                    color: '#bcbdbf'
                },
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#bcbdbf'
                    }
                }
            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [
                { // For shadow
                    type: 'bar',
                    itemStyle: {
                        normal: { color: 'rgba(0,0,0,0.05)' }
                    },
                    barGap: '-100%',
                    barCategoryGap: '40%',
                    data: dataShadow,
                    animation: false
                },
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#1eb5d4'
                        },
                        emphasis: {
                            color: '#1eb5d4'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                return params.data + '万';
                            }
                        }
                    },
                    data: data
                }
            ]
        };
        this.businessIncomeData = option;
    }
    /*绘制员工占比*/
    creatParkNumber(options) {
        const data = { xAxis: [], proportion: [], number: [] };
        // data.xAxis = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'];
        const nowTime = new Date().getFullYear();
        options.number.sort(this.compareFn('year'));
        options.proportion.sort(this.compareFn('year'));
        options.number.forEach((v, i) => {
            if (v.year !== String(nowTime)) {
                data.xAxis.push(v.year);
                data.number.push(v.number);
            }
        });
        options.proportion.forEach((v, i) => {
            if (v.year !== String(nowTime)) {
                data.proportion.push(v.number / 100);
            }
        });
        /*7年*/
        if (data.xAxis.length > 7) {
            data.xAxis = data.xAxis.slice(data.xAxis.length - 7, data.xAxis.length);
            data.proportion = data.proportion.slice(data.proportion.length - 7, data.proportion.length);
            data.number = data.number.slice(data.number.length - 7, data.number.length);
        }
        const echatsTitle = `${nowTime - 6}-${nowTime - 1}`;
        const option4 = {
            title: {
                text: echatsTitle + '在职人员总数',
                left: 'center', // 居中
                textStyle: {
                    color: '#bcbdbf'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
            },
            grid: {
                containLabel: true
            },
            legend: {
                data: ['在职人数', '园区占比(%)']
            },
            xAxis: [{
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: data.xAxis,
                axisLabel: {
                    textStyle: {
                        color: '#bcbdbf'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                name: '在职人数(人)',
                nameTextStyle: {
                    color: '#bcbdbf'
                },
                min: 0,
                axisLabel: {
                    textStyle: {
                        color: '#bcbdbf'
                    }
                }
            },
              /*{
                type: 'value',
                name: '园区占比(%)',
                nameTextStyle: {
                  color: '#bcbdbf'
                },
                min: 0,
                max: 10,
                axisLabel: {
                  formatter: '{value} %',
                  textStyle: {
                    color: '#bcbdbf'
                  }
                }
              }*/
            ],
            series: [{
                name: '在职人数(人)',
                type: 'bar',
                color: ['#1eb5d4'],
                stack: '总数',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function (param) {
                            return param.data + '人';
                        }
                    }
                },
                data: data.number
            },
              /*{
              name: '占比值(%)',
              type: 'line',
              stack: '比值',
              yAxisIndex: 1,
              label: {
                normal: {
                  color: '#fff',
                  show: true,
                  position: 'top',
                }
              },
              lineStyle: {
                normal: {
                  width: 3,
                  color: '#f9b621',
                  shadowBlur: 10,
                  shadowOffsetY: 10
                }
              },
              itemStyle: {
                normal: {
                  color: '#f9b621',
                  lineStyle: {
                    color: '#f9b621'
                  }
                }
              },
              data: data.proportion
            }*/
            ]
        };
        this.parkNumberData = option4;
    }
    /*绘制销量同比图表*/
    creatNumberOfActiveStaff(options) {
        const data = { old: [], new: [] };
        for (let i = 0; i < options.length; i++) {
            if (options[i].year !== String(new Date().getFullYear())) {
                if (options[i].year === String(new Date().getFullYear() - 1)) {
                    data.new.push(options[i]);
                } else if (options[i].year === String(new Date().getFullYear() - 2)) {
                    data.old.push(options[i]);
                }
            }
        }
        let echartNewData1;
        let echartNewData2;
        let echartNewData3;
        let echartNewData4;
        let echartOldData1;
        let echartOldData2;
        let echartOldData3;
        let echartOldData4;
        data.new.forEach((v, i) => {
            if (v.quarter === '第一季度') {
                echartNewData1 = v.totalMoney;
            } else if (v.quarter === '第二季度') {
                echartNewData2 = v.totalMoney;
            } else if (v.quarter === '第三季度') {
                echartNewData3 = v.totalMoney;
            } else if (v.quarter === '第四季度') {
                echartNewData4 = v.totalMoney;
            }
        });
        data.old.forEach((v, i) => {
            if (v.quarter === '第一季度') {
                echartOldData1 = v.totalMoney;
            } else if (v.quarter === '第二季度') {
                echartOldData2 = v.totalMoney;
            } else if (v.quarter === '第三季度') {
                echartOldData3 = v.totalMoney;
            } else if (v.quarter === '第四季度') {
                echartOldData4 = v.totalMoney;
            }
        });
        const echartData = {
            new: [echartNewData1, echartNewData2, echartNewData3, echartNewData4],
            old: [echartOldData1, echartOldData2, echartOldData3, echartOldData4]
        };
        const option2 = {
            title: {
                text: '同比',
                left: 'center', // 居中
                textStyle: {
                    color: '#bcbdbf'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['今年销量', '去年销量'],
                top: 25, // 距离上边框距离
                textStyle: {
                    color: '#bcbdbf'          // 图例文字颜色
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                feature: {
                },
                iconStyle: {}
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['第一季度', '第二季度', '第三季度', '第四季度'],
                axisLabel: {
                    textStyle: {
                        color: '#bcbdbf'
                    }
                }
            },
            yAxis: {
                name: '总销量(万)',
                nameTextStyle: {
                    color: '#bcbdbf'
                },
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#bcbdbf'
                    }
                }
            },
            series: [
                {
                    name: '今年销量',
                    type: 'line',
                    lineStyle: {
                        normal: {
                            color: '#f43723'
                        }
                    },
                    // data:JSON.parse(result.salesVolume).new
                    data: echartData.new
                },
                {
                    name: '去年销量',
                    type: 'line',
                    lineStyle: {
                        normal: {
                            color: '#f9b621'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#f9b621',
                            lineStyle: {
                                color: '#f9b621'
                            }
                        }
                    },
                    // data:JSON.parse(result.salesVolume).old
                    data: echartData.old
                }
            ]
        };
        this.numberOfActiveStaffData = option2;
    }

    /*绘制营业收入占比图表*/
    creatBusinessIncomeRatioEChart(options, time) {
        const data = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].year !== String(new Date().getFullYear())) {
                data.push({ value: options[i].money, name: options[i].type });
            }
        }
        const echartTitle = time + '年收入占比';
        const option3 = {
            //            backgroundColor: '#2c343c',//背景颜色
            title: {
                text: echartTitle,
                left: 'center', // 居中
                top: 20, // 距离上边框距离
                textStyle: {
                    color: '#bcbdbf'
                }
            },

            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}万 ({d}%)'
            },

            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: '收益来源',
                    type: 'pie',
                    radius: '60%', // 饼图大小
                    center: ['50%', '50%'],
                    data: data.sort(function (a, b) { return a.value - b.value; }),
                    roseType: 'radius',
                    label: {
                        normal: {
                            textStyle: {
                                color: '#bcbdbf'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            },
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#c23531',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };
        this.businessIncomeRatioLoading = false;
        this.businessIncomeRatioData = option3;
    }
    /*绘制关系方图表*/
    creatRelationPeople(options) {
        const categories = [
            { name: '自然人' },
            { name: '企业' }
        ];
        const data = { enterpriseName: options[0].enterpriseName, nodes: [], links: [] };
        options.forEach(function (node) {
            const nodeObj = { itemStyle: '', name: '', symbolSize: 10, label: {} };
            nodeObj.itemStyle = null;
            nodeObj.name = node.relationshipCompany;
            // node.value = node.symbolSize;
            nodeObj.label = {
                normal: {
                    show: true
                }
            };
            // node.category = node.attributes.modularity_class;
            data.nodes.push(nodeObj);
        });
        /*加入当前公司*/
        data.nodes.push({ itemStyle: null, name: this.companyName, symbolSize: 15, label: { normal: { show: true } } });
        options.forEach((link) => {
            const linkObj = { source: this.companyName, target: '', label: {} };
            linkObj.target = link.relationshipCompany;
            linkObj.label = {
                normal: {
                    show: true,
                    formatter: link.relationship // 显示在指引线上的文字
                }
            };

            data.links.push(linkObj);
        });
        const guanxiOption = {
            title: {
                text: data.enterpriseName,
                textStyle: {
                    color: '#bcbdbf'
                },
                //                subtext: 'Default layout',
                //                top: 'bottom',
                left: 'center'
            },
            tooltip: {},
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    name: data.enterpriseName,
                    type: 'graph',
                    layout: 'force',
                    data: data.nodes,
                    links: data.links,
                    categories: categories,
                    roam: true,
                    label: {
                        show: true,
                        normal: {
                            position: 'right',
                            formatter: '{b}' // 节点显示文字
                        }
                    },
                    lineStyle: {
                        normal: {
                            opacity: 0.9,
                            color: 'source',
                            curveness: 0.3
                        }
                    }
                }
            ]
        };
        this.relationPeople = guanxiOption;
    }
    /*绘制人员构成占比图表*/
    creatStaffCompositionRatioEChart() {
        /*const option = {
          legend: {},
          tooltip: {},
          dataset: {
            source: [
              ['product', '2012', '2013', '2014', '2015'],
              ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
              ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
              ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4]
            ]
          },
          xAxis: [
            {type: 'category', gridIndex: 0}
          ],
          yAxis: [
            {gridIndex: 0}
          ],
          grid: [
            {bottom: '55%'},
            {top: '55%'}
          ],
          series: [
            // These series are in the first grid.
            {type: 'line', seriesLayoutBy: 'row'},
            {type: 'line', seriesLayoutBy: 'row'},
            {type: 'line', seriesLayoutBy: 'row'}
          ]
        };*/
        const option = {
          color: ['#f43723', '#f9b620', '#1eb5d4'],
          title: {
            text: '人员构成占比',
            left: 'center', // 居中
            textStyle: {
              color: '#bcbdbf'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['大专', '本科', '研究生'],
            top: 25, // 距离上边框距离
            textStyle: {
              color: '#bcbdbf'          // 图例文字颜色
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            nameTextStyle: {
              color: '#bcbdbf'
            },
            min: 0,
            axisLabel: {
              textStyle: {
                color: '#bcbdbf'
              }
            },
            data: ['2013', '2014', '2015', '2016', '2017']
          },
          yAxis: {
            name: '占比(%)',
            type: 'value',
            nameTextStyle: {
              color: '#bcbdbf'
            },
            axisLabel: {
              textStyle: {
                color: '#bcbdbf'
              }
            }
          },
          series: [
            {
              name: '大专',
              type: 'line',
              stack: '总量',
              data: [12, 13, 10, 13, 20]
            },
            {
              name: '本科',
              type: 'line',
              stack: '总量',
              data: [22, 18, 19, 23, 29]
            },
            {
              name: '研究生',
              type: 'line',
              stack: '总量',
              data: [15, 23, 20, 15, 19]
            }
          ]
        };

      this.StaffCompositionRatioData = option;
    }
    /*格式化排序*/
    compareFn(prop) {
        return function (obj1, obj2) {
            let val1 = obj1[prop];
            let val2 = obj2[prop];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        };
    }

}
