import { Component, OnInit } from '@angular/core';
import { IndustryBoardService } from '../industry-board.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-type-scale',
  templateUrl: './type-scale.component.html',
  styleUrls: ['./type-scale.component.css']
})
export class TypeScaleComponent implements OnInit {

  constructor(
    private industryBoardService: IndustryBoardService,
    private routerInfo: ActivatedRoute,
    private toastModalService: ToastModalService
  ) { }
  typeName = '';
  typeId = '';
  CompositionEchartChoseYear = '';
  scaleData: any;
  CompanyNumberAndPeopleNumberEchartData: any;
  EducationCompositionEchartData: any;
  JobCompositionEchartData: any;
  PatentNumberEchartData: any;
  OtherIntellectualPropertyEchartData: any;
  echartInitConfig = {
    colors: ['#5079d9', '#57ba8c', '#ffcc00', '#7958d6', '#bcbdbf', '#7c7e80'],
    backgroundColor: '#191919',
    titleTextStyle: {
      color: '#7c7e80',
      fontSize: 18,
      fontWeight: 'normal'
    },
    legendStyle: {
      width: '30%',
      itemWidth: 14,
      itemHeight: 14,
      borderRadius: '10px',
    },
    labelTextColor: '#7c7e80',
    gridTop: 100,
    legendTop: 20,
    splitLineStyle: {
      color: '#1f2020',
    },
    lineSmooth: true,
  };
  ngOnInit() {
    this.typeId = this.routerInfo.snapshot.queryParams['id'];
    this.typeName = this.routerInfo.snapshot.queryParams['name'];
    this.getScaleData();
  }
  /*获取数据*/
  getScaleData() {
    const params = {industryClassTypeId: this.typeId};
    this.industryBoardService.requestByParams(params, 'typeScaleProfileUrl').subscribe(res => {
      if (res.responseCode === '_200') {
        this.scaleData = res.data;
        this.creatCompanyNumberAndPeopleNumber(this.scaleData.table_1);
        this.creatEducationCompositionEchart(this.scaleData['table_2&3'][0]);
        this.creatJobCompositionEchart(this.scaleData['table_2&3'][0]);
        this.creatPatentNumberEchart(this.scaleData.table_4);
        this.creatOtherIntellectualPropertyEchart(this.scaleData.table_5);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*根据年份获取职工占比*/
  getEmployeeRatioData(year) {
    const params = {industryClassTypeId: this.typeId, year: year};
    this.industryBoardService.requestByParams(params, 'peopleConstituteUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        const data = res.data[0];
        this.creatEducationCompositionEchart(data);
        this.creatJobCompositionEchart(data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  chartClick(event) {
    const year = event.name;
    this.CompositionEchartChoseYear = year;
    this.getEmployeeRatioData(year);
  }
  /*绘制近三年企业数量和职工人数*/
  creatCompanyNumberAndPeopleNumber(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const xAxisData = [];
    const series = {data1: [], data2: []};
    for (let i = countYear - 1; i >= 0; i--) {
      xAxisData.push(lastYear - i);
      series.data1.push(0);
      series.data2.push(0);
    }
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(Number(item[2]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(2));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][2]));
      series.data1[index] = filterData[i][0] ? filterData[i][0] : 0;
      series.data2[index] = filterData[i][1] ? filterData[i][1] : 0;
    }
    const option = {
      color: [this.echartInitConfig.colors[0]],
      title: {
        show: false,
        text: '近三年企业数量和职工人数',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
        top: this.echartInitConfig.gridTop,
        containLabel: true
      },
      legend: {
        show: false,
        top: this.echartInitConfig.legendTop,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        data: ['企业数量', '职工人数']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '企业(家)',
          nameTextStyle: {
            color: textColor,
          },
          min: 0,
          splitLine: {
            show: true,
            lineStyle: this.echartInitConfig.splitLineStyle,
          },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        },
        {
          type: 'value',
          name: '职工(人)',
          nameTextStyle: {
            color: textColor,
          },
          min: 0,
          splitLine: { show: false },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      series: [
        {
          name: '企业数量',
          type: 'bar',
          barMaxWidth: '30%',
          data: series.data1
        },
        {
          name: '职工人数',
          type: 'line',
          smooth: this.echartInitConfig.lineSmooth,
          yAxisIndex: 1,
          data: series.data2
        }
      ]
    };
    this.CompanyNumberAndPeopleNumberEchartData = option;
  }
  /*绘制职工学历分布*/
  creatEducationCompositionEchart(options) {
    const seriesData = [
      {value: options[0] ? options[0] : 0 , name: '研究生'},
      {value: options[1] ? options[1] : 0 , name: '本科以上'},
      {value: options[2] ? options[2] : 0 , name: '大专'}
    ];
    const echartTitle = this.CompositionEchartChoseYear ? this.CompositionEchartChoseYear + '职工学历层次分布' : '职工学历层次分布';

    const textColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: this.echartInitConfig.colors,
      title : {
        text: '学历学位',
        left: 'center',
        top: '45%',
        textStyle: {
          color: '#bcbdbf',
          fontSize: 24,
          fontWeight: 'normal',
        },
      },
      tooltip : {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        show: false,
        top: 'bottom',
        left: 'center',
        textStyle: {
          color: textColor,
        },
        data: ['研究生', '本科以上', '大专']
      },
      series : [
        {
          name: '学历分布',
          type: 'pie',
          radius : ['40%', '60%'],
          center: ['50%', '50%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.EducationCompositionEchartData = option;
  }
  /*绘制职工岗位构成*/
  creatJobCompositionEchart(options) {
    const seriesData = [
      {value: options[3] ? options[3] : 0 , name: '中层及以上管理人员'},
      {value: options[4] ? options[4] : 0 , name: '专业技术人员'},
      {value: options[5] ? options[5] : 0 , name: '技术工人'}
    ];
    const echartTitle = this.CompositionEchartChoseYear ? this.CompositionEchartChoseYear + '职工岗位类型占比' : '职工岗位类型占比';

    const textColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: this.echartInitConfig.colors,
      title : {
        text: '岗位类型',
        left: 'center',
        top: '45%',
        textStyle: {
          color: '#bcbdbf',
          fontSize: 24,
          fontWeight: 'normal',
        },
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        show: false,
        top: 'bottom',
        left: 'center',
        textStyle: {
          color: textColor,
        },
        data: ['中层及以上管理人员', '专业技术人员', '技术工人']
      },
      series: [
        {
          name: '岗位类型',
          type: 'pie',
          radius : ['40%', '60%'],
          center: ['50%', '50%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.JobCompositionEchartData = option;
  }
  /*绘制近三年专利申请、授权、拥有情况图表*/
  creatPatentNumberEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const xAxisData = [];
    const series = {data1: [], data2: [], data3: []};
    for (let i = countYear - 1; i >= 0; i--) {
      xAxisData.push(lastYear - i);
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
    }
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return xAxisData.includes(Number(item[0]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(0));
    for (let i = 0; i < filterData.length; i++) {
      const index = xAxisData.indexOf(Number(filterData[i][0]));
      series.data1[index] = filterData[i][1] ? filterData[i][1] : 0;
      series.data2[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data3[index] = filterData[i][3] ? filterData[i][3] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '近三年专利申请、授权、拥有情况',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      grid: {
        left: '3%',
        right: 60,
        bottom: '5%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        top: 25,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        itemHeight: this.echartInitConfig.legendStyle.itemHeight,
        data: ['专利申请', '专利授权', '拥有专利']
      },
      xAxis: [
        {
          type: 'value',
          name: '数量(件)',
          nameTextStyle: {
            color: textColor,
          },
          axisPointer: {
            type: 'shadow'
          },
          splitLine: { show: false },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: xAxisData,
          min: 0,
          splitLine: { show: false },
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          }
        }
      ],
      series: [
        {
          name: '专利申请',
          type: 'bar',
          data: series.data1
        },
        {
          name: '专利授权',
          type: 'bar',
          data: series.data2
        },
        {
          name: '拥有专利',
          type: 'bar',
          data: series.data3
        }
      ]
    };
    this.PatentNumberEchartData = option;
  }
  /*绘制近三年其他知识产权拥有情况*/
  creatOtherIntellectualPropertyEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const yAxisData = [];
    const series = {data1: [], data2: [], data3: [], data4: [], data5: [], data6: []};
    for (let i = countYear - 1; i >= 0; i--) {
      yAxisData.push(lastYear - i);
      series.data1.push(0);
      series.data2.push(0);
      series.data3.push(0);
      series.data4.push(0);
      series.data5.push(0);
      series.data6.push(0);
    }
    /*筛选出所需数据*/
    const filterData = options.filter((item) => {
      return yAxisData.includes(Number(item[0]));
    });
    /*按时间排序*/
    filterData.sort(this.compareFn(0));
    for (let i = 0; i < filterData.length; i++) {
      const index = yAxisData.indexOf(Number(filterData[i][0]));
      series.data1[index] = filterData[i][1] ? filterData[i][1] : 0;
      series.data2[index] = filterData[i][2] ? filterData[i][2] : 0;
      series.data3[index] = filterData[i][3] ? filterData[i][3] : 0;
      series.data4[index] = filterData[i][4] ? filterData[i][4] : 0;
      series.data5[index] = filterData[i][5] ? filterData[i][5] : 0;
      series.data6[index] = filterData[i][6] ? filterData[i][6] : 0;
    }
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '近三年其他知识产权拥有情况',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
        top: 130,
        containLabel: true
      },
      tooltip : {
        trigger: 'axis',
        confine: true,
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        top: this.echartInitConfig.legendTop,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        // width: '100',
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        itemHeight: this.echartInitConfig.legendStyle.itemHeight,
        data: ['商标', '科技论文', '软件著作权', '国际标准', '国家或行业标准', '国家科技奖励']
      },
      xAxis:  {
        type: 'category',
        axisPointer: {
          type: 'shadow'
        },
        splitLine: { show: false },
        axisLabel: {
          textStyle: {
            color: textColor,
          }
        },
        data: yAxisData
      },
      yAxis: {
        type: 'value',
        name: '数量',
        nameTextStyle: {
          color: textColor,
        },
        axisLabel: {
          textStyle: {
            color: textColor,
          }
        },
        splitLine: {
          show: true,
          lineStyle: this.echartInitConfig.splitLineStyle,
        }
      },
      series: [
        {
          name: '商标',
          type: 'bar',
          stack: '总量',
          barMaxWidth: '40%',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data1
        },
        {
          name: '科技论文',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data2
        },
        {
          name: '软件著作权',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data3
        },
        {
          name: '国际标准',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data4
        },
        {
          name: '国家或行业标准',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data5
        },
        {
          name: '国家科技奖励',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: series.data6
        }
      ]
    };
    this.OtherIntellectualPropertyEchartData = option;
  }
  /*格式化排序*/
  compareFn(prop, type?) {
    return function (obj1, obj2) {
      let val1 = obj1[prop];
      let val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (type === 'asc') {
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      }else {
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      }
    };
  }

}
