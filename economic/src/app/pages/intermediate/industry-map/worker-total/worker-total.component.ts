import { Component, OnInit } from '@angular/core';
import { IndustryMapFenbuService } from "../industry-map-fenbu.service";

@Component({
  selector: 'app-worker-total',
  templateUrl: './worker-total.component.html',
  styleUrls: ['./worker-total.component.css']
})
export class WorkerTotalComponent implements OnInit {

  constructor(
    private industryMapFenbuService: IndustryMapFenbuService
  ) { }
  workerTatalEchartData: any;
  ngOnInit() {
    this.getData();
  }
  /*获取数据*/
  getData() {
    let time = new Date().getFullYear();
    let findParams = [
      {findParams: {functionalareaindustry: '高新西区'}, url: 'industryMapFunctionAreaMenuUrl'},
      {findParams: {functionalareaindustry: '高新南区'}, url: 'industryMapFunctionAreaMenuUrl'},
      {findParams: {functionalareaindustry: '高新东区'}, url: 'industryMapFunctionAreaMenuUrl'},
      {findParams: {functionalareaindustry: '天府国际生物城'}, url: 'industryMapFunctionAreaMenuUrl'},
    ];
    this.industryMapFenbuService.getRequestByForkJoin(findParams).subscribe(res => {
      console.log('功能区数据', res)
      let formatData = [];
      if(res[0].responseCode === '_200') {
        let options = res[0].data.stafftmap[0];
        options[1] = options[1] ? options[1] : '高新西区';
        options[2] = options[2] ? options[2] : 0;
        formatData.push(options);
      }
      if(res[1].responseCode === '_200') {
        let options = res[1].data.stafftmap[0];
        options[1] = options[1] ? options[1] : '高新南区';
        options[2] = options[2] ? options[2] : 0;
        formatData.push(options);
      }
      if(res[2].responseCode === '_200') {
        let options = res[2].data.stafftmap[0];
        options[1] = options[1] ? options[1] : '高新东区';
        options[2] = options[2] ? options[2] : 0;
        formatData.push(options);
      }
      if(res[3].responseCode === '_200') {
        let options = res[3].data.stafftmap[0];
        options[1] = options[1] ? options[1] : '天府国际生物城';
        options[2] = options[2] ? options[2] : 0;
        formatData.push(options);
      }
      this.creatWorkerTotalEchart(formatData);
    })
  }
  /*绘制职工总数图表*/
  creatWorkerTotalEchart(options) {
    console.log(options)
    let xAxisData = [];
    let legendData = [];
    let series = [];

    const labelConfigOption = {
      normal: {
        show: true,
        position: 'top'
      }
    };
    let startYear = new Date().getFullYear() - 4;
    let endYear = startYear + 4;
    for(let i = startYear; i < endYear; i++){
      xAxisData.push(i);
    }
    let copyObjType = {};
    let copyObjYear = {};
    options.forEach(res => {
      let year = res[0];
      let type = res[1];
      if(type && copyObjType[type]){
        copyObjType[type].push(res);
      }else if(type){
        copyObjType[type] = [];
        copyObjType[type].push(res);
        legendData.push(type);
      }
    });
    /*将提取出来的按行业类型合并的数据处理成所需的seriesData数据格式*/
    for(let item in copyObjType) {
      const itemObj = {
        name: '功能区',
        type: 'bar',
        label: labelConfigOption,
        data: new Array(xAxisData.length) //不存在对应类型的数据时设置为0
      };
      for(let i = 0; i< itemObj.data.length; i++) {
        itemObj.data[i] = 0;
      }
      itemObj.name = item;
      copyObjType[item].forEach(res => {
        let year = res[0];
        let peopleNumber = res[2];
        if(year){
          let index = xAxisData.indexOf(Number(year)); // 让series里data的数据位置和x轴坐标类型的数据对应。
          if(itemObj.data[index]) {
            itemObj.data[index] += peopleNumber ? Number(peopleNumber) : 0;
          }else {
            itemObj.data[index] = peopleNumber ? Number(peopleNumber) : 0;
          }
        }
      });
      series.push(itemObj)
    }
    const option = {
      color: ['#9ea8ff', '#6f75b3', '#414469', '#21cbee', '#168aa1', '#0d4954'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: legendData,
        textStyle: {
          color: '#bcbdbf'
        },
        top: 10
      },
      calculable: true,
      xAxis: [
        {
          name: '年',
          nameTextStyle: {
            color: '#bcbdbf'
          },
          type: 'category',
          axisTick: {show: false},
          data: xAxisData,
          axisLabel : {
            textStyle : {
              color : '#bcbdbf',
            }
          }
        }
      ],
      yAxis:
        {
          name: '职工总数(人)',
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
      series: series
    };
    this.workerTatalEchartData = option;
  }
}
