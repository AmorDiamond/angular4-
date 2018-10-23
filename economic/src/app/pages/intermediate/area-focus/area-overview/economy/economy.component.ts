import { Component, OnInit } from '@angular/core';
import { AreaFocusService } from '../../area-focus.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-economy',
  templateUrl: './economy.component.html',
  styleUrls: ['./economy.component.css']
})
export class EconomyComponent implements OnInit {


  optionOne: any;
  optionTwo: any;
  optionThree: any;
  optionFour: any;
  optionFive: any;
  optionSix: any;
  optionSeven: any;
  colors = ['#5079d9', '#ffcc00', '#57ba8c', '#5d9ed0', '#bc79c2', '#35508e', '#90caaf', '#bcbdbf', '#7c7e80', '#7958d6', '#78d05d', '#c3c062', '#327355', '#87a3e4', '#9385b9'];

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


    this.getEcoDataSeven((new Date().getFullYear()) - 1);

    this.getEcoData();
    this.getEcoDataTwo();
    this.getEcoDataThree((new Date().getFullYear()) - 1);
    this.getEcoDataFour();
    this.getEcoDataFive();
    this.getEcoDataSix();

  }

  // /v1/mediumArea/inputSituation  近几年政府支持情况、固定投资、研发经费
  // private ecoDetailUrl = '/v1/mediumArea/inputSituation';
  ecoDataOne: any;
  getEcoData() {
    this.ireaFocusService.requestByParams({ isWest: this.isWest }, 'ecoDetailUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {

        this.ecoDataOne = res.data;
        let year = [];
        let cinvestment = [];   //投资
        let science = [];   //研发
        let support = [];   //支持
        for (let i = 0; i < res.data.length; i++) {
          year.push(res.data[i].year);
          cinvestment.push(res.data[i].cinvestment);
          science.push(res.data[i].science);
          support.push(res.data[i].support);
        }

        let labelOption = {
          normal: {
            show: true,
            position: 'insideBottom',
            distance: 10,
            align: 'left',
            verticalAlign: 'middle',
            rotate: 90,
            formatter: '{name|{a}} {c}',
            fontSize: 16,
            rich: {
              name: {
                textBorderColor: '#fff'
              }
            }
          }
        };


        this.optionOne = {
          title: {
            text: "近几年政府支持情况、固定投资、研发经费",
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color: this.colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['政府支持', '固定投资', '研发经费'],
            top: 50,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 90,
            containLabel: true
          },
          // toolbox: {
          //   show: true,
          //   orient: 'vertical',
          //   left: 'right',
          //   top: 'center',
          //   feature: {
          //     mark: { show: true },
          //     dataView: { show: true, readOnly: false },
          //     magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
          //     restore: { show: true },
          //     saveAsImage: { show: true }
          //   }
          // },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: year,
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
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
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
          series: [
            {
              name: '政府支持',
              type: 'bar',
              barGap: 0,
              // label: labelOption,
              data: support
            },
            {
              name: '固定投资',
              type: 'bar',
              // label: labelOption,
              data: cinvestment
            },
            {
              name: '研发经费',
              type: 'bar',
              // label: labelOption,
              data: science
            }
          ]
        };

      }
    });
  }

  //近几年工业总产值、资产总计、营业收入、利润、税收、利润率（利润/营收）
  // /v1/mediumArea/informationOutput  近几年工业总差值、资产总计、营业收入、利润、税收、利润率不同营业收入类型的占比
  // private ecoDetailUrlTwo = '/v1/mediumArea/informationOutput';
  ecoDataTwo: any;
  getEcoDataTwo() {
    this.ireaFocusService.requestByParams({ isWest: this.isWest }, 'ecoDetailUrlTwo').subscribe(res => {
      console.log('=========', res);
      if (res.responseCode === '_200') {

        this.ecoDataTwo = res.data;

        let year = [];
        let businessIncome = [];   //营业收入
        let industrial = [];   //工业
        let operatingProfit = [];   //经营利润
        let profitMargin = [];   //利润率
        let totalAssets = [];   //总资产
        let totalataxesOutput = [];   //总输出量

        for (let i = 0; i < res.data.length; i++) {
          year.push(res.data[i].year);
          businessIncome.push(res.data[i].businessIncome);
          industrial.push(res.data[i].industrial);
          operatingProfit.push(res.data[i].operatingProfit);
          profitMargin.push(res.data[i].profitMargin);
          totalAssets.push(res.data[i].totalAssets);
          totalataxesOutput.push(res.data[i].totalataxesOutput);
        }


        this.optionTwo = {
          title: {
            text: "工业总产值",
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
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
            data: ['工业总产值', '资产总计', '营业收入', '利润', '税收', '利润率'],
            top: 50,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 110,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: year,
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
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
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
          series: [
            {
              name: '工业总产值',
              type: 'bar',
              data: industrial
            },
            {
              name: '资产总计',
              type: 'bar',
              stack: '资产总计',
              data: totalAssets
            },
            {
              name: '营业收入',
              type: 'bar',
              stack: '营业收入',
              data: businessIncome
            },
            {
              name: '利润',
              type: 'bar',
              stack: '营业收入',
              data: operatingProfit
            },
            {
              name: '税收',
              type: 'bar',
              stack: '营业收入',
              data: totalataxesOutput,
              // markLine : {
              //     lineStyle: {
              //         normal: {
              //             type: 'dashed'
              //         }
              //     },
              //     data : [
              //         [{type : 'min'}, {type : 'max'}]
              //     ]
              // }
            },
            {
              name: '利润率',
              type: 'bar',
              barWidth: 5,
              stack: '利润率',
              data: profitMargin
            }
          ]
        };

      }
    });
  }

  // /v1/mediumArea/informationOutputDetails   不同营业收入类型的占比    主营收入、技术收入、产品销售收入、商品销售收入、其他营业收入
  // private ecoDetailUrlSeven = '/v1/mediumArea/informationOutputDetails';
  getEcoDataSeven(year) {
    console.log('xxxxxxxxxxxxxxxx');
    this.ireaFocusService.requestByParams({ isWest: this.isWest, year: year }, 'ecoDetailUrlSeven').subscribe(res => {
      console.log('主营收入、技术收入、产品销售收入、商品销售收入、其他营业收入', res);
      if (res.responseCode === '_200') {

        // let businessincome = [];    //主营收入
        // let csalesrevenue = [];   //商品销售收入
        // let opIncome = [];    //其他营业收入
        // let psalesrevenue = [];   //产品销售收入
        // let technicalIncome = [];   //技术收入
        // let year = [];    //


        this.optionSeven = {
          title: {
            text: year+'不同营业收入类型的占比',
            // subtext: '纯属虚构',
            x: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color: this.colors,
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            top: 'middle',
            data: ['主营收入', '商品销售收入', '其他营业收入', '产品销售收入', '技术收入'],
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '10%',
            bottom: 0,
            // top:50,
            containLabel: true
          },
          series: [
            {
              // name: '学历层次',
              type: 'pie',
              radius: '40%',
              center: ['40%', '60%'],
              data: [
                { value: res.data[0].businessincome, name: '主营收入' },
                { value: res.data[0].csalesrevenue, name: '商品销售收入' },
                { value: res.data[0].opIncome, name: '其他营业收入' },
                { value: res.data[0].psalesrevenue, name: '产品销售收入' },
                { value: res.data[0].technicalIncome, name: '技术收入' }
              ],
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


      }
    });
  }

  updateEchart(year) {
    console.log('dcmefovmefovmm,sd;csd=====',year);
    this.getEcoDataThree(year);
    this.getEcoDataSeven(year);
  }


  // /v1/mediumArea/differentoOperatingIncomeLevels   不同营业收入阶梯分布
  // private ecoDetailUrlThree = '/v1/mediumArea/differentoOperatingIncomeLevels';
  getEcoDataThree(year) {
    this.ireaFocusService.requestByParams({ isWest: this.isWest, year: year }, 'ecoDetailUrlThree').subscribe(res => {
      console.log('threethreethreethreethree', res);
      if (res.responseCode === '_200') {

        let keys = [];

        for (let key in res.data[0]) {
          console.log(key, ':', res.data[0][key]);
          if (key != 'area' && key != 'year') {
            keys.push(key);
          }
        }

        this.optionThree = {
          title: {
            text: year+'不同营业收入阶梯分布',
            // subtext: '纯属虚构',
            x: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color: this.colors,
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            top: '60',
            data: keys,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '10%',
            bottom: 0,
            // top:50,
            containLabel: true
          },
          series: [
            {
              // name: '学历层次',
              type: 'pie',
              radius: '40%',
              center: ['40%', '60%'],
              data: [
                { value: res.data[0]['小于100'], name: '小于100' },
                { value: res.data[0]['100~200'], name: '100~200' },
                { value: res.data[0]['200~500'], name: '200~500' },
                { value: res.data[0]['500~1000'], name: '500~1000' },
                { value: res.data[0]['1000~2000'], name: '1000~2000' },
                { value: res.data[0]['2000~5000'], name: '2000~5000' },
                { value: res.data[0]['大于5000'], name: '大于5000' }
              ],
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
      }
    });
  }

  // /v1/mediumArea/governmentSubsidiesAndTaxes   近几年政府支持与税收的占比
  // private ecoDetailUrlFour = '/v1/mediumArea/governmentSubsidiesAndTaxes';
  getEcoDataFour() {
    this.ireaFocusService.requestByParams({ isWest: this.isWest }, 'ecoDetailUrlFour').subscribe(res => {
      console.log('近几年政府支持与税收的占比', res);
      if (res.responseCode === '_200') {


        let year = [];
        let support = [];
        let totalataxesOutput = [];
        let proportion = [];

        for (let i = 0; i < res.data.length; i++) {
          year.push(res.data[i].year);
          support.push(res.data[i].support);
          totalataxesOutput.push(res.data[i].totalataxesOutput);
          proportion.push((res.data[i].support / res.data[i].totalataxesOutput * 100).toFixed(2));
        }


        this.optionFour = {
          title: {
            text: "近几年政府支持与税收的占比",
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color: this.colors,
          // color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['政府支持', '税收', '占比'],
            top: 50,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 90,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: year,
              axisTick: {
                alignWithLabel: true
              },
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
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '政府支持',
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
              name: '税收 ',
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
              name: '占比（%） ',
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
              name: '政府支持',
              type: 'bar',
              // barWidth: '60%',
              data: support
            },
            {
              name: '税收',
              type: 'bar',
              // barWidth: '60%',
              yAxisIndex: 1,
              data: totalataxesOutput
            },
            {
              name: '占比',
              type: 'line',
              yAxisIndex: 2,
              // barWidth: '60%',
              data: proportion
            },
          ]
        };
      }
    });
  }

  // /v1/mediumArea/fixedInvestmentAndIncomeProfit   近几年固定投资与营业收入和利润的比较
  // private ecoDetailUrlFive = '/v1/mediumArea/fixedInvestmentAndIncomeProfit';

  getEcoDataFive() {
    console.log('fivefivefivefivefivefivefivefivefive')
    this.ireaFocusService.requestByParams({ isWest: this.isWest }, 'ecoDetailUrlFive').subscribe(res => {
      console.log('近几年固定投资与营业收入和利润的比较', res);
      if (res.responseCode === '_200') {


        let year = [];
        let businessIncome = [];    //营业收入
        let cinvestment = [];       //固定投资
        let operatingProfit = [];   //利润
        for (let i = 0; i < res.data.length; i++) {
          year.push(res.data[i].year);
          businessIncome.push(res.data[i].businessIncome);
          cinvestment.push(-res.data[i].cinvestment);
          operatingProfit.push(res.data[i].operatingProfit);
        }


        this.optionFive = {
          title: {
            text: '近几年固定投资与营业收入和利润的比较',
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
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
            data: ['营业收入', '固定投资', '利润'],
            top: 50,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 90,
            containLabel: true
          },
          xAxis: [
            {
              type: 'value',
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
              type: 'category',
              axisTick: { show: false },
              data: year,
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
              }
            }
          ],
          series: [
            {
              name: '营业收入',
              type: 'bar',
              stack: '营业收入',
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
              data: businessIncome
            },
            {
              name: '固定投资',
              type: 'bar',
              stack: '固定投资',
              label: {
                normal: {
                  show: true,
                  position: 'left'
                },
                // formatter:'{-c},,,mm'
              },
              data: cinvestment
            },
            {
              name: '利润',
              type: 'bar',
              stack: '利润',
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              },
              data: operatingProfit
            }
          ]
        };

      }
    });
  }

  // /v1/mediumArea/perCapitaBusinessByAllYear    近几年人均主营收入、人均税收、人均利润情况
  // private ecoDetailUrlSix = '/v1/mediumArea/perCapitaBusinessByAllYear';
  getEcoDataSix() {
    this.ireaFocusService.requestByParams({ isWest: this.isWest }, 'ecoDetailUrlSix').subscribe(res => {
      console.log('近几年人均主营收入、人均税收、人均利润情况', res);
      if (res.responseCode === '_200') {

        let perCapitaIncome = [];   //人均主营收入
        let perCapitaProfit = [];   //人均利润
        let perCapitaTax = [];      //人均税收
        let year = [];

        for (let i = 0; i < res.data.length; i++) {
          perCapitaIncome.push(res.data[i].perCapitaIncome);
          perCapitaProfit.push(res.data[i].perCapitaProfit);
          perCapitaTax.push(res.data[i].perCapitaTax);
          year.push(res.data[i].year);
        }

        this.optionSix = {
          title: {
            text: '近几年人均主营收入、人均税收、人均利润情况',
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color: this.colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['人均主营收入', '人均税收', '人均利润'],
            top: 50,
            textStyle: {
              color: '#7a7b7c'
            }
          },
          // toolbox: {
          //   feature: {
          //     saveAsImage: {}
          //   }
          // },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 90,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: year,
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
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
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
          series: [
            {
              name: '人均主营收入',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: perCapitaIncome
            },
            {
              name: '人均税收',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: perCapitaTax
            },
            {
              name: '人均利润',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: perCapitaProfit
            }
          ]
        }

      }
    });
  }

}
