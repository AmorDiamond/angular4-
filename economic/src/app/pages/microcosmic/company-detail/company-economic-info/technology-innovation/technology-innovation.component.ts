import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyEconomicInfoService } from '../company-economic-info.service';
import { ToastModalService } from '../../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-technology-innovation',
  templateUrl: './technology-innovation.component.html',
  styleUrls: ['./technology-innovation.component.css']
})
export class TechnologyInnovationComponent implements OnInit {

  constructor(
    private microcomicService: MicrocosmicService,
    private toastModalService: ToastModalService,
    private companyEconomicInfoService: CompanyEconomicInfoService
  ) { }
  companyName: any;
  OrganizationEchartData: any;
  OrganizationPeopleEchartData: any;
  ExpenditureEchartData: any;
  IntellectualPropertyEchartData: any;

  ngOnInit() {
    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    /*获取科技创新机构数据*/
    this.getOrganizationData();
    /*获取经费支出数据*/
    // this.getExpenditureData();
    /*获取知识产权数据*/
    this.getIntellectualPropertyData();
  }
  /*获取机构数据和经费支出数据*/
  getOrganizationData() {
    const time = new Date().getFullYear() - 1;
    this.companyEconomicInfoService.findListByUrl({name: this.companyName, year: time}, 'OrganizationExpenditureUrl').subscribe(res => {
      console.log('机构数据', res)
      if (res.responseCode === '_200') {
        // const options = { xAxis: [2013, 2014, 2015, 2016, 2017], number: [100, 120, 130, 180, 190], people: [1000, 2000, 2500, 3200, 5000] };
        const number = res.data[0] ? res.data[0].numberOfInstitutions : 0;
        const people = res.data[0] ? res.data[0].totalAgencyStaff : 0;
        const money = res.data[0] ? res.data[0].institutionalExpenditures : 0;
        const options = { xAxis: [], number: [number], people: [people], money: [money] };
        /*绘制机构数据图表*/
        this.creatOrganizationEchart(options);
        /*绘制机构人数图表*/
        this.creatOrganizationPeopleEchart(options);
        /*绘制经费支出数据图表*/
        this.creatExpenditureEchart(money);
        // this.creatOrganizationEchartOld(options);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*获取知识产权数据*/
  getIntellectualPropertyData() {
    const time = new Date().getFullYear() - 1;
    const params = {name: this.companyName};
    this.companyEconomicInfoService.findListByUrl(params, 'IntellectualPropertyUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        const data = res.data;
        const options = {
          xAxis: ['商标数', '专利数', '软件著作权数', '集成电路布图数', '国家科技奖励数', '国际标准数', '国内或行业标准数'],
          number: [
            data.trademarkTotal ? data.trademarkTotal : 0,
            data.effectivePatent ? data.effectivePatent : 0,
            data.softwareCopyright ? data.softwareCopyright : 0,
            data.integratedCircuitLayout ? data.integratedCircuitLayout : 0,
            data.technologyAward ? data.technologyAward : 0,
            data.internationalStandard ? data.internationalStandard : 0,
            data.industryStandard ? data.industryStandard : 0
          ]
        };
        /*绘制知识产权数据图表*/
        this.creatIntellectualPropertyEchart(options);
      }
    });
    /*this.companyEconomicInfoService.getRequestByForkJoin(this.companyName, time, ['IntellectualPropertyUrl', 'PatentUrl']).subscribe(res => {
      console.log('知识产权和专利数据', res)
      let options;
      if (res[0].responseCode === '_200') {
        const data = res[0].data[0];
        options = {
          xAxis: ['商标数', '专利数', '软件著作权数', '集成电路布图数', '国家科技奖励数', '国际标准数', '国内或行业标准数'],
          number: [
            data ? data.trademarkTotal : 0,
            0,
            data ? data.softwareCopyright : 0,
            data ? data.integratedCircuitLayout : 0,
            data ? data.technologyAward : 0,
            data ? data.internationalStandard : 0,
            data ? data.industryStandard : 0
          ]
        };
      }
      /!*单独获取专利数*!/
      if (res[1].responseCode === '_200') {
        options.number[1] = res[1].data.patentPojos.length ? res[1].data.patentPojos.length : 0;
      }
      /!*绘制知识产权数据图表*!/
      this.creatIntellectualPropertyEchart(options);
    });*/
  }
  /*绘制机构数据图表数据*/
  creatOrganizationEchartOld(options) {
    // const data = { xAxis: [], number: [], people: [] };
    const data = options;
    const echatsTitle = new Date().getFullYear() - 1;
    const option = {
      title: {
        text: echatsTitle + '机构数据',
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
        top: '25%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        data: ['机构数', '机构人员', '经费支出'],
        textStyle: {
          color: '#bcbdbf'
        },
        top: '8%'
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
        name: '机构数/机构人员',
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
        {
          type: 'value',
          name: '经费支出(元)',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          min: 0,
          axisLabel: {
            // formatter: '{value} %',
            textStyle: {
              color: '#bcbdbf'
            }
          }
        }
      ],
      series: [{
        name: '机构数',
        type: 'bar',
        color: ['#1eb5d4'],
        // stack: '总数',
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: function (param) {
              return param.data + '家';
            }
          }
        },
        data: data.number
      },
        {
        name: '机构人员',
        type: 'bar',
        color: ['#f9b621'],
        // stack: '总数',
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: function (param) {
              return param.data + '人';
            }
          }
        },
        data: data.people
      },
        {
        name: '经费支出',
        type: 'bar',
        // color: ['#1eb5d4'],
        yAxisIndex: 1,
        // stack: '总数',
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: function (param) {
              return param.data + '元';
            }
          }
        },
        data: data.money
      },
        /*{
        name: '经费支出',
        type: 'bar',
        stack: '总数',
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
        data: data.money
      }*/
      ]
    };
    this.OrganizationEchartData = option;
  }
  creatOrganizationEchart(options) {
    // const data = { xAxis: [], number: [], people: [] };
    const data = options;
    const echatsTitle = new Date().getFullYear() - 1;
    const option = {
      title: {
        text: echatsTitle + '机构数据',
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
        top: '25%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        textStyle: {
          color: '#bcbdbf'
        },
        top: '10%'
      },
      xAxis: [{
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: ['机构数'],
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }],
      yAxis: [{
        type: 'value',
        name: '机构数(家)',
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
          name: '机构人员(人)',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          min: 0,
          axisLabel: {
            // formatter: '{value} %',
            textStyle: {
              color: '#bcbdbf'
            }
          }
        }*/
      ],
      series: [{
        name: '机构数',
        type: 'bar',
        color: ['#1eb5d4'],
        barMaxWidth: '40%',
        // stack: '总数',
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: function (param) {
              return param.data + '家';
            }
          }
        },
        data: data.number
      },
        /*{
        name: '机构人员',
        type: 'bar',
        // stack: '总数',
        yAxisIndex: 1,
        label: {
          normal: {
            color: '#fff',
            show: true,
            position: 'top',
            formatter: function (param) {
              return param.data + '人';
            }
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
        data: data.people
      }*/
      ]
    };
    this.OrganizationEchartData = option;
  }
  creatOrganizationPeopleEchart(options) {
    // const data = { xAxis: [], number: [], people: [] };
    const data = options;
    const echatsTitle = new Date().getFullYear() - 1;
    const option = {
      title: {
        text: echatsTitle + '机构人员数据',
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
        top: '25%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        textStyle: {
          color: '#bcbdbf'
        },
        top: '10%'
      },
      xAxis: [{
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: ['机构人员'],
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }],
      yAxis: [{
        type: 'value',
        name: '机构人员(人)',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        min: 0,
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }
      ],
      series: [{
        name: '机构人员',
        type: 'bar',
        color: ['#1eb5d4'],
        barMaxWidth: '40%',
        // stack: '总数',
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: function (param) {
              return param.data + '人';
            }
          }
        },
        data: data.people
      }
      ]
    };
    this.OrganizationPeopleEchartData = option;
  }
  /*绘制经费支出数据图表*/
  creatExpenditureEchart(options) {

    const data = {xAxis: [], number: [options]};
    const echatsTitle = new Date().getFullYear() - 1;
    const option = {
      title: {
        text: echatsTitle + '经费支出',
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
        top: '25%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        textStyle: {
          color: '#bcbdbf'
        },
        top: '10%'
      },
      xAxis: [{
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: ['经费支出'],
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }],
      yAxis: [{
        type: 'value',
        name: '经费支出(元)',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        min: 0,
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }
      ],
      series: [{
        name: '经费支出',
        type: 'bar',
        color: ['#1eb5d4'],
        barMaxWidth: '40%',
        // stack: '总数',
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: function (param) {
              return param.data + '元';
            }
          }
        },
        data: data.number
      }
      ]
    };
    this.ExpenditureEchartData = option;
  }
  /*绘制知识产权数据图表*/
  creatIntellectualPropertyEchart(options) {
    const data = options;
    const legendData = data.xAxis;
    const echatsTitle = new Date().getFullYear() - 1;
    const option = {
      title: {
        text: echatsTitle + '知识产权数据',
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
        // top: '10%',
        // containLabel: true
      },
      legend: {
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
        },
        top: '10%'
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
        nameTextStyle: {
          color: '#bcbdbf'
        },
        min: 0,
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }
      ],
      series: [{
        name: '知识产权',
        type: 'bar',
        color: ['#1eb5d4'],
        stack: '总数',
        label: {
          normal: {
            show: true,
            position: 'top',
            /*formatter: function (param) {
              return param.data + '家';
            }*/
          }
        },
        data: data.number
      }
      ]
    };
    this.IntellectualPropertyEchartData = option;
  }

}
