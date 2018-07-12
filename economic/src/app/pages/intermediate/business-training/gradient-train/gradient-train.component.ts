import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContainerStyle } from '../../../../core/container-ngrx/container.model';
import { CHANGE } from '../../../../core/container-ngrx/container.action';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-gradient-train',
  templateUrl: './gradient-train.component.html',
  styleUrls: ['./gradient-train.component.css']
})
export class GradientTrainComponent implements OnInit {

  constructor(private store: Store<ContainerStyle>) { }
  gradientTrainEchart1: any;
  gradientTrainEchart2: any;
  gradientTrainEchart3: any;
  ngOnInit() {
    this.store.dispatch({
      type: 'CHANGE',
      payload: {width : '60%'}
    })
    setTimeout(() => {
      this.creatGradientTrainEchart1();
      this.creatGradientTrainEchart2();
      this.creatGradientTrainEchart3();
    }, 500);
  }
  creatGradientTrainEchart1() {
    const option = {
      title: {
        text: '所有产业统计',
        textStyle: {
          color: '#bcbdbf',
          fontSize: 16
        },
        right: 20,
        top: 20
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: function (params) {
          const num1 = 3;
          const num2 = 4;
          const num3 = 5;
          const tpl = `<div class="foster-tool-box">
								<table class="foster-table">
                  <tr><td class="foster-tool-item text-r">生产性服务业  :</td> <td> + ${num1} 家</td></tr>
                  <tr><td class="foster-tool-item text-r">节能环保  :</td><td> + ${num2} 家</td></tr>
                  <tr><td class="foster-tool-item text-r">信息技术  :</td><td> + ${num3} 家</td></tr>
								</table>
								</div>
								`;
          return tpl;
        }
      },
      xAxis: {
        data: ['大企业大集团', '提升型', '小巨人', '成长型', '拟规上' ],
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      },
      yAxis: {
        splitLine: {show: false},
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false}
      },
      color: ['#f00'],
      series: [{
        name: 'hill',
        type: 'pictorialBar',
        barCategoryGap: '-130%',
        // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        itemStyle: {
          normal: {
            opacity: 0.5
          },
          emphasis: {
            opacity: 1
          }
        },
        data: [871, 650, 482, 398, 350],
        z: 10
      }]
    };
    this.gradientTrainEchart1 = option;
  }
  creatGradientTrainEchart2() {
    const option2 = {
      title: {
        text: '4+1主导产业',
        textStyle: {
          color: '#bcbdbf',
          fontSize: 16
        },
        right: 20,
        top: 20
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: function (params) {
          const num1 = 3;
          const num2 = 4;
          const num3 = 5;
          const tpl = `<div class="foster-tool-box">
								<table class="foster-table">
								<tr><td class="foster-tool-item text-r">信息技术  :</td> <td> + ${num1} 家</td></tr>
								<tr><td class="foster-tool-item text-r">生物  :</td><td> + ${num2} 家</td></tr>
								<tr><td class="foster-tool-item text-r">高端装备  :</td><td> + ${num3} 家</td></tr>
								<tr><td class="foster-tool-item text-r">节能环保产业  :</td><td> + ${num3+num2} 家</td></tr>
								<tr><td class="foster-tool-item text-r">生产性服务业 :</td><td> + ${num3+num1} 家</td></tr></table>
								</div>
								`;
          return tpl;
        }
      },
      xAxis: {
        data: ['大企业大集团', '提升型', '小巨人', '成长型', '拟规上' ],
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      },
      yAxis: {
        splitLine: {show: false},
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false}
      },
      color: ['#3fd7f1'],
      series: [{
        name: 'hill',
        type: 'pictorialBar',
        barCategoryGap: '-130%',
        // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        itemStyle: {
          normal: {
            opacity: 0.5
          },
          emphasis: {
            opacity: 1
          }
        },
        data: [871, 650, 482, 398, 350],
        z: 10
      }]
    };
    this.gradientTrainEchart2 = option2;
  }
  creatGradientTrainEchart3() {
    const option3 = {
      title: {
        text: '7+2重点产业',
        textStyle: {
          color: '#bcbdbf',
          fontSize: 16
        },
        right: 20,
        top: 20
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: function (params) {
          const num1 = 3;
          const num2 = 4;
          const num3 = 5;
          const tpl = `<div class="foster-tool-box">
								<table class="foster-table">
								<tr><td class="foster-tool-item text-r">信息网络  :</td> <td> + ${num1} 家</td></tr>
								<tr><td class="foster-tool-item text-r">电子核心基础  :</td><td> + ${num2} 家</td></tr>
								<tr><td class="foster-tool-item text-r">高端软件和新兴信息服务  :</td><td> + ${num3} 家</td></tr>
								<tr><td class="foster-tool-item text-r">生物医药  :</td> <td> + ${num1} 家</td></tr>
								<tr><td class="foster-tool-item text-r">生物医学工程  :</td><td> + ${num2} 家</td></tr>
								<tr><td class="foster-tool-item text-r">航空装备  :</td><td> + ${num3} 家</td></tr>
								<tr><td class="foster-tool-item text-r">先进环保产业  :</td> <td> + ${num1} 家</td></tr>
								<tr><td class="foster-tool-item text-r">金融业  :</td><td> + ${num2} 家</td></tr>
								<tr><td class="foster-tool-item text-r">商务服务业  :</td><td> + ${num3} 家</td></tr></table>

								</div>
								`;
          return tpl;
        }
      },
      xAxis: {
        data: ['大企业大集团', '提升型', '小巨人', '成长型', '拟规上' ],
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {
          textStyle: {
            color: '#bcbdbf'
          }
        }
      },
      yAxis: {
        splitLine: {show: false},
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false}
      },
      color: ['#40f900'],
      series: [{
        name: 'hill',
        type: 'pictorialBar',
        barCategoryGap: '-130%',
        // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        itemStyle: {
          normal: {
            opacity: 0.5
          },
          emphasis: {
            opacity: 1
          }
        },
        data: [871, 650, 482, 398, 350],
        z: 10
      }]
    };
    this.gradientTrainEchart3 = option3;
  }

}
