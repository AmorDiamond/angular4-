import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TradeBoardService } from './trade-board.service';
import { ToastModalService } from '../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-new-trade-board',
  templateUrl: './new-trade-board.component.html',
  styleUrls: ['./new-trade-board.component.css']
})
export class NewTradeBoardComponent implements OnInit {

  constructor(
    private router: Router,
    private tradeBoardService: TradeBoardService,
    private toastModalService: ToastModalService,
  ) { }
  chooseYear = new Date().getFullYear() - 1;
  echartData: any;
  yearList = [];
  TypeInfoEchartData: any;
  industryTypeData: any;
  leadServiceNumber: any;
  advancedNumber: any;
  allTypesNumberData = [];
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
    const lastYear = new Date().getFullYear() - 1;
    const countYear = 3;
    const series = {data1: [], data2: []};
    for (let i = countYear - 1; i >= 0; i--) {
      this.yearList.push(lastYear - i);
    }
    this.getData();
  }

  yearChange() {
    /*筛选出所需数据*/
    const filterData = this.echartData.filter((item) => {
      return item[0] && Number(item[1]) === Number(this.chooseYear);
    });
    this.creatTypeInfoEchart(filterData);
  }
  /*获取首页概况数据*/
  getData() {
    this.tradeBoardService.requestByParams({}, 'tradeBoardViewUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.industryTypeData = res.data['']
        this.leadServiceNumber = res.data['主导服务业'];
        this.advancedNumber = res.data['先进制造业'];
        this.allTypesNumberData = res.data['企业概述'][0];
        const data = res.data['个门类经济数据'];
        this.echartData = data;
        /*筛选出所需数据*/
        const filterData = this.echartData.filter((item) => {
          return item[0] && Number(item[1]) === Number(this.chooseYear);
        });
        this.creatTypeInfoEchart(filterData);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*绘制各门类数据图表*/
  creatTypeInfoEchart(options) {
    const textColor = this.echartInitConfig.labelTextColor;
    const xAxisData = [];
    const legendData = ['营业收入', '利润', '税收', '政府支持'];
    const series = {data1: [], data2: [], data3: [], data4: []};
    options.forEach(item => {
      if (item[0]) {
        xAxisData.push(item[0]);
        series.data1.push(item[2] ? item[2] : 0);
        series.data2.push(item[3] ? item[3] : 0);
        series.data3.push(item[4] ? item[4] : 0);
        series.data4.push(item[5] ? -item[5] : 0);
      }
    });
    const option = {
      color: this.echartInitConfig.colors,
      title: {
        show: false,
        text: '近三年固定投资、营业收入和利润',
        left: 'center',
        textStyle: this.echartInitConfig.titleTextStyle,
      },
      grid: {
        top: 80,
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
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
        top: 25,
        left: 'center',
        textStyle: {
          color: textColor,
        },
        itemWidth: this.echartInitConfig.legendStyle.itemWidth,
        data: legendData
      },
      xAxis : [
        {
          type : 'category',
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          },
          splitLine: { show: false },
          data : xAxisData
        }
      ],
      yAxis : [
        {
          type : 'value',
          axisTick : {show: false},
          splitLine: {
            show: true,
            lineStyle: this.echartInitConfig.splitLineStyle,
          },
          inverse: true,
          axisLabel: {
            textStyle: {
              color: textColor,
            }
          },
        }
      ],
      dataZoom: {
        type: 'inside',
      },
      series : [
        {
          name: '营业收入',
          type: 'bar',
          label: {
            normal: {
              show: false,
              position: 'inside'
            }
          },
          data: series.data1
        },
        {
          name: '利润',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false
            }
          },
          data: series.data2
        },
        {
          name: '税收',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'left'
            }
          },
          data: series.data3
        },
        {
          name: '政府支持',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'left'
            }
          },
          data: series.data4
        }
      ]
    };
    this.TypeInfoEchartData = option;
  }

}
