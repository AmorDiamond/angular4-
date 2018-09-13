import { Component, OnInit } from '@angular/core';
import { IndustryMapFenbuService } from '../industry-map-fenbu.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-register-money',
  templateUrl: './register-money.component.html',
  styleUrls: ['./register-money.component.css']
})
export class RegisterMoneyComponent implements OnInit {

  constructor(
    private industryMapFenbuService: IndustryMapFenbuService,
    private toastModalService: ToastModalService
  ) { }
  registerMoneyEchartData: any;
  ngOnInit() {
    this.getData();
  }
  /*获取数据*/
  getData() {
    this.industryMapFenbuService.getDataByParams({}, 'industryMapRegistMoneyUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        const options = res.data;
        this.creatRegisterMoneyEchart(options);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
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
        seriesData.push(res[1]);
      }
    });
    const option = {
      color: ['#21cbee', '#168aa1'],
      title: {
        text: '各功能区注册资本',
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
        right: '10%',
        bottom: '5%',
        containLabel: true
      },
      calculable: true,
      xAxis: [
        {
          name: '功能区',
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
          name: '注册资本(万)',
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
          name: '注册资本',
          type: 'bar',
          barMaxWidth: '50%',
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
    this.registerMoneyEchartData = option;
  }
}
