import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { UsePanelControlServiceService } from '../use-panel-control-service.service';
import { LandServiceService } from '../../land-service.service';
import { Store, select } from '@ngrx/store';
import { CHANGE_LOADING } from '../../../core/loading-layer-ngrx/loading-layer.actions';
import {SAVE_MAP} from '../../../core/map-obj-ngrx/amap.actions';

@Component({
  selector: 'app-nature-proportion-route',
  templateUrl: './nature-proportion-route.component.html',
  styleUrls: ['./nature-proportion-route.component.css']
})
export class NatureProportionRouteComponent implements OnInit, OnDestroy {

  constructor(private routeInfo: ActivatedRoute,
              private usePanelControlService: UsePanelControlServiceService,
              private landService: LandServiceService,
              private loadLayerStore: Store<any>) {
    this.loadLayerStore$ = this.loadLayerStore.pipe(select('loadingLayer'));
  }
  loadLayerStore$: any;
  chooseNatureType = {};
  routeSubscription: Subscription;
  natureColorSubscription: Subscription;
  showRightPanel = true;
  totalGongyeLandNum: number;
  totalInefficientLandNum: number;
  natureLandTypeProporData = {
    gongyeLand: {
      proporEcharts: null,
      nowTypePropor: null,
      otherTypePropor: null
    },
    qitaLand: {
      proporEcharts: null,
      nowTypePropor: null,
      otherTypePropor: null
    },
    keyanLand: {
      proporEcharts: null,
      nowTypePropor: null,
      otherTypePropor: null
    },
    shangfuLand: {
      proporEcharts: null,
      nowTypePropor: null,
      otherTypePropor: null
    },
    zhuzhaiLand: {
      proporEcharts: null,
      nowTypePropor: null,
      otherTypePropor: null
    },
    chubeiLand: {
      proporEcharts: null,
      nowTypePropor: null,
      otherTypePropor: null
    }
  };
  ngOnInit() {
    /*监听路由变化，避免切换路由数据不刷新*/
    // this.routeSubscription = this.routeInfo.queryParams.subscribe((queryParams: Params) => {
    //   const paramsData = queryParams;
    //   for (const v in paramsData) {
    //     if (paramsData[v] === 'false') {
    //       this.chooseNatureType[v] = false;
    //     }else {
    //       this.chooseNatureType[v] = true;
    //     }
    //   }
    //   this.usePanelControlService.changeColorListControl('580px');
    //   this.usePanelControlService.changePanelControl(false);
    //   this.usePanelControlService.changeNatureColorListChooseStatus(this.chooseNatureType);
    // });
    this.natureColorSubscription = this.usePanelControlService.getNatureColorListChooseStatus().subscribe(res => {
      this.chooseNatureType = res;
      this.usePanelControlService.changeColorListControl('580px');
      this.usePanelControlService.changePanelControl(false);
      // this.usePanelControlService.changeNatureColorListChooseStatus(this.chooseNatureType);
      // console.log(this.chooseNatureType);
      this.getNatureLandData();
    });
  }
  ngOnDestroy() {
    this.natureColorSubscription.unsubscribe();
    this.usePanelControlService.changePanelControl(true);
    // this.usePanelControlService.resetDrawPolygonLandsStyleStatus();
    this.usePanelControlService.changeColorListControl('420px');
  }
  /*获取地块数据用于计算面积等*/
  getNatureLandData() {
    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: true
      }
    });
    /*重置图表占比数据*/
    this.natureLandTypeProporData = {
      gongyeLand: {
        proporEcharts: null,
        nowTypePropor: null,
        otherTypePropor: null
      },
      qitaLand: {
        proporEcharts: null,
        nowTypePropor: null,
        otherTypePropor: null
      },
      keyanLand: {
        proporEcharts: null,
        nowTypePropor: null,
        otherTypePropor: null
      },
      shangfuLand: {
        proporEcharts: null,
        nowTypePropor: null,
        otherTypePropor: null
      },
      zhuzhaiLand: {
        proporEcharts: null,
        nowTypePropor: null,
        otherTypePropor: null
      },
      chubeiLand: {
        proporEcharts: null,
        nowTypePropor: null,
        otherTypePropor: null
      }
    };
    const dataPolygonNatureLands = this.landService.dataPolygonNatureLands;
    const dataPolygonInefficientLands = this.landService.dataPolygonInefficientLands;
    const allLand = dataPolygonNatureLands.length > 0 ? dataPolygonNatureLands : dataPolygonInefficientLands;
    /*判断是否已存在土地用地数据--在组装用地占比数据需要使用所有地块的数据计算*/
    if (dataPolygonNatureLands.length > 0 || dataPolygonInefficientLands.length > 0) {
      const dataPolygon = dataPolygonNatureLands.length > 0 ? dataPolygonNatureLands : dataPolygonInefficientLands;
      this.formatNatureLandProporEchartsData(dataPolygon);
    }else {
      this.landService.indexeDBmethod.byIndexGet('landData', 'dataPolygonNatureLands', (result) => {
        const dataPolygon = result ? result.data : [];
        /*判断indexedDB是否存在数据*/
        if (dataPolygon.length > 0) {
          this.formatNatureLandProporEchartsData(dataPolygon);
        }
      });
    }
  }
  /*处理每个性质占比图表数据*/
  formatNatureLandProporEchartsData(landOptions) {
    const allLand = landOptions;
    /*获取所有工业用地和低效用地*/
    let totalGongyeLandNum = 0;
    let totalInefficientLandNum = 0;
    allLand.forEach(function(v, i){
      if (v.generalType === '工业用地') {
        totalGongyeLandNum++;
      }
      if (v.inefficient) {
        totalInefficientLandNum++;
      }
    });
    this.totalGongyeLandNum = totalGongyeLandNum;
    this.totalInefficientLandNum = totalInefficientLandNum;
    /*处理选中的地块数据*/
    const options = this.chooseNatureType;
    for (const v in options) {
      if (options[v]) {
        let allUseLandArea = 0; // 所有已使用地块面积
        let otherTypeUseLandArea = 0; // 其他已使用地块面积
        let nowTypeLandArea = 0; // 当前类型地块的所有面积
        const nowLandArea = 0; // 当前地块的面积
        const otherSingleUseLandArea = 0; // 当前类型其他面积
        allLand.forEach(function(value, i){
          // if(v.generalType != "储备用地"){
          // allUseLand.push(v);
          allUseLandArea += Number(value.landArea);
          // }
          if (value.generalType === v) {
            nowTypeLandArea += Number(value.landArea);
          }
        });
        allUseLandArea = Math.round(allUseLandArea);
        nowTypeLandArea = Math.round(nowTypeLandArea);
        otherTypeUseLandArea = Math.round(allUseLandArea - nowTypeLandArea);

        const otherTypeProportion = (otherTypeUseLandArea / allUseLandArea) * 100;
        const nowTypeProportion = (nowTypeLandArea / allUseLandArea) * 100;
        this.creatSingleTypeLandPropor({legendData: [v, '其他'],
          serverData: [{value: nowTypeLandArea, name: v}, {value: otherTypeUseLandArea, name: '其他'}]}, v, allUseLandArea);
      }
    }

    this.loadLayerStore$.dispatch({
      type: CHANGE_LOADING,
      payload: {
        status: false
      }
    });
  }
  /*绘制性质占比图表*/
  creatSingleTypeLandPropor(options, type, allUseLandArea) {
    const legendData = options.legendData;
    const serverData = options.serverData;
    const option = {
      // color: COLORS,
      title : {
        text: type + '占比',
        x: 'center',
        textStyle: {
          color: '#333',
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
        left: 'center',
        // data: ['国有企业','私营企业','外商投资企业','集体所有制企业','股份制企业'],
        data: legendData,
        textStyle: {
          color: '#333',
          fontSize: 14
        },
        top: '10%'
      },
      series : [
        {
          name: '用地性质占比',
          type: 'pie',
          center : ['50%', '50%'],
          radius : '45%',
          /*data:[
              {value:335, name:'国有企业'},
              {value:1548, name:'私营企业'},
              {value:234, name:'外商投资企业'},
              {value:135, name:'集体所有制企业'},
              {value:154, name:'股份制企业'}
          ],*/
          data: serverData,
          label: {
            normal: {
              show: true
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

    if (type === '工业用地') {
      this.natureLandTypeProporData.gongyeLand.nowTypePropor = ((serverData[0].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.gongyeLand.otherTypePropor = ((serverData[1].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.gongyeLand.proporEcharts = option;
    }else if (type === '公共设施及其他用地') {
      this.natureLandTypeProporData.qitaLand.nowTypePropor = ((serverData[0].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.qitaLand.otherTypePropor = ((serverData[1].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.qitaLand.proporEcharts = option;
    }else if (type === '科研用地') {
      this.natureLandTypeProporData.keyanLand.nowTypePropor = ((serverData[0].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.keyanLand.otherTypePropor = ((serverData[1].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.keyanLand.proporEcharts = option;
    }else if (type === '商服用地') {
      this.natureLandTypeProporData.shangfuLand.nowTypePropor = ((serverData[0].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.shangfuLand.otherTypePropor = ((serverData[1].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.shangfuLand.proporEcharts = option;
    }else if (type === '住宅用地') {
      this.natureLandTypeProporData.zhuzhaiLand.nowTypePropor = ((serverData[0].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.zhuzhaiLand.otherTypePropor = ((serverData[1].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.zhuzhaiLand.proporEcharts = option;
    }else if (type === '储备用地') {
      this.natureLandTypeProporData.chubeiLand.nowTypePropor = ((serverData[0].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.chubeiLand.otherTypePropor = ((serverData[1].value / allUseLandArea) * 100).toFixed(2);
      this.natureLandTypeProporData.chubeiLand.proporEcharts = option;
    }
  }
  /*改变右侧内容面板显隐*/
  changeRightPanelShow() {
    this.showRightPanel = !this.showRightPanel;
    const type = this.showRightPanel ?  false : true;
    this.usePanelControlService.changePanelControl(type);
    const colorListRight = this.showRightPanel ? '580px' : '420px';
    this.usePanelControlService.changeColorListControl(colorListRight);
  }

}
