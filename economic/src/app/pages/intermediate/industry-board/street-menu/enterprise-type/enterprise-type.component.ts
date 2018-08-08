import { Component, OnInit } from '@angular/core';
import { StreetMenuService } from "../street-menu.service";

@Component({
  selector: 'app-enterprise-type',
  templateUrl: './enterprise-type.component.html',
  styleUrls: ['./enterprise-type.component.css']
})
export class EnterpriseTypeComponent implements OnInit {

  constructor(
    private streetMenuService: StreetMenuService
  ) { }
  streetName: any;
  enterpriseTypeEchartData: any;
  ngOnInit() {
    this.getData();
  }
  /*获取数据*/
  getData(streetName?) {
    this.streetName = streetName ? streetName : '东街';
    const params = {dataSupplyTime: new Date().getFullYear(), streetOffice: streetName? streetName : '东街'};
    this.streetMenuService.getDataByParams(params, 'streetMenuUrl').subscribe(res => {
      console.log('街道数据', res)
      if(res.responseCode === '_200') {
        if(res.data.streetmap) {
          this.creatEnterpriseTypeEchart(res.data.streetmap);
        }
      }
    })
  }
  /*绘制企业类型图表*/
  creatEnterpriseTypeEchart(options) {
    let xAxisData = [];
    let seriesData = [];
    options.forEach(res => {
      xAxisData.push(res[0]);
      seriesData.push(res[1]);
    });
    let echartTitle = this.streetName + '各登记类型的企业数量';
    const option = {
      color:['#21cbee','#168aa1'],
      title:{
        text: echartTitle,
        textStyle:{
          color:'#bcbdbf'
        },
        left:'center'
      },
      legend: {
        data: ['登记类型'],
        textStyle:{
          color: "#bcbdbf"
        },
        top: 30
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
          name:'类型',
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
          name: '数量(家)',
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
          name: '登记数量',
          type: 'bar',
          barMaxWidth: '20%',
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
    this.enterpriseTypeEchartData = option;
  }
}
