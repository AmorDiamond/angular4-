import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IntermediateService } from '../../../intermediate.service';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';

@Component({
  selector: 'app-enterprise-jiegou',
  templateUrl: './enterprise-jiegou.component.html',
  styleUrls: ['./enterprise-jiegou.component.css']
})
export class EnterpriseJiegouComponent implements OnInit {
  jiegouData: any;
  jiegouData1: any;
  jiegouData2: any;
  jiegouData3: any;
  jiegouData4: any;
  constructor(private store: Store<ContainerStyle>, private intermediateService: IntermediateService) {
    this.store.select('container');
  }

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('IndustryMenu');
    const labelOption2 = {
      normal: {
        show: false,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{a}',
        fontSize: 16
      }
    };
    const option2 = {
      title:{
        text:'企业规模分布',
        textStyle:{
          color:'#bcbdbf'
        },
        left:'center'
      },
      color:['#21cbee','#168aa1','#0d4954'],
      legend: {
        data: ['大型企业', '中型企业', '小型企业'],
        textStyle:{
          color: "#bcbdbf"
        },
        top: 30
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      calculable: true,
      xAxis: [
        {
          name:'类型',
          nameTextStyle : {
            color : '#bcbdbf',
          },
          type: 'category',
          data: ['集成电路', '软件及服务外包', '光电', '生物医药','通信','精密机械'],
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      yAxis: [
        {
          name:'企业数量(家)',
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
          name: '大型企业',
          type: 'bar',
          barGap: 0,
          label: labelOption2,
          data: [120, 132, 201, 134,80,98]
        },
        {
          name: '中型企业',
          type: 'bar',
          label: labelOption2,
          data: [120, 182, 191, 334,230,250]
        },
        {
          name: '小型企业',
          type: 'bar',
          label: labelOption2,
          data: [150, 232, 201, 154,140,260]
        }
      ]
    };
    this.jiegouData = option2;

    const labelOption3 = {
      normal: {
        show: false,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{a}',
        fontSize: 16
      }
    };
    const itemStyle = {
      normal: {
//					barBorderRadius: 5,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: '0.8',
      }
    };
    const option3 = {
      color:['#6f75b3','#414469','#21cbee','#168aa1','#0d4954'],
      title:{
        text:'企业星级分布',
        textStyle:{
          color:'#bcbdbf'
        },
        left:'center'
      },
      legend: {
        data: ['五星企业', '四星企业', '三星企业', '二星企业', '一星企业'],
        textStyle:{
          color: "#bcbdbf"
        },
        top: 30
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      calculable: true,
      xAxis: [
        {
          name:'类型',
          nameTextStyle : {
            color : '#bcbdbf',
          },
          type: 'category',
          data: ['集成电路', '软件及服务外包', '光电', '生物医药','通信','精密机械'],
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      yAxis: {
        name:'企业数量(家)',
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
      },
      series: [
        {
          name: '五星企业',
          type: 'bar',
          barGap: 0,
          label: labelOption3,
          itemStyle:itemStyle,
          data: [120, 132, 201, 134,80,98]
        },
        {
          name: '四星企业',
          type: 'bar',
          label: labelOption3,
          itemStyle:itemStyle,
          data: [120, 182, 191, 334,230,250]
        },
        {
          name: '三星企业',
          type: 'bar',
          label: labelOption3,
          itemStyle:itemStyle,
          data: [150, 232, 201, 154,140,260]
        },
        {
          name: '二星企业',
          type: 'bar',
          label: labelOption3,
          itemStyle:itemStyle,
          data: [120, 182, 191, 334,230,250]
        },
        {
          name: '一星企业',
          type: 'bar',
          label: labelOption3,
          itemStyle:itemStyle,
          data: [150, 232, 201, 154,140,260]
        }
      ]
    };
    this.jiegouData1 = option3;

    const labelOption4 = {
      normal: {
        show: false,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{a}',
        fontSize: 16
      }
    };
    const option4 = {
      title:{
        text:'企业规模分布',
        textStyle:{
          color:'#bcbdbf'
        },
        left:'center'
      },
      legend: {
        data: ['大型企业', '中型企业', '小型企业'],
        textStyle:{
          color: "#bcbdbf"
        },
        top: 30
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      calculable: true,
      xAxis: [
        {
          name:'园区',
          nameTextStyle : {
            color : '#bcbdbf',
          },
          type: 'category',
          data: ['天府生命科技园', '天府新谷', '成都高新孵化园', '天府软件园'],
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      yAxis: [
        {
          name:'企业数量(家)',
          nameTextStyle : {
            color : '#bcbdbf',
          },
          type: 'value',
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      series: [
        {
          name: '大型企业',
          type: 'bar',
          barGap: 0,
          label: labelOption4,
          data: [120, 132, 201, 134]
        },
        {
          name: '中型企业',
          type: 'bar',
          label: labelOption4,
          data: [120, 182, 191, 334]
        },
        {
          name: '小型企业',
          type: 'bar',
          label: labelOption4,
          data: [150, 232, 201, 154]
        }
      ]
    };
    this.jiegouData2 = option4;

    const labelOption5 = {
      normal: {
//                    show: true,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{a}',
        fontSize: 16
      }
    };
    const option5 = {
      title:{
        text:'企业星级分布',
        textStyle:{
          color:'#556B2F'
        }
      },
      legend: {
        data: ['五星企业', '四星企业', '三星企业', '二星企业', '一星企业'],
        textStyle:{
          color: "#bcbdbf"
        },
        top: 10
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      calculable: true,
      xAxis: [
        {
          name:'园区',
          nameTextStyle : {
            color : '#bcbdbf',
          },
          type: 'category',
          data: ['天府生命科技园', '天府新谷', '成都高新孵化园', '天府软件园'],
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      yAxis: [
        {
          name:'企业数量(家)',
          nameTextStyle : {
            color : '#bcbdbf',
          },
          type: 'value',
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      series: [
        {
          name: '五星企业',
          type: 'bar',
          barGap: 0,
          label: labelOption5,
          data: [120, 132, 201, 134]
        },
        {
          name: '四星企业',
          type: 'bar',
          label: labelOption5,
          data: [120, 182, 191, 334]
        },
        {
          name: '三星企业',
          type: 'bar',
          label: labelOption5,
          data: [150, 232, 201, 154]
        },
        {
          name: '二星企业',
          type: 'bar',
          label: labelOption5,
          data: [120, 182, 191, 334]
        },
        {
          name: '一星企业',
          type: 'bar',
          label: labelOption5,
          data: [150, 232, 201, 154]
        }
      ]
    };
    this.jiegouData3 = option5;

    const labelOption6 = {
      normal: {
//                    show: true,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{a}',
        fontSize: 16
      }
    };
    const option6 = {
      color:['#21cbee','#168aa1'],
      title:{
        text:'企业流失数量和流失率',
        textStyle:{
          color:'#bcbdbf'
        },
        left:'center'
      },
      legend: {
        data: ['流失数量', '流失率'],
        textStyle:{
          color: "#bcbdbf"
        },
        top: 30
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      calculable: true,
      xAxis: [
        {
          name:'类型',
          nameTextStyle : {
            color : '#bcbdbf',
          },
          type: 'category',
          data: ['集成电路', '软件及服务外包', '光电', '生物医药','通信','精密机械'],
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      yAxis: [
        {
          name: '流失数量(家)',
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
        },
        {
          name: '流失率(%)',
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
        },
      ],
      series: [
        {
          name: '流失数量',
          type: 'bar',
          barGap: 0,
          label: labelOption6,
          itemStyle:{
            normal: {
//								barBorderRadius: 5,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: '0.8',
            }
          },
          data: [120, 132, 201, 134, 80, 98]
        },
        {
          name: '流失率',
          type: 'line',
          yAxisIndex: 1,
          label: labelOption6,
          itemStyle:{
            normal: {
//								barBorderRadius: 5,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: '0.8',
            }
          },
          data: [10, 18, 20, 10, 8, 10]
        }
      ]
    };

    this.jiegouData4 = option6;
  }

}
