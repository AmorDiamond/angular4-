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
  westparkIndustryProportionEchart: any;
  southparkIndustryProportionEchart: any;
  easthparkIndustryProportionEchart: any;
  biologicalcityIndustryProportionEchart: any;
  westparkIndustryProportionTips = '加载中...';
  southparkIndustryProportionTips = '加载中...';
  easthparkIndustryProportionTips = '加载中...';
  biologicalcityIndustryProportionTips = '加载中...';
  selectParkName: any;
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
    /*this.selectParkNameSubscription = this.industryMapFenbuService.getSelectParkIndustry().subscribe(res => {
      this.selectParkName = res.options ? res.options : '园区产业企业占比';
      this.creatParkIndustryProportionEchart(this.selectParkName);
    })*/
    this.getData();
  }
  ngOnDestroy() {
    // this.selectParkNameSubscription.unsubscribe();
  }
  /*获取数据*/
  getData(parkName?) {
    this.selectParkName = parkName ? parkName : '高新西区';
    let params = {dataSupplyTime: new Date().getFullYear(), functionalareaindustry: this.selectParkName};
    let time = new Date().getFullYear();
    let findParams = [
      {findParams: {dataSupplyTime: time, functionalareaindustry: '高新西区'}, url: 'industryMapFunctionAreaMenuUrl'},
      {findParams: {dataSupplyTime: time, functionalareaindustry: '高新南区'}, url: 'industryMapFunctionAreaMenuUrl'},
      {findParams: {dataSupplyTime: time, functionalareaindustry: '高新东区'}, url: 'industryMapFunctionAreaMenuUrl'},
      {findParams: {dataSupplyTime: time, functionalareaindustry: '天府国际生物城'}, url: 'industryMapFunctionAreaMenuUrl'},
    ];
    this.industryMapFenbuService.getRequestByForkJoin(findParams).subscribe(res => {
      console.log('功能区数据', res)
      if(res[0].responseCode === '_200') {
        let options = res[0].data.registmap;
        if(options.length < 1) {
          this.westparkIndustryProportionTips = '暂无信息！';
        }else {
          this.creatParkIndustryProportionEchart('westparkIndustryProportionEchart', options);
        }
      }
      if(res[1].responseCode === '_200') {
        let options = res[1].data.registmap;
        if(options.length < 1) {
          this.southparkIndustryProportionTips = '暂无信息！';
        }else {
          this.creatParkIndustryProportionEchart('southparkIndustryProportionEchart', options);
        }
      }
      if(res[2].responseCode === '_200') {
        let options = res[2].data.registmap;
        if(options.length < 1) {
          this.easthparkIndustryProportionTips = '暂无信息！';
        }else{
          this.creatParkIndustryProportionEchart('easthparkIndustryProportionEchart', options);
        }
      }
      if(res[3].responseCode === '_200') {
        let options = res[3].data.registmap;
        if(options.length < 1) {
          this.biologicalcityIndustryProportionTips = '暂无信息！';
        }else{
          this.creatParkIndustryProportionEchart('biologicalcityIndustryProportionEchart', options);
        }
      }
    })
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
  creatParkIndustryProportionEchart(dataName, options) {
    /*let data = [
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
    }*/
    let echartTitle = name ?  name + '产业企业占比' : '园区产业企业占比';
    let legendData = [];
    let seriesData = [];
    options.forEach(res => {
      legendData.push(res[0]);
      seriesData.push({value: res[2], name: res[0]});
    });
    const option_cy = {
      title : {
        show: false,
        text: echartTitle,
        x:'center'
      },
      color:['#f9b621','#9ea8ff','#21cbee','#5f6599','#f43723','#0d4954'],
      tooltip : {
        trigger: 'item',
        formatter: ""
      },
      legend: {
        left: 'center',
        data: legendData,
        textStyle:{
          color:'#bcbdbf'
        }
      },
      series : [
        {
          name: '企业占比',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: seriesData,
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
    this[dataName] = option_cy;
  }
}
