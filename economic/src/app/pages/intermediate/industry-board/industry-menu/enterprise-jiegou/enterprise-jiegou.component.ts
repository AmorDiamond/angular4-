import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IntermediateService } from '../../../intermediate.service';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { IndustryMenuService } from '../industry-menu.service';

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
  constructor(private store: Store<ContainerStyle>, private intermediateService: IntermediateService, private industryMenuService: IndustryMenuService) {
    this.store.pipe(select('container'));
  }

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('IndustryMenu');
    this.getData();

  }
  /*获取数据*/
  getData() {
    this.industryMenuService.getDataByParams({}, 'enterpriseJiegouUrl').subscribe(res => {
      console.log('企业结构', res);
      if (res.responseCode === '_200') {
        if (res.data.length > 0) {
            const options = res.data;
          this.creatEnterpriseScaleEchart(options);
        }
      }
    });
    this.industryMenuService.getDataByParams({}, 'enterpriseJiegouLoseRateUrl').subscribe(res => {
      console.log('企业流失率', res);
      if (res.responseCode === '_200') {
        if (res.data.length > 0) {
          const ratOptions = res.data;
          this.creatEnterpriseOutflowEchart(ratOptions);
        }
      }
    });

  }
  /*绘制企业规模分布图表*/
  creatEnterpriseScaleEchart(options) {
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
    const xAxisData = [];
    const legendData = [];
    const series = [];

    const copyObjType = {};
    const copyObjScale = {};
    options.forEach(res => {
      const scaleType = res.type;
      const type = res.industry_type;
      if (scaleType && copyObjScale[scaleType]) {
        copyObjScale[scaleType].push(res);
      }else if (scaleType) {
        copyObjScale[scaleType] = [];
        copyObjScale[scaleType].push(res);
        legendData.push(scaleType);
      }
      if (type && !copyObjType[type]) {
        copyObjType[type] = true;
        xAxisData.push(type);
      }
    });
    console.log(legendData, xAxisData)
    /*将提取出来的按行业类型合并的数据处理成所需的seriesData数据格式*/
    for(const item in copyObjScale) {
      const itemObj = {
        name: '阶梯类型',
        type: 'bar',
        data: new Array(xAxisData.length) // 不存在对应类型的数据时设置为0
      };
      for (let i = 0; i < itemObj.data.length; i++) {
        itemObj.data[i] = 0;
      }
      itemObj.name = item;
      copyObjScale[item].forEach(res => {
        const xAxisLabel = res.industry_type;
        if (xAxisLabel) {
          const needData = res.count;
          const index = xAxisData.indexOf(xAxisLabel); // 让series里data的数据位置和x轴坐标类型的数据对应。
          if (itemObj.data[index]) {
            itemObj.data[index] += needData ? Number(needData) : 0;
          }else {
            itemObj.data[index] = needData ? Number(needData) : 0;
          }
        }
      });
      series.push(itemObj);
    }
    const option2 = {
      title: {
        text: '企业营业收入阶梯分布',
        textStyle: {
          color: '#bcbdbf'
        },
        left: 'center'
      },
      color: ['#21cbee', '#168aa1', '#0d4954'],
      grid: {
        left: '3%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
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
          name: '类型',
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
          name: '企业数量(家)',
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
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series: series
    };
    this.jiegouData = option2;
  }
  /*绘制企业星级分布图表*/
  creatEnterpriseStarLevelEchart(options) {
    const labelOption3 = {
      normal: {
        show: true,
        position: 'top'
      }
    };
    const itemStyle = {
    };
    const legendData = [];
    const xAxisData = [];
    const seriesData = [];
    const copyStarObj = {};
    const copyTypeObj = {};
    options.forEach(res => {
      const type = res[0];
      const starType = res[3];
      /*根据星级提取出对应的企业数据*/
      if (type && starType && copyStarObj[starType]) {
        copyStarObj[starType].push(res);
      }else if (type && starType) {
        copyStarObj[starType] = [];
        copyStarObj[starType].push(res);
        legendData.push(starType);
      }
      /*根据企业类型提取出X坐标轴数据*/
      if (type && starType && !copyTypeObj[type]) {
        copyTypeObj[type] = true;
        xAxisData.push(type);
      }
    });
    /*将提取出来的按星级合并的数据处理成所需的seriesData数据格式*/
    for(let item in copyStarObj) {
      const itemObj = {
        name: '五星企业',
        type: 'bar',
        label: labelOption3,
        itemStyle: itemStyle,
        data: new Array(xAxisData.length) // 不存在对应类型的数据时设置为0
      };
      for (let i = 0; i < itemObj.data.length; i++) {
        itemObj.data[i] = 0;
      }
      itemObj.name = item;
      copyStarObj[item].forEach(res => {
        let index = xAxisData.indexOf(res[0]); // 让series里data的数据位置和x轴坐标类型的数据对应。
        if (itemObj.data[index]) {
          itemObj.data[index] += 1;
        }else {
          itemObj.data[index] = 1;
        }
      });
      seriesData.push(itemObj);
    }
    console.log(legendData, xAxisData, seriesData);
    const option3 = {
      color: ['#6f75b3', '#414469', '#21cbee', '#168aa1', '#0d4954'],
      title: {
        text: '企业星级分布',
        textStyle: {
          color: '#bcbdbf'
        },
        left: 'center'
      },
      legend: {
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
        },
        top: '8%'
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
          name: '类型',
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
      yAxis: {
        name: '企业数量(家)',
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
      series: seriesData
    };
    this.jiegouData1 = option3;

  }
  /*绘制企业流失量和流失率图表*/
  creatEnterpriseOutflowEchart(options) {

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

      const xAxisData = [];
      const legendData = ['流失数量', '流失率'];
      const series = {outflowNumber: [], outflowRate: []};

      const copyObjType = {};
      options.forEach(res => {
          const type = res[0];
          if (type && copyObjType[type]) {
              copyObjType[type].push(res);
          }else if (type) {
              copyObjType[type] = [];
              copyObjType[type].push(res);
          }
      });
      /*将提取出来的按行业类型合并的数据处理成所需的seriesData数据格式*/
      for(const item in copyObjType) {
        xAxisData.push(item);
        copyObjType[item].forEach(res => {
          const outflowNumber = Number(res[1]);
          const outflowRate = Number(res[2]);
          series.outflowNumber.push(outflowNumber);
          series.outflowRate.push(outflowRate);
        });
      }
    const option6 = {
      color: ['#21cbee', '#168aa1'],
      title: {
        text: '企业流失数量和流失率',
        textStyle: {
          color: '#bcbdbf'
        },
        left: 'center'
      },
      legend: {
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
        },
        top: 30
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
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
          name: '类型',
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
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series: [
        {
          name: '流失数量',
          type: 'bar',
          barGap: 0,
          label: labelOption6,
          itemStyle: {
            normal: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: '0.8',
            }
          },
          data: series.outflowNumber
        },
        {
          name: '流失率',
          type: 'line',
          yAxisIndex: 1,
          label: labelOption6,
          itemStyle: {
            normal: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: '0.8',
            }
          },
          data: series.outflowRate
        }
      ]
    };

    this.jiegouData4 = option6;
  }

}
