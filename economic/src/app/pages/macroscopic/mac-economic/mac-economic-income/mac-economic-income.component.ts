import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { MacEconomicIncomeService } from './mac-economic-income.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
declare var $: any;

@Component({
  selector: 'app-mac-economic-income',
  templateUrl: './mac-economic-income.component.html',
  styleUrls: ['../mac-economic-gdp/mac-economic-gdp.component.css']
})
export class MacEconomicIncomeComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  // 人均收入
  incomeOptions: any;
  // 收入类型
  incomeTypeOptions: any;
  revenueTime = new Date().getFullYear() - 1;
  peopleIncomeDataList = [];
  constructor(
    private macEconomicIncomeService: MacEconomicIncomeService,
    private toastModalService: ToastModalService
  ) { }

  ngOnInit() {

    /*时间控制*/
    $('#datetimepicker-maceco').datetimepicker({
      autoclose: 1,
      startView: 4,
      minView: 4,
      forceParse: 0,
      startDate: 2015,
      endDate: new Date().getFullYear(),
      initialDate: new Date().getFullYear() - 1
    }).on('changeYear', (ev) => {
      const chooseTime = new Date(ev.date.valueOf()).getFullYear();
      this.revenueTime = chooseTime;
      this.getPeopleIncomeInfo(this.revenueTime);
      // this.getPeopleIncomeRateInfo(this.revenueTime);
    });

    this.getPeopleIncomeInfo(this.revenueTime);
    // this.getPeopleIncomeRateInfo(this.revenueTime);
  }

  ngOnDestroy() {}
  /*获取人均收入数据*/
  getPeopleIncomeInfo(year) {
    const params = {year: year, area: '高新区'};
    this.macEconomicIncomeService.findListByParams(params, 'macPeopleIncomeUrl').subscribe(res => {
      console.log('获取人均收入', res)
      if (res.responseCode === '_200') {
        this.peopleIncomeDataList = res.data ? res.data.sort(this.stringCompareFn('quarterInfo')) : this.peopleIncomeDataList;
        const formatData = {xAxis: [], series: {urbanAndRural: [], urbanAndRuralSpeed: [], town: [], townSpeed: [], rural: [], ruralSpeed: []}};
        this.peopleIncomeDataList.forEach(item => {
          formatData.xAxis.push(item.quarterInfo);
          /*城乡*/
          formatData.series.urbanAndRural.push(item.urbanAndRuralAverageIncome);
          formatData.series.urbanAndRuralSpeed.push(item.urbanAndRuralAverageIncomeRate);
          /*城镇*/
          formatData.series.town.push(item.citizensAverageIncome);
          formatData.series.townSpeed.push(item.citizensAverageIncomeRate);
          /*农村*/
          formatData.series.rural.push(item.ruralAverageIncome);
          formatData.series.ruralSpeed.push(item.ruralAverageIncomeRate);
        });
        this.creatIncomeAndSpeedEchart(formatData);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });

  }
  /*获取人均收入占比数据*/
  getPeopleIncomeRateInfo(year) {
    const time = year;
    this.macEconomicIncomeService.findListByParams({year: time}, 'macPeopleIncomeRateUrl').subscribe(res => {
      console.log('人均收入占比', res)
      if (res.responseCode === '_200') {
        const options = res.data.macroPublicAvgincome;
        this.creatIncomeTypeRateEchart(options);
      }
    });
  }
  /*绘制高新区人均收入和增速图表*/
  creatIncomeAndSpeedEchart(options) {

    const echartsTitleAlign = 'center';
    const xAxisData = options.xAxis;
    const urbanAndRuralData = options.series.urbanAndRural;
    const urbanAndRuralSpeedData = options.series.urbanAndRuralSpeed;
    const townData = options.series.town;
    const townSpeedData = options.series.townSpeed;
    const ruralData = options.series.rural;
    const ruralSpeedData = options.series.ruralSpeed;
    const legendData = ['城乡人均收入', '城镇人均收入', '农民人均收入', '城乡增速', '城镇增速', '农民增速'];
    const incomeOptions = {
      color: ['#1eb5d4', '#f9b621', '#675bba'],
      title: {
        show: true,
        text: '高新区人均收入',
        left: echartsTitleAlign,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
        },
        top: 30
      },
      grid: {
        left: '15%',
        top: '20%'
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            textStyle: {
              color: '#B2B2B2'
            }
          }
        }
      ],
      yAxis: [
        {
          name: '元',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          type: 'value',
          min: 0,
          splitLine: { show: false },
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: '{value} 元',
            textStyle: {
              color: '#bcbdbf'
            }
          }
        },
        {
          type: 'value',
          name: '同比增速',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          min: 0,
          position: 'right',
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              show: true
            }
          },
          axisLabel: {
            formatter: '{value} %',
            textStyle: {
              color: '#bcbdbf'
            }
          }
        }
      ],
      series: [
        {
          name: '城乡人均收入',
          type: 'bar',
          data: urbanAndRuralData,
          label: {
            normal: {
              show: true,
              offset: [5, -20],
              position: 'top',
              formatter: function (param) {
                return param.data + '元';
              }
            }
          }
        },
        {
          name: '城镇人均收入',
          type: 'bar',
          data: townData,
          label: {
            normal: {
              show: true,
              offset: [5, -20],
              position: 'top',
              formatter: function (param) {
                return param.data + '元';
              }
            }
          }
        },
        {
          name: '农民人均收入',
          type: 'bar',
          data: ruralData,
          label: {
            normal: {
              show: true,
              offset: [5, -20],
              position: 'top',
              formatter: function (param) {
                return param.data + '元';
              }
            }
          }
        },
        {
          name: '城乡增速',
          type: 'line',
          yAxisIndex: 1,
          data: urbanAndRuralSpeedData,
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
              formatter: function (param) {
                return param.data + '%';
              }
            }
          }
        },
        {
          name: '城镇增速',
          type: 'line',
          yAxisIndex: 1,
          data: townSpeedData,
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
              formatter: function (param) {
                return param.data + '%';
              }
            }
          }
        },
        {
          name: '农民增速',
          type: 'line',
          yAxisIndex: 1,
          data: ruralSpeedData,
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
              formatter: function (param) {
                return param.data + '%';
              }
            }
          }
        }
      ]
    };
    this.incomeOptions = incomeOptions;
  }
  /*绘制收入类型占比图表*/
  creatIncomeTypeRateEchart(options) {

    const echartsTitleAlign = 'center';
    const incomeTypeOptions = {
      title: {
        text: '收入类型占比',
        left: echartsTitleAlign,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}%'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['土木工程', '互联网及软件', '机械制造', '其他'],
        textStyle: {
          color: '#bcbdbf'
        }
      },
      series: [
        {
          name: '收入类型占比',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              formatter: '{b}: {c}%',
              textStyle: {
                fontSize: '25',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: 15, name: '土木工程' },
            { value: 34, name: '互联网及软件' },
            { value: 21, name: '机械制造' },
            { value: 30, name: '其他' }
          ]
        }
      ]
    };
    this.incomeTypeOptions = incomeTypeOptions;
  }

  /*格式化排序*/
  stringCompareFn(prop, type?) {
    return function (obj1, obj2) {
      const val1 = obj1[prop];
      const val2 = obj2[prop];
      return val1.localeCompare(val2);
    };
  }
}
