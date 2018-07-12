import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';
import { Store } from '@ngrx/store';
import { CHANGE } from '../../../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { CLEAR_MARKER, ADD_POLYGON } from '../../../../../core/amap-ngrx/amap.actions';
import { Amap } from '../../../../../core/amap-ngrx/amap.model';
declare var AMap: any;

@Component({
  selector: 'app-land-nature',
  templateUrl: './land-nature.component.html',
  styleUrls: ['./land-nature.component.css']
})
export class LandNatureComponent implements OnInit, OnDestroy {

  colors = {
    '储备用地': '#bf7eff',
    '工业用地': '#a57c52',
    '公共设施及其他用地': '#2a8ab8',
    '科研用地': '#ff7eff',
    '商服用地': '#ff0000',
    '住宅用地': '#ffd041'
  };
  constructor(private intermediateService: IntermediateService, private store: Store<ContainerStyle>, private storeAmap: Store<Amap>) {
    this.store.select('container');
  }
  landNatureEchat: any;

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('LandMenu');
    this.store.dispatch({
      type: CHANGE,
      payload: {
        width: '60%'
      }
    });
    this.intermediateService.getLandNatureEchat()
      .subscribe(res => {
        const conutData = this.conutTypeData(res);
        setTimeout(() => {
          this.buildCharts(conutData);
        }, 500);
      });
    this.intermediateService.changeTimeColorControl(['isShowColorsBar', 'isShowNatureColor']);
    this.storeAmap.dispatch({
      type: ADD_POLYGON,
      payload: {
        action: 'ADD_POLYGON',
        data: 'dataPolygonNatureLands'
      }
    });
    /*this.intermediateService.getLandNaturePolygon()
      .subscribe(res => {
        this.storeAmap.dispatch({
          type: ADD_POLYGON,
          payload: {
            action: 'ADD_POLYGON',
            data: ''
          }
        });
      });*/
  }
  ngOnDestroy() {
    this.intermediateService.changeTimeColorControl();
  }
  /*组装为echart需要的数据*/
  conutTypeData(arr) {
    arr.shift();
    const result = [];
    arr.forEach(function (item, index) {
      result.push({
        name: item[1],
        value: item[0]
      });
    });
    return result;
  }
  buildCharts(conutData) {
    let newData = [];
    for (let i = 0; i < conutData.length; i++) {
      if (!conutData[i].build) {
        if (conutData[i].name !== '1' &&
          conutData[i].name !== '2' &&
          conutData[i].name !== '3' &&
          conutData[i].name !== '4' &&
          conutData[i].name !== '5' &&
          conutData[i].name !== '6' &&
          conutData[i].name !== '7' &&
          conutData[i].name !== '8' &&
          conutData[i].name !== '9' &&
          conutData[i].name !== '10') {
          newData.push(conutData[i]);
        }
      } else {
        newData = conutData;
      }
    }
    const industryType = newData;
    const legendData = [];
    const COLORS = [];
    for (let i = 0; i < industryType.length; i++) {
      legendData.push(industryType[i].name);
      COLORS.push(this.colors[industryType[i].name]);
    }
    console.log(industryType);
    console.log(legendData);
    const option = {
      color: COLORS,
      title: {
        text: '用地性质占比',
        x: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
      },
      tooltip: {
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
      series: [
        {
          name: '用地性质占比',
          type: 'pie',
          radius: '45%',
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
    this.landNatureEchat = option;
  }
}
