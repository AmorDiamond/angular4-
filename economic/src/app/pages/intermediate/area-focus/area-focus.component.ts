import { Component, OnInit } from '@angular/core';
import { ToastModalService } from '../../../shared/toast-modal/toast-modal.service';
import { AreaFocusService } from './area-focus.service';

@Component({
  selector: 'app-area-focus',
  templateUrl: './area-focus.component.html',
  styleUrls: ['./area-focus.component.css']
})

export class AreaFocusComponent implements OnInit {

  optionsOne: any;
  optionsTwo: any;
  optionsThree: any;
  optionsFour: any;
  optionsFive: any;
  colors = ['#5079d9', '#ffcc00', '#57ba8c', '#5d9ed0', '#bc79c2', '#35508e', '#90caaf', '#bcbdbf', '#7c7e80', '#7958d6', '#78d05d', '#c3c062', '#327355', '#87a3e4', '#9385b9'];

  constructor(
    private ireaFocusService: AreaFocusService,
    private toastModalService: ToastModalService
  ) { }

  ngOnInit() {

    this.getDataOne();
    this.getDataTwoThree();
    this.getDataFour();
    this.getDataFive();
  }


  // /v1/mediumArea/industryHeatMap  各功能区的产业热力图
  private urlOne = 'assets/jsonData/middle/industryHeatMap.json';
  getDataOne() {
    this.ireaFocusService.requestByParams({}, 'urlOne').subscribe(res => {
      console.log('各功能区的产业热力图', res);
      if (res.responseCode === '_200') {


        let xAxisData = [];
        let yAxisData = [];
        let dataAll = [];
        let allData = [];
        for (let i = 0; i < res.data.length; i++) {
          // xAxisData.push(res.data[i].industryType);

          allData.push(res.data[i].companyNumber);

          if (xAxisData.indexOf(res.data[i].industryType) == -1) {
            xAxisData.push(res.data[i].industryType);
          }

          if (yAxisData.indexOf(res.data[i].area) == -1) {
            yAxisData.push(res.data[i].area);
          }
          dataAll.push([xAxisData.indexOf(res.data[i].industryType), yAxisData.indexOf(res.data[i].area), res.data[i].companyNumber]);
        }

        console.log('xyData', xAxisData, yAxisData, dataAll, allData);

        this.optionsOne = {
          tooltip: {
            position: 'top'
          },
          color: this.colors,
          animation: false,
          grid: {
            left: '4%',
            right: '6%',
            bottom: '25%',
            top: 30,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            splitArea: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: ['#7a7b7c']
              }
            },
            nameTextStyle: {
              color: ['#7a7b7c']
            },
            axisLine: {
              lineStyle: {
                color: '#7a7b7c',
                width: 1
              }
            }
          },
          yAxis: {
            type: 'category',
            data: yAxisData,
            splitArea: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: ['#7a7b7c']
              }
            },
            nameTextStyle: {
              color: ['#7a7b7c']
            },
            axisLine: {
              lineStyle: {
                color: '#7a7b7c',
                width: 1
              }
            }
          },
          visualMap: {
            min: 0,
            max: allData.sort(function (a, b) {
              return b-a;
            })[0],
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '3%'
          },
          series: [{
            name: '企业数量',
            type: 'heatmap',
            data: dataAll,
            label: {
              normal: {
                show: true
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };

      }
    });




  }


  //urlFive
  //各功能区的企业和职工占比情况
  getDataTwoThree() {
    let year = (new Date().getFullYear()) - 1;
    this.ireaFocusService.requestByParams({ year: year }, 'urlFive').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        let areas = [];
        let CompanyData = [];
        let personData = [];
        for (let i = 0; i < res.data.length; i++) {
          areas.push(res.data[i].area);
          let CompanyItem = { value: res.data[i].totalCompany, name: res.data[i].area };
          let personItem = { value: res.data[i].totalPerson, name: res.data[i].area };
          CompanyData.push(CompanyItem);
          personData.push(personItem);
        }


        // ===============================================
        //2.2.1
        this.optionsTwo = {
          // title:{
          //   text:'各功能区的企业数量占比情况',
          //   left:'center'
          // },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          color: this.colors,
          legend: {
            orient: 'vertical',
            x: 'right',
            data: areas,
            top: 30,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          series: [
            {
              name: '企业数量（家）',
              type: 'pie',
              center: ['50%', '50%'],
              radius: ['30%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '18',
                    // fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: CompanyData
            }
          ]
        };

        // ===============================================
        //2.2.2
        this.optionsThree = {
          // title:{
          //   text:'各功能区的职工占比情况',
          //   left:'center'
          // },
          // width: 'auto',
          // height: 'auto',
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            // textStyle:{
            //   fontSize:18
            // }
          },
          color: this.colors,
          legend: {
            orient: 'vertical',
            x: 'right',
            data: areas,
            top: 30,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          series: [
            {
              name: '职工总数（人）',
              type: 'pie',
              radius: ['30%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '18',
                    // fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: personData
            }
          ]
        };

      }
    });
  }

  // 各功能区的营收，税收，利润,政府支持情况    /v1/mediumArea/businessPanel
  getDataFour() {
    console.log('0000000');
    this.ireaFocusService.requestByParams({ year: (new Date().getFullYear()) - 1 }, 'urlThree').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {

        let areas = [];

        // 营收，税收，利润
        // Revenues, taxes, profits
        let profitData = [];
        let taxesData = [];
        let revenuesData = [];
        let standbyData = [];

        for (let i = 0; i < res.data.length; i++) {
          areas.push(res.data[i].area);
          revenuesData.push(res.data[i].operatingIncome);
          profitData.push(res.data[i].profit);
          taxesData.push(res.data[i].tax);
          standbyData.push(-res.data[i].standby)
        }
        console.log(areas, profitData, taxesData, revenuesData, standbyData)

        this.optionsFour = {
          // title: {
          //   text: '各功能区的营收、税收、利润、政府支持情况',
          //   left:'center'
          //   // textStyle: {
          //   //   width:'100%',
          //   //   align: 'center',
          //   //   color:'#ff3500'
          //   // }
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          color: this.colors,
          legend: {
            data: ['利润', '税收', '营收', '政府支持'],
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '4%',
            right: '6%',
            bottom: '4%',
            top: 30,
            containLabel: true
          },
          xAxis: [
            {
              type: 'value',
              splitLine: {
                lineStyle: {
                  color: ['#7a7b7c']
                }
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: areas,
              splitLine: {
                lineStyle: {
                  color: ['#7a7b7c']
                }
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              }
            }
          ],
          series: [
            {
              name: '利润',
              type: 'bar',
              // stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              },
              data: profitData
            },
            {
              name: '税收',
              type: 'bar',
              // stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              },
              data: taxesData
            },
            {
              name: '营收',
              type: 'bar',
              // stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              },
              data: revenuesData
            },
            {
              name: '政府支持',
              type: 'bar',
              // stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'left'
                }
              },
              data: standbyData
            }
          ]
        };
      }
    });
  }

  // 各功能区的人均主营收入、人均税收、人均利润情况    /v1/mediumArea/perCapitaBusinessPanel
  getDataFive() {
    console.log('0000000');
    this.ireaFocusService.requestByParams({ year: (new Date().getFullYear()) - 1 }, 'urlFour').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        // this.creatRelationChart(res.data);

        let areas = [];
        let perCapitaIncome = [],
          perCapitaProfit = [],
          perCapitaTax = [];

        for (let i = 0; i < res.data.length; i++) {
          areas.push(res.data[i].area);
          perCapitaIncome.push(res.data[i].perCapitaIncome);
          perCapitaProfit.push(res.data[i].perCapitaProfit);
          perCapitaTax.push(res.data[i].perCapitaTax);
        }

        console.log('optionsFive', areas,
          perCapitaIncome,
          perCapitaProfit,
          perCapitaTax);

        this.optionsFive = {
          // title: {
          //   text: '各功能区的人均主营收入、人均税收、人均利润情况',
          //   left:'center'
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          color: this.colors,
          legend: {
            data: ["人均主营收入", "人均税收", "人均利润"],
            textStyle: {
              color: '#7a7b7c'
            }
            // top:'30'
          },
          // toolbox: {
          //   feature: {
          //     saveAsImage: {}
          //   }
          // },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '4%',
            top: 30,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              // boundaryGap: false,
              data: areas,
              splitLine: {
                lineStyle: {
                  color: ['#7a7b7c']
                }
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                lineStyle: {
                  color: ['#7a7b7c']
                }
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              }
            }
          ],
          series: [
            // {
            //   name: '人均主营收入',
            //   type: 'line',
            //   stack: '总量',
            //   areaStyle: {},
            //   data: perCapitaIncome
            // },
            // {
            //   name: '人均税收',
            //   type: 'line',
            //   stack: '总量',
            //   areaStyle: {},
            //   data: perCapitaTax
            // },
            // {
            //   name: '人均利润',
            //   type: 'line',
            //   stack: '总量',
            //   areaStyle: {},
            //   data: perCapitaProfit
            // },
            {
              name: '人均主营收入',
              type: 'bar',
              // stack: '总量',
              // areaStyle: {},
              data: perCapitaIncome,
              markLine: {
                lineStyle: {
                  normal: {
                    type: 'dashed'
                  }
                },
                data: [
                  [{ type: 'min' }, { type: 'max' }]
                ]
              }
            },
            {
              name: '人均税收',
              type: 'bar',
              // stack: '总量',
              // areaStyle: {},
              data: perCapitaTax,
              markLine: {
                lineStyle: {
                  normal: {
                    type: 'dashed'
                  }
                },
                data: [
                  [{ type: 'min' }, { type: 'max' }]
                ]
              }
            },
            {
              name: '人均利润',
              type: 'bar',
              // stack: '总量',
              // areaStyle: {},
              data: perCapitaProfit,
              markLine: {
                lineStyle: {
                  normal: {
                    type: 'dashed'
                  }
                },
                data: [
                  [{ type: 'min' }, { type: 'max' }]
                ]
              }
            }

            // },
            // {
            //     name:'直接访问',
            //     type:'line',
            //     stack: '总量',
            //     areaStyle: {normal: {}},
            //     data:[320, 332, 301, 334, 390, 330, 320]
            // },
            // {
            //     name:'搜索引擎',
            //     type:'line',
            //     stack: '总量',
            //     label: {
            //         normal: {
            //             show: true,
            //             position: 'top'
            //         }
            //     },
            //     areaStyle: {normal: {}},
            //     data:[820, 932, 901, 934, 1290, 1330, 1320]
            // }
          ]
        };


      }
    });
  }
}
