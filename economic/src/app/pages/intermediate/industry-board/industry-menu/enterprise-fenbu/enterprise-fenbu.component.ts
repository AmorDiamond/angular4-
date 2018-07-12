import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import { CHANGE } from '../../../../../core/container-ngrx/container.action';
import { IntermediateService } from '../../../intermediate.service';

declare var echarts: any;
@Component({
  selector: 'app-enterprise-fenbu',
  templateUrl: './enterprise-fenbu.component.html',
  styleUrls: ['./enterprise-fenbu.component.css']
})
export class EnterpriseFenbuComponent implements OnInit {
  enterpriseData: any;
  constructor(private store: Store<ContainerStyle>, private intermediateService: IntermediateService) {
    this.store.select('container');
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

        const labelOption = {
          normal: {
            rotate: 90,
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
            distance: 15
          }
        };
        const option = {
          color: ['#9ea8ff', '#6f75b3', '#414469', '#21cbee', '#168aa1', '#0d4954'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['集成电路', '软件及服务外包', '光电', '生物医药', '通信', '精密机械'],
            textStyle: {
              color: '#bcbdbf'
            },
            top: 10
          },
          calculable: true,
          xAxis: [
            {
              name: '园区',
              nameTextStyle: {
                color: '#bcbdbf'
              },
              type: 'category',
              axisTick: {show: false},
              data: ['2014年', '2015年', '2016年', '2017年'],
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
          series: [
            {
              name: '集成电路',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: [120, 132, 201, 134]
            },
            {
              name: '软件及服务外包',
              type: 'bar',
              label: labelOption,
              data: [120, 182, 191, 334]
            },
            {
              name: '光电',
              type: 'bar',
              label: labelOption,
              data: [150, 232, 201, 154]
            },
            {
              name: '生物医药',
              type: 'bar',
              label: labelOption,
              data: [320, 77, 101, 99]
            }
            ,
            {
              name: '通信',
              type: 'bar',
              label: labelOption,
              data: [150, 232, 101, 154]
            },
            {
              name: '精密机械',
              type: 'bar',
              label: labelOption,
              data: [98, 77, 101, 99]
            }
          ]
        };
        this.enterpriseData = option;
      }, 500);

  }

}
