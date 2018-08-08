import { Component, OnInit } from '@angular/core';
import { IndustryMapFenbuService } from "../industry-map-fenbu.service";

@Component({
  selector: 'app-register-money',
  templateUrl: './register-money.component.html',
  styleUrls: ['./register-money.component.css']
})
export class RegisterMoneyComponent implements OnInit {

  constructor(
    private industryMapFenbuService: IndustryMapFenbuService
  ) { }
  registerMoneyEchartData: any;
  ngOnInit() {
    this.getData();
  }
  /*获取数据*/
  getData() {
    let time = new Date().getFullYear();
    let findParams = [
      {findParams: {dataSupplyTime: time, functionalareaindustry: '高新西区'}, url: 'industryMapFunctionAreaMenuUrl'},
      {findParams: {dataSupplyTime: time, functionalareaindustry: '高新南区'}, url: 'industryMapFunctionAreaMenuUrl'},
      {findParams: {dataSupplyTime: time, functionalareaindustry: '高新东区'}, url: 'industryMapFunctionAreaMenuUrl'},
      {findParams: {dataSupplyTime: time, functionalareaindustry: '天府国际生物城'}, url: 'industryMapFunctionAreaMenuUrl'},
    ];
    this.industryMapFenbuService.getRequestByForkJoin(findParams).subscribe(res => {
      console.log('功能区数据', res)
      let formatData = [];
      if(res[0].responseCode === '_200') {
        let options = res[0].data.countmape[0];
        options[0] = options[0] ? options[0] : '高新西区';
        options[1] = options[1] ? options[1] : 0;
        formatData.push(options);
      }
      if(res[1].responseCode === '_200') {
        let options = res[1].data.countmape[0];
        options[0] = options[0] ? options[0] : '高新南区';
        options[1] = options[1] ? options[1] : 0;
        formatData.push(options);
      }
      if(res[2].responseCode === '_200') {
        let options = res[2].data.countmape[0];
        options[0] = options[0] ? options[0] : '高新东区';
        options[1] = options[1] ? options[1] : 0;
        formatData.push(options);
      }
      if(res[3].responseCode === '_200') {
        let options = res[3].data.countmape[0];
        options[0] = options[0] ? options[0] : '天府国际生物城';
        options[1] = options[1] ? options[1] : 0;
        formatData.push(options);
      }
      this.creatRegisterMoneyEchart(formatData);
    })
  }
  /*绘制注册资金图表*/
  creatRegisterMoneyEchart(options) {
    let xAxisData = [];
    let seriesData = [];
    options.forEach(res => {
      xAxisData.push(res[0]);
      seriesData.push(res[1]);
    });
    const option = {
      color:['#21cbee','#168aa1'],
      title:{
        text:'各功能区注册资本',
        textStyle:{
          color:'#bcbdbf'
        },
        left:'center'
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
          name:'功能区',
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
          name: '注册资本(元)',
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
          name: '注册资本',
          type: 'bar',
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
    this.registerMoneyEchartData = option;
  }
}
