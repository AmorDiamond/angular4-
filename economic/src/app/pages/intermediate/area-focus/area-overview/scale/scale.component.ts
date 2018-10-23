import { Component, OnInit } from '@angular/core';
import { AreaFocusService } from '../../area-focus.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.css']
})
export class ScaleComponent implements OnInit {


  optionOne: any;
  optionTwo: any;
  optionThree: any;
  optionFour: any;
  optionFive: any;
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
    // this.colors = ['#5079d9', '#ffcc00', '#57ba8c', '#7958d6'];

    this.getDataOne();
    this.getDataTwo((new Date().getFullYear()) - 1);
    this.getDataFour();
    this.getDataFive();
  }

  // /v1/mediumArea/threeYearsCompanyAndStaff 近三年企业数量和职工人数
  getDataOne() {

    console.log(this.isWest);
    this.ireaFocusService.requestByParams({ isWest: this.isWest }, 'detaileUrlOne').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {

        let year = [];
        let companyCount = [];
        let personCount = [];
        let area = [];
        for (let i = 0; i < res.data.length; i++) {
          year.push(res.data[i].year);
          companyCount.push(res.data[i].companyCount);
          personCount.push(res.data[i].personCount);
          area.push(res.data[i].area);
        }

        // var colors = ['#5079d9', '#ffcc00','#57ba8c','#7958d6'];

        this.optionOne = {
          title: {
            text: "近三年企业数量和职工人数",
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color: this.colors,
          textStyle:{
            color:'#7a7b7c'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          grid: {
            right: '20%',
            top: '90'
          },
          // toolbox: {
          //   feature: {
          //     dataView: { show: true, readOnly: false },
          //     restore: { show: true },
          //     saveAsImage: { show: true }
          //   }
          // },
          legend: {
            data: ['企业数量', '职工人数'],
            top: 50,
            textStyle:{
              color:'#7a7b7c'
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              data: year,
              nameTextStyle:{
                color:['#7a7b7c']
              },
              axisLine:{
                lineStyle:{
                  color:'#7a7b7c',
                  width:1
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '企业数量 (家)',
              // min: 0,
              // max: 250,
              position: 'left',
              splitLine: {
                show: true,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              axisLine: {
                lineStyle: {
                  color: this.colors[0]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '职工人数 (人)',
              // min: 0,
              // max: 250,
              position: 'right',
              // offset: 80,
              splitLine: {
                show: false,
                lineStyle: this.echartInitConfig.splitLineStyle,
              },
              axisLine: {
                lineStyle: {
                  color: this.colors[1]
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
              data: companyCount
            },
            {
              name: '职工人数',
              type: 'bar',
              yAxisIndex: 1,
              data: personCount
            }
          ]
        };

      }
    });
  }


  // /v1/mediumArea/areaStaffLevel    职工学历层次分布及职工岗位类型
  getDataTwo(year) {
    console.log(year);
    this.ireaFocusService.requestByParams({ isWest: this.isWest, year: year }, 'detaileUrlTwo').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {


        // var colors = ['#5079d9', '#ffcc00','#57ba8c','#7958d6'];
        this.optionTwo = {
          title: {
            text: year+'职工学历层次分布及职工岗位类型',
            // subtext: '纯属虚构',
            x: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color:this.colors,
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            // orient: 'vertical',
            left: 'center',
            top: 50,
            data: ['研究生', '本科以上', '大专'],
            textStyle:{
              color:'#7a7b7c'
            }
          },
          series: [
            {
              name: '学历层次',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: res.data.postgraduate, name: '研究生' },
                { value: res.data.bachelorDegree, name: '本科以上' },
                { value: res.data.college, name: '大专' }
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


        this.optionThree = {
          title: {
            text: year+'职工岗位类型占比',
            x: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color:this.colors,
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            // orient: 'vertical',
            left: 'center',
            top: 50,
            data: ['中层及以上管理人员', '专业技术工人', '技术工人'],
            textStyle:{
              color:'#7a7b7c'
            }
          },
          series: [
            {
              name: '岗位类型',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: res.data.manager, name: '中层及以上管理人员' },
                { value: res.data.major, name: '专业技术工人' },
                { value: res.data.ordinary, name: '技术工人' }
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


  ///v1/mediumArea/threeYearsPatent   近三年专利申请、授权、拥有情况
  getDataFour() {
    this.ireaFocusService.requestByParams({ isWest: this.isWest }, 'detaileUrlFour').subscribe(res => {
      console.log('近三年专利申请、授权、拥有情况', res);
      if (res.responseCode === '_200') {

        let granted = [];   //专利授权
        let havePatent = [];    //专利拥有
        let patent = [];    //专利申请
        let year = [];

        for (let i = 0; i < res.data.length; i++) {
          granted.push(res.data[i].granted);
          havePatent.push(res.data[i].havePatent);
          patent.push(res.data[i].patent);
          year.push(res.data[i].year);
        }


        this.optionFour = {
          title: {
            text: '近三年专利申请、授权、拥有情况',
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color:this.colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['专利申请', '专利授权', '专利拥有'],
            top: 50,
            textStyle:{
              color:'#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 80,
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            splitLine: {
              show: true,
              lineStyle: this.echartInitConfig.splitLineStyle,
            },
            nameTextStyle:{
              color:['#7a7b7c']
            },
            axisLine:{
              lineStyle:{
                color:'#7a7b7c',
                width:1
              }
            }
          },
          yAxis: {
            type: 'category',
            data: year,
            splitLine: {
              show: false,
              lineStyle: this.echartInitConfig.splitLineStyle,
            },
            nameTextStyle:{
              color:['#7a7b7c']
            },
            axisLine:{
              lineStyle:{
                color:'#7a7b7c',
                width:1
              }
            }
          },
          series: [
            {
              name: '专利拥有',
              type: 'bar',
              data: havePatent
            },
            {
              name: '专利授权',
              type: 'bar',
              data: granted
            },
            {
              name: '专利申请',
              type: 'bar',
              data: patent
            }
          ]
        };


      }
    });
  }

  // /v1/mediumArea/threeYearsPropertyRight   近三年其他知识产权拥有情况
  // private detaileUrlFive = '/v1/mediumArea/threeYearsPropertyRight';
  getDataFive() {
    this.ireaFocusService.requestByParams({ isWest: this.isWest }, 'detaileUrlFive').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {


        let industry = [];        //国家或行业标准
        let international = [];   //国际标准项
        let published = [];       //科技论文
        let software = [];        //软件著作权
        let technology = [];      //国家科技奖励
        let trademark = [];       //商标
        let year = [];

        for (let i = 0; i < res.data.length; i++) {
          industry.push(res.data[i].industry);
          international.push(res.data[i].international);
          published.push(res.data[i].published);
          software.push(res.data[i].software);
          technology.push(res.data[i].technology);
          trademark.push(res.data[i].trademark);
          year.push(res.data[i].year);
        }


        this.optionFive = {
          title: {
            text: "近三年其他知识产权拥有情况",
            left: 'center',
            textStyle: {
              color: '#7c7e80',
              fontSize: 18
            },
            padding: 15
          },
          color:this.colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['商标', '国家或行业标准', '国际标准项', '科技论文', '软件著作权', '国家科技奖励'],
            top: 50,
            textStyle:{
              color:'#7a7b7c'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 80,
            containLabel: true
          },
          xAxis: {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: this.echartInitConfig.splitLineStyle,
            },
            nameTextStyle:{
              color:['#7a7b7c']
            },
            axisLine:{
              lineStyle:{
                color:'#7a7b7c',
                width:1
              }
            }
          },
          yAxis: {
            type: 'category',
            data: year,
            splitLine: {
              show: false,
              lineStyle: this.echartInitConfig.splitLineStyle,
            },
            nameTextStyle:{
              color:['#7a7b7c']
            },
            axisLine:{
              lineStyle:{
                color:'#7a7b7c',
                width:1
              }
            }
          },
          series: [
            {
              name: '商标',
              type: 'bar',
              stack: '总量',
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'insideRight'
              //   }
              // },
              data: trademark
            },
            {
              name: '国家或行业标准',
              type: 'bar',
              stack: '总量',
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'insideRight'
              //   }
              // },
              data: industry
            },
            {
              name: '国际标准项',
              type: 'bar',
              stack: '总量',
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'insideRight'
              //   }
              // },
              data: international
            },
            {
              name: '科技论文',
              type: 'bar',
              stack: '总量',
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'insideRight'
              //   }
              // },
              data: published
            },
            {
              name: '软件著作权',
              type: 'bar',
              stack: '总量',
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'insideRight'
              //   }
              // },
              data: software
            },
            {
              name: '国家科技奖励',
              type: 'bar',
              stack: '总量',
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'insideRight'
              //   }
              // },
              data: technology
            }
          ]
        };



      }
    });
  }

}
