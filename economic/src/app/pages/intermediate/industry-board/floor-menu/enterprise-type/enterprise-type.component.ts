import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';
import { FloorMenuService } from "../floor-menu.service";

@Component({
  selector: 'app-enterprise-type',
  templateUrl: './enterprise-type.component.html',
  styleUrls: ['./enterprise-type.component.css']
})
export class EnterpriseTypeComponent implements OnInit, OnDestroy {

  constructor(
    private intermediateService: IntermediateService,
    private floorMenuService: FloorMenuService
  ) { }
  choseBuildName: any;
  enterpriseTypeEchartData: any;
  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('FloorMenu');
    // this.intermediateService.changeShowHideData('isShowParkBuildBar', true);
    this.getData();
  }
  ngOnDestroy() {
    // this.intermediateService.changeShowHideData('isShowParkBuildBar', false);
    // this.intermediateService.changeShowHideData('isShowParkNameList', false);
  }
  /*获取数据*/
  getData(floorName?) {
    this.choseBuildName = floorName ? floorName : '高新大楼';
    const params = {dataSupplyTime: new Date().getFullYear(), floor: floorName ? floorName : '高新大楼'};
    this.floorMenuService.getDataByParams({}, 'floorEnterpriseTypeUrl').subscribe(res => {
      console.log('楼宇数据', res)
      if (res.responseCode === '_200') {
        this.creatEnterpriseTypeEchart(res.data);
      }
    });
  }
  /*绘制企业类型图表*/
  creatEnterpriseTypeEchart(options) {
    /*let xAxisData = [];
    let seriesData = [];
    options.forEach(res => {
      xAxisData.push(res[0]);
      seriesData.push(res[1]);
    });*/

    const echartData = this.getPublicEchartData(options);
    const xAxisData = echartData.xAxisData;
    const series = echartData.series;
    const legendData = echartData.legendData;
    let echartTitle = this.choseBuildName + '各登记类型的企业数量';
    const option = {
      // color: ['#21cbee','#168aa1'],
      title: {
        text: echartTitle,
        textStyle: {
          color: '#bcbdbf'
        },
        left: 'center'
      },
      grid: {
        left: '3%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        show: false,
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
        },
        top: 30
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow'
        }
      },
      calculable: true,
      xAxis: [
        {
          name: '楼宇',
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
          name: '数量(家)',
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
        {type: 'inside'}
      ],
      series: series
        /*[
        {
          name: '登记数量',
          type: 'bar',
          barMaxWidth: '20%',
          label: {
            normal: {
              show: true,
              position: 'top',
            }
          },
          data: seriesData
        }
      ]*/
    };
    this.enterpriseTypeEchartData = option;
  }
  /*提取公共图表数据*/
  getPublicEchartData(options, type?) {
    const xAxisData = [];
    const legendData = [];
    const series = [];

    const copyObjStreet = {};
    const copyObjType = {};
    options.forEach(res => {
      if (res[0] && res[1]) {
        const enterpriseType = res[1];
        const street = res[0];
        if (enterpriseType && copyObjType[enterpriseType]) {
          copyObjType[enterpriseType].push(res);
        }else if (enterpriseType) {
          copyObjType[enterpriseType] = [];
          copyObjType[enterpriseType].push(res);
          legendData.push(enterpriseType);
        }
        if (street && !copyObjStreet[street]) {
          copyObjStreet[street] = true;
          xAxisData.push(street);
        }
      }
    });
    console.log(legendData, xAxisData)
    /*将提取出来的按行业类型合并的数据处理成所需的seriesData数据格式*/
    for (const item in copyObjType) {
      const itemObj = {
        name: '企业类型',
        type: 'bar',
        barMaxWidth: '30%',
        data: new Array(xAxisData.length) // 不存在对应类型的数据时设置为0
      };
      for (let i = 0; i < itemObj.data.length; i++) {
        itemObj.data[i] = 0;
      }
      itemObj.name = item;
      copyObjType[item].forEach(res => {
        const xAxisLabel = res[0];
        if (xAxisLabel) {
          const needData = res[2];
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
    return {xAxisData: xAxisData, legendData: legendData, series: series};
  }

}
