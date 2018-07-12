import { Component, OnInit } from '@angular/core';
import { CompanyEconomicForecastService } from './company-economic-forecast.service';

@Component({
  selector: 'app-company-economic-forecast',
  templateUrl: './company-economic-forecast.component.html',
  styleUrls: ['./company-economic-forecast.component.css'],
  providers: [CompanyEconomicForecastService]
})
export class CompanyEconomicForecastComponent implements OnInit {
  echartsParams = {enterpriseName: 'test1'};
  incomeEchatsData: any;
  developEchatsData: any;
  constructor( private companyEconomicForecastService: CompanyEconomicForecastService) { }

  ngOnInit() {
    /*收入预测*/
    this.companyEconomicForecastService.findListByCompanyName(this.echartsParams, 'companyIncomeForecastUrl').subscribe(res => {
      console.log(res.data.fEIProspectsPojos);
      /*规模预测*/
      this.companyEconomicForecastService.findListByCompanyName(this.echartsParams, 'companyScaleForecastUrl').subscribe(scaleres => {
        console.log(scaleres.data.fEIProspectsPojos);
        const options = {number: res.data.fEIProspectsPojos, scale: scaleres.data.fEIProspectsPojos}
        this.creatIncomeEchart(options);
      });
    });
    /*发展预测*/
    this.companyEconomicForecastService.findListByCompanyName(this.echartsParams, 'companyDevelopForecastUrl').subscribe(res => {
      console.log(res.data.fEIProspectsPojos);
      this.creatDevelopEchart(res.data.fEIProspectsPojos);
    });
  }
  /*绘制收入和规模图表*/
  creatIncomeEchart(options) {
    const echatData = {number: [], scale: []};
    options.scale.sort(this.compareFn('year'));
    options.number.sort(this.compareFn('year'));
    const nowTime = Number(options.scale[0].year);
    const xAxisData = [nowTime, nowTime + 1, nowTime + 2, nowTime + 3, nowTime + 4, nowTime + 5, nowTime + 6];
    options.scale.forEach((v, i) => {
      echatData.scale.push({value: v.scaleType - 1, desc: v.scale});
    });
    options.number.forEach((v, i) => {
      echatData.number.push(v.businessIncome);
    });
    console.log(echatData);
    const income0option = {
      title: {
        text: '未来7年经济预测',
        textStyle: {
          color: '#bcbdbf'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(param){
          return '营业收入:' + param[1].data + '万<br/>规模:' + param[0].data.desc;
        }
      },
      grid: {
        right: 60,
        containLabel: false
      },
      legend: {
        data: ['营业收入', '规模'],
        textStyle: {
          color: '#bcbdbf'
        },
        top: 25
      },
      xAxis: [{
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: xAxisData,
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }],
      yAxis: [{
        type: 'category',
        name: '规模',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        min: 0,
        max: 5,
        position: 'right',
        data: ['中小企业', '大型企业', '巨型企业', '规上企业', '国际企业'],
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }, {
        type: 'value',
        name: '营业收入',
        nameTextStyle: {
          color: '#bcbdbf'
        },
        // min: 0,
        // max: 20000,
        position: 'left',
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      }],
      series: [{
        name: '规模',
        type: 'line',
        stack: '规模',
        label: {
          normal: {
            color: '#fff',
            show: true,
            position: 'top',
            formatter: function(param){
              return param.data.desc;
            }
          }
        },
        lineStyle: {
          normal: {
            width: 3,
            color: '#f9b621',
            shadowColor: 'rgba(0,0,0,.4)',
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
        data: echatData.scale
      }, {
        name: '营业收入',
        type: 'bar',
        color: ['#1eb5d4'],
        yAxisIndex: 1,
        stack: '总数',
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: function(param){
              return param.data + '万';
            }
          }
        },
        data: echatData.number
      }]
    };
    this.incomeEchatsData = income0option;
  }
  /*绘制能力指标图表*/
  creatDevelopEchart(options) {
    const echartData = [];
    options.sort(this.compareFn('year'));
    const nowTime = Number(options[0].year);
    const xAxisData = [nowTime + '年', nowTime + 1 + '年', nowTime + 2 + '年', nowTime + 3 + '年', nowTime + 4 + '年'];
    const legendData = ['营业收入增长率'];
    // const xAxisData = [];
    options.forEach((v, i) => {
      echartData.push(v.growthRate);
    })
    const option = {
      title: {
        text: '能力指标',
        left: 'center',
        textStyle: {
          color: '#bcbdbf'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: '8%',
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
        }
      },
      grid: {
        left: '3%',
        top: '30%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        dataView: {readOnly: false},
        magicType: {type: ['line', 'bar']},
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      },
      yAxis: {
        name: '增长率(%)',
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
          name: '营业收入增长率',
          type: 'line',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function(param){
                return param.data + '%';
              }
            }
          },
          data: echartData
        }
      ]
    };
    this.developEchatsData = option;
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
