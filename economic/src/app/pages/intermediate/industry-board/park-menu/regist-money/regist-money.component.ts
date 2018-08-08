import { Component, OnInit } from '@angular/core';
import { IntermediateService } from '../../../intermediate.service';
import { Store, select } from '@ngrx/store';
import { ContainerStyle } from '../../../../../core/container-ngrx/container.model';
import {CHANGE} from '../../../../../core/container-ngrx/container.action';

@Component({
  selector: 'app-regist-money',
  templateUrl: './regist-money.component.html',
  styleUrls: ['./regist-money.component.css']
})
export class RegistMoneyComponent implements OnInit {
  registMoneyData: any;
  parkName = '起步园区';
  chooseBuildName = undefined;
  chooseBuildId = '';
  colors = {
    '生物医药': '#ff7e9f',
    '电子信息': '#ff7e00',
    '精密制造': '#a57c52',
    '先进制造': '#79a541',
    '其他': '#7d7dff',
    '服务业': '#ff0000'
  }
  conutData= [];
  typeList = [];
  constructor(private intermediateService: IntermediateService, private store: Store<ContainerStyle>) {
    this.store.pipe(select('container'));
  }

  ngOnInit() {
    /*显示当前菜单二级菜单*/
    this.intermediateService.showIndustryMenus('ParkMenu');

      const test = this.intermediateService.getParkRegistMoney('高新西区')
        .subscribe(res => {
          console.log(res);
          for(var i=0;i<res.length;i++){
            if(res[i].floorId){
              if(this.chooseBuildName !=undefined){
                if(this.chooseBuildId == res[i].floorId){
                  this.typeList.push(res[i].type);
                }
              }else{
                if(this.parkName == res[i].location){
                  this.typeList.push(res[i].type);
                }
              }
            }else{
              this.typeList.push(res[i]);
            }
          }
          this.conutData = this.conutTypeData(this.typeList);

          setTimeout(() => {
            this.buildCharts(this.conutData);
          },500)
        })
      console.log(test);
  }

  /*数组去重*/
  unique (arr) {
    return Array.from(new Set(arr))
  }
  /*组装为echart需要的数据*/
  conutTypeData(arr) {
    var nameArr = [];
    var result = [];
    for(var i=0;i<arr.length;i++){
      // console.log(arr[i]);
      var j;
      if(arr[i].total){
        if( (j=nameArr.indexOf(arr[i].type))>-1){
          /*for(var j=0;j<result.length;j++){
              if(result[j].name == arr[i]){
                  result[j].value +=1;
              }
          }*/
          result[j].value +=arr[i].total;
        }else {
          nameArr.push(arr[i]);
          result.push({
            value:arr[i].total,
            name:arr[i].type
          })
        }
      }else {
        if( (j=nameArr.indexOf(arr[i]))>-1){
          /*for(var j=0;j<result.length;j++){
              if(result[j].name == arr[i]){
                  result[j].value +=1;
              }
          }*/
          result[j].value +=1;
        }else {
          nameArr.push(arr[i]);
          result.push({
            value:arr[i][0],
            name:arr[i][1],
            itemStyle: {
              color: this.colors[arr[i][1]]
            },
            build: true,
          })
        }
      }
    }
    return result;
  }
  buildCharts(conutData) {
    let newData = [];
    for(var i=0;i<conutData.length;i++){
      if(!conutData[i].build){
        if(conutData[i].name !="1" && conutData[i].name !="2" && conutData[i].name !="3" && conutData[i].name !="4" && conutData[i].name !="5" && conutData[i].name !="6" && conutData[i].name !="7" && conutData[i].name !="8" && conutData[i].name !="9" && conutData[i].name !="10"){
          newData.push(conutData[i]);
        }
      }else{
        if (conutData[i].name && conutData[i].name.indexOf('有限') < 0 && conutData[i].name.indexOf('合作制') < 0 && conutData[i].name.indexOf('所有制') < 0) {
          newData.push(conutData[i]);
        }
      }
    }
    const industryType = newData;
    console.log(newData)
    const legendData = [];
    const COLORS = [];
    for(var i=0;i<industryType.length;i++){
      legendData.push(industryType[i].name)
      COLORS.push(this.colors[industryType[i].name]);
    }
    console.log(industryType)
    console.log(legendData)
    const option = {
      color : COLORS,
      title : {
        text: '企业注册资本占比',
        x:'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)",
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
          name: '企业注册资本占比',
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
          data:industryType,
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
    this.registMoneyData = option;
  }

}
