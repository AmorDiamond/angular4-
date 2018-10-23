import { Component, OnInit } from '@angular/core';
import { CHANGE } from '../../../core/container-ngrx/container.action';
import { ContainerStyle } from '../../../core/container-ngrx/container.model';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { IndustryBoardService } from './industry-board.service';
import { ToastModalService } from '../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-new-industry-board',
  templateUrl: './new-industry-board.component.html',
  styleUrls: ['./new-industry-board.component.css']
})
export class NewIndustryBoardComponent implements OnInit {

  constructor(
    private store: Store<ContainerStyle>,
    private router: Router,
    private industryBoardService: IndustryBoardService,
    private toastModalService: ToastModalService
  ) { }
  RelationChartData: any;
  ngOnInit() {
    this.getData();
  }
  /*获取数据*/
  getData() {
    this.industryBoardService.requestByParams({}, 'relationChartUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.creatRelationChart(res.data);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误', type: 'error'});
      }
    });
  }
  /*图表点击事件*/
  onChartClick(event) {
    const data = event.data;
    if (data.isType && data.hasChildren) {
      console.log(data.typeId);
      this.router.navigate(['/int/industryBoard/typeInfo'], {
        queryParams: {
          id: data.typeId,
          name: data.name
        }
      });
    }
  }
  /*绘制关系图图表*/
  creatRelationChart(options) {
    const seriesData = [];
    seriesData.push({name: '产业', symbolSize: 90, value: '产业', x: null, y: null, itemStyle: {normal: {color: '#5079d9'}}});
    const links = [];
    const copyObj = {};
    options.forEach((item, index) => {
      if (item[1] !== '新经济') {
        if (copyObj[item[1]]) {
          if (item[3]) {
            copyObj[item[1]].children.push({name: item[3], id: item[2], value: item[4]});
          }
        }else {
          copyObj[item[1]] = {id: '', children: []};
          copyObj[item[1]].id = item[0];
          if (item[3]) {
            copyObj[item[1]].children.push({name: item[3], id: item[2], value: item[4]});
          }
        }
      }
    });
    console.log(copyObj)
    for (const item in copyObj) {
      if (item) {
        const hasChildren = copyObj[item].children.length ? true : false;
        seriesData.push({name: item, symbolSize: 60, value: item, typeId: copyObj[item].id, isType: true, hasChildren: hasChildren, x: null, y: null, itemStyle: {normal: {color: '#3e5f9c'}}});
        links.push({source: item, target: '产业'});
        copyObj[item].children.forEach(typeItem => {
          seriesData.push({name: typeItem.name, symbolSize: 50, value: typeItem.name, x: null, y: null, itemStyle: {normal: {color: '#2a3653'}}});
          seriesData.push({name: typeItem.id, symbolSize: 40, value: typeItem.value, x: null, y: null, itemStyle: {normal: {color: '#1f232d'}}});
          links.push({source: typeItem.name, target: item});
          links.push({source: typeItem.id, target: typeItem.name});
        });
      }
    }
    const option = {
      title: {
      },
      tooltip: {
        show: false
      },
      legend: [{
        // selectedMode: 'single',
        // data: categories.map(function (a) {
        //   return a.name;
        // })
      }],
      animation: false,
      series : [
        {
          name: '关系图',
          type: 'graph',
          layout: 'force',
          data: seriesData,
          links: links,
          // categories: categories,
          roam: true,
          draggable: true,
          lineStyle: {
            normal: {
              color: '#ddd',
              type: 'dashed'
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 5,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              /*shadowColor: 'rgba(255, 255, 255, 0.5)',
              shadowBlur: 2*/
            }
          },
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: [
                '{a|{c}}',
              ].join('\n'),
              rich: {
                a: {
                  color: '#fff',
                  lineHeight: 10
                },
              }
            },
          },
          force: {
            initLayout: 'circular',
            edgeLength: 100,
            repulsion: 200
          }
        }
      ]
    };
    this.RelationChartData = option;
  }

}
