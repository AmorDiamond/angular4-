import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ADD_INDUSTRY_MAP_POLYGON } from '../../../../core/amap-ngrx/amap.actions';
import { Amap } from '../../../../core/amap-ngrx/amap.model';
import { IndustryMapFenbuService } from '../industry-map-fenbu.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-enterprise-fenbu',
  templateUrl: './enterprise-fenbu.component.html',
  styleUrls: ['./enterprise-fenbu.component.css']
})
export class EnterpriseFenbuComponent implements OnInit, OnDestroy {

  constructor(private storeAmap: Store<Amap>, private industryMapFenbuService: IndustryMapFenbuService) { }
  parkProportionEchart: any;
  parkIndustryProportionEchart: any;
  selectParkName = '园区产业占比';
  selectParkNameSubscription: Subscription;
  ngOnInit() {
    this.storeAmap.dispatch({
      type: ADD_INDUSTRY_MAP_POLYGON,
      payload: {
        action: 'ADD_INDUSTRY_MAP_POLYGON',
        data: {
          type: 'parkIndustry'
        }
      }
    })
    this.selectParkNameSubscription = this.industryMapFenbuService.getSelectParkIndustry().subscribe(res => {
      this.selectParkName = res.options ? res.options : '园区产业占比';
      this.creatParkIndustryProportionEchart(this.selectParkName);
    })
    setTimeout(() => {
      this.creatParkProportionEchart();
      this.creatParkIndustryProportionEchart();
    }, 500);
  }
  ngOnDestroy() {
    this.selectParkNameSubscription.unsubscribe();
  }
  creatParkProportionEchart() {
    const option_jckze = {
      title : {
        show:false,
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: ""
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['南部园区','西部园区','东部园区'],
        textStyle:{
          color:'#bcbdbf'
        }
      },
      series : [
        {
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:335, name:'南部园区'},
            {value:310, name:'西部园区'},
            {value:234, name:'东部园区'}
//                            {value:135, name:'视频广告'},
//                            {value:1548, name:'搜索引擎'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.9)'
            }
          }
        }
      ]
    };
    this.parkProportionEchart = option_jckze;
  }
  creatParkIndustryProportionEchart(name?) {
    let data = [
      {value:680, name:'软件及服务外包'},
      {value:310, name:'精密机械'},
      {value:234, name:'生物医药'},
      {value:135, name:'通信'},
      {value:350, name:'光电'},
      {value:290, name:'集成电路'}
    ];
    if(name=='天府生命科技园'){
      data = [
        {value:56, name:'软件及服务外包'},
        {value:45, name:'精密机械'},
        {value:150, name:'生物医药'},
        {value:65, name:'通信'},
        {value:47, name:'光电'},
        {value:89, name:'集成电路'}
      ];
    }else if(name=='天府新谷'){
      data = [
        {value:120, name:'软件及服务外包'},
        {value:80, name:'精密机械'},
        {value:40, name:'生物医药'},
        {value:60, name:'通信'},
        {value:70, name:'光电'},
        {value:90, name:'集成电路'}
      ];
    }else if(name=='成都高新孵化园'){
      data = [
        {value:210, name:'软件及服务外包'},
        {value:150, name:'精密机械'},
        {value:140, name:'生物医药'},
        {value:110, name:'通信'},
        {value:100, name:'光电'},
        {value:80, name:'集成电路'}
      ];
    }else if(name=='天府软件园'){
      data = [
        {value:335, name:'软件及服务外包'},
        {value:180, name:'精密机械'},
        {value:140, name:'生物医药'},
        {value:160, name:'通信'},
        {value:170, name:'光电'},
        {value:120, name:'集成电路'}
      ];
    }
    const option_cy = {
      title : {
        show:false,
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        x:'center'
      },
      color:['#f9b621','#9ea8ff','#21cbee','#5f6599','#f43723','#0d4954'],
      tooltip : {
        trigger: 'item',
        formatter: ""
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['软件及服务外包','精密机械','生物医药','通信','光电','集成电路'],
        textStyle:{
          color:'#bcbdbf'
        }
      },
      series : [
        {
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.9)'
            }
          }
        }
      ]
    };
    this.parkIndustryProportionEchart = option_cy;
  }
}
