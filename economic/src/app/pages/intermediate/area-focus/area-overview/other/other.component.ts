import { Component, OnInit } from '@angular/core';
import { AreaFocusService } from '../../area-focus.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {



  optionOne: any;
  optionTwo: any;
  optionThree: any;
  optionFour: any;
  colors =['#5079d9', '#ffcc00', '#57ba8c', '#5d9ed0','#bc79c2','#35508e','#90caaf','#bcbdbf','#7c7e80','#7958d6','#78d05d','#c3c062','#327355','#87a3e4','#9385b9'];

  echartInitConfig = {
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
  constructor(
    private ireaFocusService: AreaFocusService,
    private routerInfo: ActivatedRoute
  ) { }


  area = '';
  isWest = true;
  ngOnInit() {

    this.area = this.routerInfo.snapshot.queryParams['area'];
    this.isWest = this.area == '高新西区';

    this.getOtherDataOne();
    this.getOtherDataTwo();
    this.getOtherDataThree();
    this.getOtherDataFour();

  }

  year = [2015, 2016, 2017];
  support = [58, 69, 89];
  totalataxesOutput = [88, 89, 69];
  proportion = [68, 88, 98];



  // /v1/mediumArea/relocationOfEnterprises   高新区近几年企业迁出情况
  // private otherUrlOne = '/v1/mediumArea/relocationOfEnterprises';
  getOtherDataOne() {

    this.ireaFocusService.requestByParams({ isWest: this.isWest, year: (new Date().getFullYear()) - 1 }, 'otherUrlOne').subscribe(res => {
      console.log('高新区近几年企业迁出情况', res);
      if (res.responseCode === '_200') {


        let companyCount = [];      //企业数量
        let emigrationRate = [];    //迁出率
        let moveOutCount = [];      //迁出企业数
        let years = [];

        for (let i = 0; i < res.data.length; i++) {
          companyCount.push(res.data[i].companyCount);
          emigrationRate.push(res.data[i].emigrationRate);
          moveOutCount.push(res.data[i].moveOutCount);
          years.push(res.data[i].year);
        }


        this.optionOne = {
          // backgroundColor:'#191919',
          title: {
            text: "高新区近几年企业迁出情况",
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18,
              fontWeight: 'normal',
            },
            padding: 15
          },
          color: this.colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['企业数量', '迁出企业数', '迁出率'],
            top: 50,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            top: 90,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: years,
              axisTick: {
                alignWithLabel: true
              },
              splitLine: {
                show: true,
                lineStyle: this.echartInitConfig.splitLineStyle,
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
              name: '企业数量',
              // min: 0,
              // max: 250,
              position: 'left',
              splitLine: {
                show: true,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '迁出企业数 ',
              // min: 0,
              // max: 250,
              position: 'right',
              splitLine: {
                show: false,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '迁出率',
              // min: 0,
              // max: 250,
              position: 'right',
              offset: 60,
              splitLine: {
                show: false,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '企业数量',
              type: 'bar',
              // barWidth: '60%',
              data: companyCount
            },
            {
              name: '迁出企业数',
              type: 'bar',
              // barWidth: '60%',
              yAxisIndex: 1,
              data: moveOutCount
            },
            {
              name: '迁出率',
              type: 'line',
              yAxisIndex: 2,
              // barWidth: '60%',
              data: emigrationRate
            },
          ]
        }

      }
    })

  }

  // /v1/mediumArea/comprehensiveEnergyConsumption   高新区近几年单位综合能耗的经济总产值
  // private otherUrlTwo = '/v1/mediumArea/comprehensiveEnergyConsumption';
  getOtherDataTwo() {


    this.ireaFocusService.requestByParams({ isWest: this.isWest, year: (new Date().getFullYear()) - 1 }, 'otherUrlTwo').subscribe(res => {
      console.log('高新区近几年单位综合能耗的经济总产值', res);
      if (res.responseCode === '_200') {


        let years = [],
          consumption = [],   //综合能耗
          industrial = [], conIn = [];    //经济总产值

        for (let i = 0; i < res.data.length; i++) {
          years.push(res.data[i].year);
          consumption.push(res.data[i].consumption);
          industrial.push(res.data[i].industrial);
          conIn.push((res.data[i].industrial / res.data[i].consumption * 100).toFixed(2));
        }


        this.optionTwo = {

          title: {
            text: "高新区近几年单位综合能耗的经济总产值",
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18,
              fontWeight: 'normal',
            },
            padding: 15
          },
          color: this.colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['综合能耗', '经济总产值', '单位产值'],
            top: 50,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            top: 90,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: years,
              axisTick: {
                alignWithLabel: true
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
              name: '综合能耗',
              // min: 0,
              // max: 250,
              position: 'left',
              splitLine: {
                show: true,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '经济总产值 ',
              // min: 0,
              // max: 250,
              position: 'right',
              splitLine: {
                show: false,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '单位产值（%） ',
              // min: 0,
              // max: 250,
              position: 'right',
              offset: 90,
              splitLine: {
                show: false,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '综合能耗',
              type: 'bar',
              // barWidth: '60%',
              data: consumption
            },
            {
              name: '经济总产值',
              type: 'bar',
              // barWidth: '60%',
              yAxisIndex: 1,
              data: industrial
            },
            {
              name: '单位产值',
              type: 'line',
              yAxisIndex: 2,
              // barWidth: '60%',
              data: conIn
            },
          ]
        }
      }
    });


  }


  //高新西区近几年环保排污走势情况
  // /v1/mediumArea/environmentalTrends  高新区近几年环保排污走势情况
  // private otherUrlThree = '/v1/mediumArea/environmentalTrends';
  getOtherDataThree() {


    this.ireaFocusService.requestByParams({ isWest: this.isWest, year: (new Date().getFullYear()) - 1 }, 'otherUrlThree').subscribe(res => {
      console.log('高新区近几年环保排污走势情况', JSON.stringify(res));
      if (res.responseCode === '_200') {

        let areaData = [];
        let type = ['COD', 'NH3', 'SO2', 'NOX'];
        let years = [];
        let COD = [],
          NH3 = [],
          SO2 = [],
          NOX = [];

        for (let i = 0; i < res.data.length; i++) {
          years.push(res.data[i].year);
          var item = res.data[i];
          areaData.push([item.year, item.COD, item.NH3, item.SO2, item.NOX]);
          COD.push(item.COD);
          NH3.push(item.NH3);
          SO2.push(item.SO2);
          NOX.push(item.NOX);
        }
        var dataAll = [];
        dataAll = dataAll.concat(COD, NH3, SO2, NOX);
        console.log('=================', dataAll);

        var schema = [
          { name: 'date', index: 0, text: '年' },
          { name: 'COD', index: 1, text: 'COD' },
          { name: 'NH3', index: 2, text: 'NH3' },
          { name: 'SO2', index: 3, text: 'SO2' },
          { name: 'NOX', index: 4, text: 'NOX' }
        ];


        var itemStyle = {
          normal: {
            opacity: 0.8,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        };

        this.optionThree = {
          // backgroundColor: '#404a59',
          title: {
            text: '高新西区近几年环保排污走势情况',
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18,
              fontWeight: 'normal',
            },
            padding: 15
          },
          color: this.colors,
          legend: {
            y: 'top',
            top: 50,
            data: type,//[this.area],
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '18%',
            bottom: '3%',
            top: 90,
            containLabel: true
          },
          tooltip: {
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            // formatter: function (obj) {
            //   var value = obj.value;
            //   return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
            //     + obj.seriesName + ' ' + value[0] + '年：'
            //     + '</div>'
            //     + schema[1].text + '：' + value[1] + '<br>'
            //     + schema[2].text + '：' + value[2] + '<br>'
            //     + schema[3].text + '：' + value[3] + '<br>'
            //     + schema[4].text + '：' + value[4] + '<br>';
            // }
          },
          xAxis: {
            type: 'category',
            name: '年份',
            // nameGap: 16,
            nameTextStyle: {
              color: ['#7a7b7c']
            },
            axisLine: {
              lineStyle: {
                color: '#7a7b7c',
                width: 1
              }
            },
            // max: years[0]
            data: years
          },
          yAxis: {
            type: 'value',
            name: '值（吨/年）',
            // nameLocation: 'end',
            nameGap: 20,
            splitLine: {
              show: true,
              lineStyle: this.echartInitConfig.splitLineStyle,
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
          /*visualMap: [
            {
              type: 'piecewise',
              left: 'right',
              top: 60,
              // dimension: 2,
              min: 0,
              max: Math.ceil(dataAll.sort(function (a, b) {
                return b - a;
              })[0]/500)*500,
              textStyle: {
                color: '#7a7b7c'
              },
              inRange: {
                symbolSize: [10, 70]
              },
              outOfRange: {
                symbolSize: [10, 70],
                color: ['rgba(255,255,255,.2)']
              },
              controller: {
                inRange: {
                  color: ['#c23531']
                },
                outOfRange: {
                  color: ['#444']
                }
              }
            }
          ],*/
          series: [
            {
              name: 'COD',
              type: 'scatter',
              itemStyle: itemStyle,
              symbolSize: (value, params) => Math.sqrt(value),
              markPoint: {
                symbolSize: 50
              },
              data: COD
            },
            {
              name: 'NH3',
              type: 'scatter',
              itemStyle: itemStyle,
              symbolSize: (value, params) => Math.sqrt(value),
              markPoint: {
                symbolSize: 70
              },
              data: NH3
            },
            {
              name: 'SO2',
              type: 'scatter',
              symbolSize: (value, params) => Math.sqrt(value),
              itemStyle: itemStyle, markPoint: {
                symbolSize: 90
              },
              data: SO2
            },
            {
              name: 'NOX',
              type: 'scatter',
              symbolSize: (value, params) => Math.sqrt(value),
              itemStyle: itemStyle, markPoint: {
                symbolSize: 110
              },
              data: NOX
            }
          ]
        };

      }
    });

  }




  // /v1/mediumArea/unitEnvironmentalTrends   高新区近几年单位环保排污的经济总产值
  // private otherUrlFour = '/v1/mediumArea/unitEnvironmentalTrends';

  getOtherDataFour() {


    this.ireaFocusService.requestByParams({ isWest: this.isWest, year: (new Date().getFullYear()) - 1 }, 'otherUrlFour').subscribe(res => {
      console.log('高新区近几年单位环保排污的经济总产值', res);
      if (res.responseCode === '_200') {


        let years = [],
          industrial = [],    //经济总产值
          totalAmount = [],   //排污总量
          unitIndustrial = [];  //单位产值
        for (let i = 0; i < res.data.length; i++) {
          years.push(res.data[i].year);
          totalAmount.push(res.data[i].totalAmount);
          industrial.push(res.data[i].industrial);
          unitIndustrial.push(res.data[i].unitIndustrial)
        }


        this.optionFour = {
          title: {
            text: "高新区近几年单位环保排污的经济总产值",
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18,
              fontWeight: 'normal',
            },
            padding: 15
          },
          color: this.colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['经济总产值', '排污总量', '单位产值'],
            top: 50,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            top: 90,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: years,
              axisTick: {
                alignWithLabel: true
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
              name: '经济总产值',
              // min: 0,
              // max: 250,
              position: 'left',
              splitLine: {
                show: true,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '排污总量',
              // min: 0,
              // max: 250,
              position: 'right',
              splitLine: {
                show: false,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '单位产值',
              // min: 0,
              // max: 250,
              position: 'right',
              offset: 60,
              splitLine: {
                show: false,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              nameTextStyle: {
                color: ['#7a7b7c']
              },
              axisLine: {
                lineStyle: {
                  color: '#7a7b7c',
                  width: 1
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '经济总产值',
              type: 'bar',
              // barWidth: '60%',
              data: industrial
            },
            {
              name: '排污总量',
              type: 'bar',
              // barWidth: '60%',
              yAxisIndex: 1,
              data: totalAmount
            },
            {
              name: '单位产值',
              type: 'line',
              yAxisIndex: 2,
              // barWidth: '60%',
              data: unitIndustrial
            },
          ]
        };

      }
    });
  }




}
