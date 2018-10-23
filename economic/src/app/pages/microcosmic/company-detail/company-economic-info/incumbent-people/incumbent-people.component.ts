import { Component, OnInit } from '@angular/core';
import { MicrocosmicService } from '../../../microcosmic.service';
import { CompanyEconomicInfoService } from '../company-economic-info.service';
import { ToastModalService } from '../../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-incumbent-people',
  templateUrl: './incumbent-people.component.html',
  styleUrls: ['./incumbent-people.component.css']
})
export class IncumbentPeopleComponent implements OnInit {

  constructor(
    private microcomicService: MicrocosmicService,
    private toastModalService: ToastModalService,
    private companyEconomicInfoService: CompanyEconomicInfoService
  ) { }

  companyName: any;
  parkNumberData: any;
  StaffCompositionRatioData: any;
  ManagementStructureEchartData: any;
  EmploymentStatusEchartData: any;
  peopleTableData: any;
  echartsParams = { name: 'test1', currentPage: 0, pageSize: 20, lastRowKey: '' };
  chooseYear = new Date().getFullYear() - 1;
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
    this.companyName = this.microcomicService.getUrlParams('name');
    this.microcomicService.setCompanyName(this.companyName);
    this.echartsParams.name = this.companyName;
    /*获取企业人数*/
    this.getEnterprisePeople();
    /*获取人员构成数据*/
    this.getEnterprisePeopleByYear(new Date().getFullYear() - 1);
  }
  /*获取企业人数*/
  getEnterprisePeople() {
    const params = {name: this.companyName};
    this.companyEconomicInfoService.findListByUrl(params, 'companyNumberOfActiveStaffByYearUrl').subscribe(res => {
      console.log('企业人数', res)
      this.creatParkNumber(res.data, [2015, 2016, 2017]);
      /*获取园区人数占比数据*/
      /*this.companyEconomicInfoService.findListByUrl(this.echartsParams, 'companyParkNumberUrl').subscribe(proportionres => {
        const options = { number: res.data.eIIRevenueAndStaffPojo, proportion: proportionres.data.eIIRevenueAndStaffPojo };
        this.creatParkNumber(options);
      });*/
    });
  }
  /*获取企业结构人数*/
  getEnterprisePeopleByYear(time) {
    const params = {name: this.companyName, year: time}
    this.companyEconomicInfoService.findListByUrl(params, 'companyNumberOfActiveStaffByYearUrl').subscribe(res => {
      console.log('结构人数', res.data);
      const options = res.data[0];
      if (res.responseCode === '_200') {
        this.peopleTableData = res.data[0];
        /*获取人员构成占比图表*/
        this.creatStaffCompositionRatioEChart(options, time);
        /*获取管理结构情况图表*/
        this.creatManagementStructureEchart(options, time);
        /*获取就业情况图表*/
        this.creatEmploymentStatusEchart(options, time);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*获取所需年份企业结构人数*/
  changeEnterprisePeopleByYear(event) {
    const time = event.name;
    this.chooseYear = time;
    this.getEnterprisePeopleByYear(time);
  }
  /*绘制在职人员总数和占比*/
  creatParkNumber(options, years) {
    const data = { xAxis: [], proportion: [], number: [] };
    // data.xAxis = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'];
    const nowTime = new Date().getFullYear();
    options.sort(this.compareFn('dataSupplyTime'));
    // options.proportion.sort(this.compareFn('year'));
    /*新接口查询不到一些年份的数据，将其设置为0Start*/
    const requestYear: any = {};
    for (let i = 0; i < options.length; i++) {
      requestYear[options[i].dataSupplyTime] = options[i].employees;
    }
    for (let i = 0; i < years.length; i++) {
      if (requestYear[years[i]]) {
        data.number.push(requestYear[years[i]]);
        data.xAxis.push(years[i]);
      }else {
        data.number.push(0);
        data.xAxis.push(years[i]);
      }
    }
    /*新接口查询不到一些年份的数据，将其设置为0End*/
    /*options.proportion.forEach((v, i) => {
      if (v.year !== String(nowTime)) {
        data.proportion.push(v.number / 100);
      }
    });*/
    /*7年*/
    if (data.xAxis.length > 7) {
      data.xAxis = data.xAxis.slice(data.xAxis.length - 7, data.xAxis.length);
      // data.proportion = data.proportion.slice(data.proportion.length - 7, data.proportion.length);
      data.number = data.number.slice(data.number.length - 7, data.number.length);
    }
    const echatsTitle = `公司近三年`;
    const labelTextColor = this.echartInitConfig.labelTextColor;
    const option4 = {
      color: [this.echartInitConfig.colors[0]],
      title: {
        show: false,
        text: echatsTitle + '在职人员总数',
        left: 'center', // 居中
        textStyle: {
          color: '#bcbdbf'
        }
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
      toolbox: {
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
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
            color: labelTextColor
          }
        }
      }],
      yAxis: [{
        type: 'value',
        name: '在职人数(人)',
        nameTextStyle: {
          color: labelTextColor
        },
        min: 0,
        splitLine: {
          show: true,
          lineStyle: this.echartInitConfig.splitLineStyle,
        },
        axisLabel: {
          textStyle: {
            color: labelTextColor
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
        barMaxWidth: '60%',
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
  /*绘制人员构成占比图表*/
  creatStaffCompositionRatioEChart(options, year) {
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
    const data = options ? options : {postgraduate: 0, undergraduate: 0, college: 0};
    const legendData = ['研究生', '本科以上', '大专'];
    // const xAxisData = ['2013', '2014', '2015', '2016', '2017'];
    const xAxisData = ['研究生', '本科以上', '大专'];
    const seriesData = [data.postgraduate, data.undergraduate, data.college];
    const labelTextColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: [this.echartInitConfig.colors[1]],
      title: {
        show: false,
        text: year + '学历结构情况',
        left: 'center', // 居中
        textStyle: {
          color: '#bcbdbf'
        }
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
      legend: {
        data: legendData,
        top: 25, // 距离上边框距离
        textStyle: {
          color: labelTextColor          // 图例文字颜色
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        nameTextStyle: {
          color: labelTextColor
        },
        min: 0,
        axisLabel: {
          textStyle: {
            color: labelTextColor
          }
        },
        data: xAxisData
      },
      yAxis: {
        name: '数量(人)',
        type: 'value',
        nameTextStyle: {
          color: labelTextColor
        },
        splitLine: {
          show: true,
          lineStyle: this.echartInitConfig.splitLineStyle,
        },
        axisLabel: {
          textStyle: {
            color: labelTextColor
          }
        }
      },
      series: [
        {
          name: '人数',
          type: 'bar',
          barMaxWidth: '60%',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (param) {
                return param.data + '人';
              }
            }
          },
          data: seriesData
        },
        /*{
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
        }*/
      ]
    };

    this.StaffCompositionRatioData = option;
  }
  /*绘制管理结构情况图表*/
  creatManagementStructureEchart(options, year) {
    const data = options ? options : {manager: 0, professionalTechnicians: 0, skilledWorker: 0};
    const xAxisData = ['中层管理及以上', '专业技术人员', '技术工人'];
    const seriesData = [data.manager, data.professionalTechnicians, data.skilledWorker];
    const labelTextColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: [this.echartInitConfig.colors[2]],
      title: {
        show: false,
        text: year + '管理结构情况',
        left: 'center', // 居中
        textStyle: {
          color: '#bcbdbf'
        }
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
      legend: {
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        nameTextStyle: {
          color: labelTextColor
        },
        min: 0,
        axisLabel: {
          textStyle: {
            color: labelTextColor
          }
        },
        data: xAxisData
      },
      yAxis: {
        name: '数量(人)',
        type: 'value',
        nameTextStyle: {
          color: labelTextColor
        },
        splitLine: {
          show: true,
          lineStyle: this.echartInitConfig.splitLineStyle,
        },
        axisLabel: {
          textStyle: {
            color: labelTextColor
          }
        }
      },
      series: [
        {
          name: '人数',
          type: 'bar',
          barMaxWidth: '60%',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (param) {
                return param.data + '人';
              }
            }
          },
          data: seriesData
        }
      ]
    };
    this.ManagementStructureEchartData = option;
  }
  /*绘制就业情况图表*/
  creatEmploymentStatusEchart(options, year) {
    const data = options ? options : {newEmployees: 0, graduates: 0};
    const xAxisData = ['新增从业人员', '吸纳高校毕业生'];
    const seriesData = [data.newEmployees, data.graduates];
    const labelTextColor = this.echartInitConfig.labelTextColor;
    const option = {
      color: [this.echartInitConfig.colors[3]],
      title: {
        show: false,
        text: year + '就业情况',
        left: 'center', // 居中
        textStyle: {
          color: '#bcbdbf'
        }
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
      legend: {
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        nameTextStyle: {
          color: labelTextColor
        },
        min: 0,
        axisLabel: {
          textStyle: {
            color: labelTextColor
          }
        },
        data: xAxisData
      },
      yAxis: {
        name: '数量(人)',
        type: 'value',
        nameTextStyle: {
          color: labelTextColor
        },
        splitLine: {
          show: true,
          lineStyle: this.echartInitConfig.splitLineStyle,
        },
        axisLabel: {
          textStyle: {
            color: labelTextColor
          }
        }
      },
      series: [
        {
          name: '人数',
          type: 'bar',
          stack: '总量',
          barMaxWidth: '50%',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (param) {
                return param.data + '人';
              }
            }
          },
          data: seriesData
        }
      ]
    };
    this.EmploymentStatusEchartData = option;
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
