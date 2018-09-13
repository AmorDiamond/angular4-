import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';
import { Store, select } from '@ngrx/store';
import { CHANGE } from '../../../../../core/container-ngrx/container.action';
import {ContainerStyle} from '../../../../../core/container-ngrx/container.model';
import {Amap} from '../../../../../core/amap-ngrx/amap.model';
import { FloorMenuService } from '../floor-menu.service';

@Component({
  selector: 'app-regist-money',
  templateUrl: './regist-money.component.html',
  styleUrls: ['./regist-money.component.css']
})
export class RegistMoneyComponent implements OnInit, OnDestroy {

  constructor(
    private intermediateService: IntermediateService,
    private store: Store<ContainerStyle>,
    private floorMenuService: FloorMenuService
  ) {
    this.store.pipe(select('container'));
  }
  getShowHideDataFn: any;
  choseBuildName: any;
  choseBuildId: any;
  registerMoneyData: any;
  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('FloorMenu');
    /*this.intermediateService.changeShowHideData('isShowParkBuildBar', true);
    this.getShowHideDataFn = this.intermediateService.getShowHideData().subscribe(subres => {
      this.choseBuildName = subres.choseBuildName;
      this.choseBuildId = subres.choseBuildId;
    });*/
    this.getData();
    /*this.intermediateService.getBuildRegistMoney(this.choseBuildId).subscribe(res => {
      console.log(res);
      setTimeout(() => {
        this.creatRegistMoneyEchart(res);
      }, 500);
    });*/
  }
  ngOnDestroy() {
    // this.intermediateService.changeShowHideData('isShowParkBuildBar', false);
    // this.intermediateService.changeShowHideData('isShowParkNameList', false);
  }
  /*获取数据*/
  getData(floorName?) {
    this.choseBuildName = floorName ? floorName : '高新大楼';
    const params = {dataSupplyTime: new Date().getFullYear(), floor: floorName ? floorName : '高新大楼'}
    this.floorMenuService.getDataByParams({}, 'floorRegisterMoneyUrl').subscribe(res => {
      console.log('楼宇数据', res)
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
    let echartTitle = '各楼宇企业注册资金';
    const option = {
      color:['#21cbee','#168aa1'],
      title:{
        text: echartTitle,
        textStyle:{
          color:'#bcbdbf'
        },
        left:'center'
      },
      grid: {
        left: '3%',
        right: '5%',
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
          name:'楼宇',
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
          barMaxWidth: '30%',
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
