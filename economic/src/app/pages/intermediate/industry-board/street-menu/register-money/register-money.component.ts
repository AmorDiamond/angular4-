import { Component, OnInit } from '@angular/core';
import { StreetMenuService } from '../street-menu.service';

@Component({
  selector: 'app-register-money',
  templateUrl: './register-money.component.html',
  styleUrls: ['./register-money.component.css']
})
export class RegisterMoneyComponent implements OnInit {

  constructor(
    private streetMenuService: StreetMenuService
  ) { }
  streetName: any;
  registerMoneyData: any;
  ngOnInit() {
    this.getData();
  }
  /*获取数据*/
  getData(streetName?) {
    this.streetName = streetName ? streetName : '东街';
    const params = {dataSupplyTime: new Date().getFullYear(), streetOffice: streetName ? streetName : '东街'};
    this.streetMenuService.getDataByParams({}, 'streetMenuUrl').subscribe(res => {
      console.log('街道数据', res)
      if (res.responseCode === '_200') {
        this.creatRegisterMoneyEchart(res.data);
      }
    });
  }
  /*绘制注册资金图表*/
  creatRegisterMoneyEchart(options) {
    let xAxisData = [];
    let seriesData = [];
    options.forEach(res => {
      if (res[2]) {
        xAxisData.push(res[2]);
        seriesData.push(res[0] ? res[0] : 0);
      }
    });
    let echartTitle = '各街道企业注册资金';
    const option = {
      color: ['#21cbee', '#168aa1'],
      title: {
        text: echartTitle,
        textStyle: {
          color: '#bcbdbf'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },
      calculable: true,
      xAxis: [
        {
          name: '街道',
          nameTextStyle : {
            color : '#bcbdbf',
          },
          type: 'category',
          data: xAxisData,
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      yAxis: [
        {
          name: '注册资金(万)',
          nameTextStyle : {
            color : '#bcbdbf',
          },
          type: 'value',
          splitLine: {show: false},
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      series: [
        {
          name: '注册资金',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top',
            }
          },
          data: seriesData
        }
      ]
    };
    this.registerMoneyData = option;
  }
}
