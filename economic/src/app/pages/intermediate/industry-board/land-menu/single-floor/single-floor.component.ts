import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ADD_POLYGON } from '../../../../../core/amap-ngrx/amap.actions';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { IntermediateService } from '../../../intermediate.service';
import { Amap } from '../../../../../core/amap-ngrx/amap.model';
import { CHANGE } from '../../../../../core/container-ngrx/container.action';

@Component({
  selector: 'app-single-floor',
  templateUrl: './single-floor.component.html',
  styleUrls: ['./single-floor.component.css']
})
export class SingleFloorComponent implements OnInit, OnDestroy {

  constructor(private intermediateService: IntermediateService, private store: Store<ContainerStyle>, private storeAmap: Store<Amap>) {
    this.store.select('container');
  }
  singleFloorEchart: any;

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('LandMenu');
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
    this.storeAmap.dispatch({
      type: ADD_POLYGON,
      payload: {
        action: 'ADD_POLYGON',
        data: 'dataPolygonSingleLands'
      }
    });
    this.intermediateService.getSingleFloorEchart().subscribe(res => {
      const conutData = this.conutTypeData(res)
      this.buildCharts(conutData);
    });
    this.intermediateService.changeTimeColorControl(['isShowColorsBar', 'isShowSingleColor']);
  }
  ngOnDestroy() {
    this.intermediateService.changeTimeColorControl();
  }
  /*组装为echart需要的数据*/
  conutTypeData(obj) {
    const result = [];
    result[0] = {
      name: '单一业主',
      value: obj.single
    }
    result[1] = {
      name: '楼宇',
      value: obj.floor
    }
    result[2] = {
      name: '其他',
      value: obj.other
    }
    return result;
  }
  buildCharts(conutData) {
    const colors = {
      '楼宇': '#f9b620',
      '单一业主': '#4747f1',
      '其他': '#a0dcde'
    };
    let newData = [];
    for (let i = 0; i < conutData.length; i++) {
      if (!conutData[i].build) {
        if (conutData[i].name !== '1' && conutData[i].name !== '2' && conutData[i].name !== '3' && conutData[i].name !== '4' && conutData[i].name !== '5' && conutData[i].name !== '6' && conutData[i].name !== '7' && conutData[i].name !== '8' && conutData[i].name !== '9' && conutData[i].name !== '10') {
          newData.push(conutData[i]);
        }
      }else {
        newData = conutData;
      }
    }
    const industryType = newData;
    console.log(newData)
    const legendData = [];
    const COLORS = [];
    for (let i = 0; i < industryType.length; i++){
      legendData.push(industryType[i].name);
      COLORS.push(colors[industryType[i].name]);
    }
    const option = {
      color : COLORS,
      title : {
        text: '单一业主和楼宇占比',
        x: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
      },
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        // data: ['国有企业','私营企业','外商投资企业','集体所有制企业','股份制企业'],
        data: legendData,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        top: '10%'
      },
      series : [
        {
          name: '单一业主和楼宇占比',
          type: 'pie',
          radius : '45%',
          center: ['65%', '60%'],
          /*data:[
              {value:335, name:'国有企业'},
              {value:1548, name:'私营企业'},
              {value:234, name:'外商投资企业'},
              {value:135, name:'集体所有制企业'},
              {value:154, name:'股份制企业'}
          ],*/
          data: industryType,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          lableLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.singleFloorEchart = option;
  }
}
