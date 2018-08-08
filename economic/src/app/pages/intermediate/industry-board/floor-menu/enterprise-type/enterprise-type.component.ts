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
    this.intermediateService.changeShowHideData('isShowParkBuildBar', true);
    this.getData();
  }
  ngOnDestroy() {
    this.intermediateService.changeShowHideData('isShowParkBuildBar', false);
    this.intermediateService.changeShowHideData('isShowParkNameList', false);
  }
  /*获取数据*/
  getData(floorName?) {
    this.choseBuildName = floorName ? floorName : '高新大楼';
    const params = {dataSupplyTime: new Date().getFullYear(), floor: floorName ? floorName : '高新大楼'}
    this.floorMenuService.getDataByParams(params,'floorMenuUrl').subscribe(res => {
      console.log('楼宇数据', res)
      if(res.responseCode === '_200') {
        if(res.data.countmap && res.data.countmap.length > 0) {
          this.creatEnterpriseTypeEchart(res.data.countmap);
        }
      }
    })
  }
  /*绘制企业类型图表*/
  creatEnterpriseTypeEchart(options) {
    let xAxisData = [];
    let seriesData = [];
    options.forEach(res => {
      xAxisData.push(res[0]);
      seriesData.push(res[1]);
    });
    let echartTitle = this.choseBuildName + '各登记类型的企业数量';
    const option = {
      color:['#21cbee','#168aa1'],
      title:{
        text: echartTitle,
        textStyle:{
          color:'#bcbdbf'
        },
        left:'center'
      },
      legend: {
        data: ['登记类型'],
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
      series: [
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
      ]
    };
    this.enterpriseTypeEchartData = option;
  }

}
