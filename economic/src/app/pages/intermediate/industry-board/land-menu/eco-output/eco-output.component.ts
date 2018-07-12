import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { Amap } from '../../../../../core/amap-ngrx/amap.model';
import { Store } from '@ngrx/store';
import { CHANGE } from '../../../../../core/container-ngrx/container.action';
import { ADD_POLYGON } from '../../../../../core/amap-ngrx/amap.actions';
declare var $: any;

@Component({
  selector: 'app-eco-output',
  templateUrl: './eco-output.component.html',
  styleUrls: ['./eco-output.component.css']
})
export class EcoOutputComponent implements OnInit, OnDestroy {

  constructor(private intermediateService: IntermediateService, private store: Store<ContainerStyle>, private storeAmap: Store<Amap>) { }
  revenueTime: any;
  ecoOutputEchart: any;
  ngOnInit() {
    this.revenueTime = this.intermediateService.getInitRevenueTime();
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
        data: {type: 'dataPolygonEcoOutputLands', time: this.revenueTime}
      }
    });

    this.intermediateService.changeTimeColorControl(['isShowColorsBar', 'isShowEcoColor', 'isShowTime', 'isShowEcoTime']);
    this.getEcoOutputEchart();

    $("#datetimepicker-eco-top").datetimepicker({
      autoclose: 1,
      startView: 4,
      minView: 4,
      forceParse: 0,
      startDate: 2015,
      endDate: new Date().getFullYear() - 1,
      initialDate: new Date().getFullYear() - 1
    }).on('changeYear', (ev) => {
      const chooseTime = new Date(ev.date.valueOf()).getFullYear();
      this.revenueTime = chooseTime;
      this.getEcoOutputEchart();
    });
  }
  ngOnDestroy() {
    this.intermediateService.changeTimeColorControl();
  }
  getEcoOutputEchart() {
    this.intermediateService.getEcoOutputEchart(this.revenueTime).subscribe(res => {
      this.creatEcoOutputEchart(res);
    });
  }
  creatEcoOutputEchart(options) {
    const xData = [];
    const yData = [];
    options.forEach(function(item, index) {
      xData.push(item[0]);
      yData.push(item[1]);
    })
    const option = {
      title: {
        text: '单一业主经济产出',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        data: xData,
        axisTick: {show: false},
        axisLabel : {
          textStyle : {
            color : '#fff',
          }
        }
      },
      yAxis: {
        splitLine: {show: false},
        axisLabel : {
          textStyle : {
            color : '#fff',
          }
        }
      },
      animationDurationUpdate: 1200,
      series: [{
        type: 'bar',
        silent: true,
        barWidth: 40,
        barGap: '-100%', // Make series be overlap
        data: yData
      }]
    };
    this.ecoOutputEchart = option;
  }
}
