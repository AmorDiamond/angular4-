import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { CHANGE } from '../../../../../core/container-ngrx/container.action';
import { IntermediateService } from '../../../intermediate.service';
import { IndustryMenuService } from "../industry-menu.service";

declare var echarts: any;
@Component({
  selector: 'app-enterprise-fenbu',
  templateUrl: './enterprise-fenbu.component.html',
  styleUrls: ['./enterprise-fenbu.component.css']
})
export class EnterpriseFenbuComponent implements OnInit {
  enterpriseData: any;
  constructor(
    private store: Store<ContainerStyle>,
    private intermediateService: IntermediateService,
    private industryMenuService: IndustryMenuService,
  ) {
    this.store.pipe(select('container'));
  }

  ngOnInit() {
      /*显示当前菜单二级菜单*/
      this.intermediateService.showIndustryMenus('IndustryMenu');
      this.store.dispatch({
          type: CHANGE,
          payload: {
              width: '93%'
          }
      });
      setTimeout(() => {
        this.getData();
      }, 500);

  }
  /*获取数据*/
  getData() {
    this.industryMenuService.getDataByParams({}, 'enterpriseFenbuUrl').subscribe(res => {
      console.log('分布数据', res);
      if(res.responseCode === '_200') {
        if(res.data.importputmap) {
          let formatData = [];
          let options = res.data.importputmap;
          options.forEach(res => {
            if(res && res.industry_type){
              formatData.push(res);
            }
          });
          this.creatEnterpriseEchart(formatData)
        }
      }
    });
  }
  /*绘制企业分布图表*/
  creatEnterpriseEchart(options) {
    let legendData = [];
    let xAxisData = [];
    let series = [];
    const labelOption = {
      normal: {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15
      }
    };
    let copyObjYear = {};
    let copyObjType = {};
    options.forEach(res => {
      let year = res.year;
      let type = res.industry_type;
      if(type && copyObjType[type]){
        copyObjType[type].push(res);
      }else if(type){
        copyObjType[type] = [];
        copyObjType[type].push(res);
        legendData.push(type);
      }
    });
    /*x轴年份包含为近4年*/
    let startYear = new Date().getFullYear() - 4;
    let endYear = startYear + 4;
    for(let i = startYear; i < endYear; i++){
      xAxisData.push(i)
    }

    /*将提取出来的按行业类型合并的数据处理成所需的seriesData数据格式*/
    for(let item in copyObjType) {
      const itemObj = {
        name: '行业类型',
        type: 'bar',
        label: labelOption,
        data: new Array(xAxisData.length) //不存在对应类型的数据时设置为0
      };
      for(let i = 0; i< itemObj.data.length; i++) {
        itemObj.data[i] = 0;
      }
      itemObj.name = item;
      copyObjType[item].forEach(res => {
        if(res.year){
          let index = xAxisData.indexOf(Number(res.year)); // 让series里data的数据位置和x轴坐标类型的数据对应。
          if(itemObj.data[index]) {
            itemObj.data[index] += res.count;
          }else {
            itemObj.data[index] = res.count;
          }
        }
      });
      series.push(itemObj)
    }
    const option = {
      // color: ['#9ea8ff', '#6f75b3', '#414469', '#21cbee', '#168aa1', '#0d4954'],
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 80,
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      legend: {
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
        },
        top: 5
      },
      calculable: true,
      xAxis: [
        {
          name: '年',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          type: 'category',
          axisTick: {show: false},
          data: xAxisData,
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      yAxis:
        {
          name: '企业数量(家)',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          type: 'value',
          splitLine: {show: false},
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ,
      series: series
    };
    this.enterpriseData = option;
  }

}
