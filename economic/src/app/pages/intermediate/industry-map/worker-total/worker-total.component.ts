import { Component, OnInit } from '@angular/core';
import { IndustryMapFenbuService } from '../industry-map-fenbu.service';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

declare var $: any;
@Component({
  selector: 'app-worker-total',
  templateUrl: './worker-total.component.html',
  styleUrls: ['./worker-total.component.css']
})
export class WorkerTotalComponent implements OnInit {

  constructor(
    private industryMapFenbuService: IndustryMapFenbuService,
    private toastModalService: ToastModalService
  ) { }
  workerTatalEchartData: any;
  revenueTime = new Date().getFullYear() - 1;
  ngOnInit() {

    /*时间控制*/
    $('#datetimepicker-worker-total').datetimepicker({
      autoclose: 1,
      startView: 4,
      minView: 4,
      forceParse: 0,
      startDate: 2015,
      endDate: new Date().getFullYear(),
      initialDate: new Date().getFullYear() - 1
    }).on('changeYear', (ev) => {
      const chooseTime = new Date(ev.date.valueOf()).getFullYear();
      this.revenueTime = chooseTime;
      this.getData(this.revenueTime);
    });
    this.getData(this.revenueTime);
  }
  /*获取数据*/
  getData(time) {
    const params = {year: time};
    this.industryMapFenbuService.getDataByParams(params, 'industryMapWorkerTotalUrl').subscribe(res => {
      console.log(res);
      if (res.responseCode === '_200') {
        const options = res.data;
        this.creatEnterpriseWorkerTotalEchart(options);
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*绘制职工总数图表--近几年*/
  creatWorkerTotalEchartYear(options) {
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
    for (let i = startYear; i < endYear; i++) {
      xAxisData.push(i);
    }
    let copyObjType = {};
    let copyObjYear = {};
    options.forEach(res => {
      let year = res[0];
      let type = res[1];
      if (type && copyObjType[type]) {
        copyObjType[type].push(res);
      }else if (type) {
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
        data: new Array(xAxisData.length) // 不存在对应类型的数据时设置为0
      };
      for ( let i = 0; i < itemObj.data.length; i++) {
        itemObj.data[i] = 0;
      }
      itemObj.name = item;
      copyObjType[item].forEach(res => {
        let year = res[0];
        let peopleNumber = res[2];
        if (year) {
          let index = xAxisData.indexOf(Number(year)); // 让series里data的数据位置和x轴坐标类型的数据对应。
          if (itemObj.data[index]) {
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
      grid: {
        left: '3%',
        bottom: '5%',
        containLabel: true
      },
      // calculable: true,
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
  /*绘制职工人数柱状图*/
  creatEnterpriseWorkerTotalEchart(options) {
    let xAxisData = [];
    let seriesData = [];
    options.forEach(res => {
      if (res[3]) {
        xAxisData.push(res[3]);
        seriesData.push(res[2] ? res[2] : 0);
      }
    });
    let echartTitle = '各功能区职工总数';
    const option = {
      color: ['#21cbee', '#168aa1'],
      title: {
        text: echartTitle,
        textStyle: {
          color: '#bcbdbf'
        },
        left: 'center'
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
          name: '功能区',
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
          name: '人数(人)',
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
          name: '职工人数',
          type: 'bar',
          barMaxWidth: '50%',
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
    this.workerTatalEchartData = option;
  }
}
