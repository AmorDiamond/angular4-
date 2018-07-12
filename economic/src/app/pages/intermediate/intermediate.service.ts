import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

declare var echarts: any;

@Injectable()
export class IntermediateService {
  private subject = new BehaviorSubject<any>(0);
  private subjectBuild = new BehaviorSubject<any>(0);
  private subjectPark = new BehaviorSubject<any>(0);
  private subjectTimeColor = new BehaviorSubject<any>(0);
  private parkRegistUrl = '/v1/land/queryAllFundsByenterpriseType';
  private parkCompanyTypeUrl = '/v1/land/queryAllFundsByenterpriseType';
  private parkCompanyIncomeUrl = '/v1/land/findRevenueByTime';
  private LandNatureEchartUrl = '/v1/land/findCountByGeneralType';
  private LandNaturePolygonUrl = '/v1/land/findAllHasType';
  private singleFloorEchartUrl = '/v1/land/getSingleAndFloor';
  private singleFloorPolygonUrl = '/v1/land/findAll';
  private buildBasicUrl = '/v1/floor/findAll';
  private buildCompanyListUrl = '/v1/company/findByFloor';
  private buildPositionListUrl = '/v1/floor/findAll';
  private buildRegistMoneyUrl = '/v1/land/queryAllFundsByenterpriseType';
  private LandEcoTopCompanyListUrl = '/v1/land/findCompanyTop10ByOperatingIncome';
  private LandEcoOutputEchartUrl = '/v1/land/findOperationgIncomeByIndustryType';
  private LandInefficientLandDataUrl = '/v1/land/findInefficientLandBlock';
  private LandEcoTopDataByEnterpriseTypeUrl = '/v1/land/findByRevenueOrderByPrice';
  private LandEcoOutputDataByEnterpriseTypeUrl = '/v1/land/getGradientView';
  private allLandsUrl = '/v1/land/findAll';
  constructor(private http: HttpClient) { }
  isShowTimesColors = false;
  isShowLandChooseTime = false;
  isShowParkBuildBar = false;
  showBuildMarkerEl = false;
  isShowParkNameList = false;
  choseBuildName: any;
  choseBuildId: any;
  choseParkName: any;
  buildOfCompanys: any;
  selectedPolygonLands: any;
  dataPolygonLands: object = {'dataPolygonNatureLands': [], 'dataPolygonSingleLands': []};
  industryMenusControl = {
    isShowIndustryMenu: true,
    isShowParkMenu: false,
    isShowLandMenu: false,
    isShowFloorMenu: false,
  }
  showTimeColorControl = {
    isShowColorsBar: false,
    isShowTime: false,
    isShowEcoTime: false,
    isShowTopTime: false,
    isShowNatureColor: false,
    isShowInefficientColor: false,
    isShowTopColor: false,
    isShowEcoColor: false,
    isShowSingleColor: false
  }
  parkLists = ['高新西区', '高新东区', '高新南区'];
  revenueTime = new Date().getFullYear() - 1;

  getInitRevenueTime() {
    return this.revenueTime;
  }
  changeShowHideData(type, flag?, buildName?, buildId?) {
    this[type] = flag;
    if (buildName) {
      this.choseBuildName = buildName;
    }
    if (buildId) {
      this.choseBuildId = buildId;
    }
    // this.showBuildMarkerEl = !this.showBuildMarkerEl;
    this.subject.next({
      'isShowParkBuildBar': this.isShowParkBuildBar,
      'showBuildMarkerEl': this.showBuildMarkerEl,
      'isShowParkNameList': this.isShowParkNameList,
      'choseBuildName': this.choseBuildName,
      'choseBuildId': this.choseBuildId,
    });
  }
  getShowHideData(): Observable<any> {
    return this.subject.asObservable();
  }
  getParkNameList() {
    return this.parkLists;
  }
  changeParkName(parkName) {
    this.choseParkName = parkName;
    this.subjectPark.next({
      'choseParkName': this.choseParkName
    });
  }
  getParkName(): Observable<any> {
    return this.subjectPark.asObservable();
  }
  getData(flag) {
    // 天府软件园企业数和经济总值
    const mainData = {
      number: { data: [4.5, 5.8, 8.9, 9.9, 12.5, 14], name: '企业数量', type: 'bar' },
      value: { data: [2300, 2100, 3000, 3500, 4800, 6678], name: '经济产值', type: 'line' }
    };
    // 高新孵化园企业数和经济总值
    const mainData1 = {
      number: { data: [4, 5, 7, 8, 8.5, 9], name: '企业数量', type: 'bar' },
      value: { data: [2000, 2100, 2678, 3000, 3256, 4200], name: '经济产值', type: 'line' }
    };
    // 天府生命科技园企业数和经济总值
    const mainData2 = {
      number: { data: [1.3, 3.7, 7.8, 8, 8.9, 9], name: '企业数量', type: 'bar' },
      value: { data: [1234, 2100, 3000, 3500, 4800, 5000], name: '经济产值', type: 'line' }
    };
    // 天府新谷企业数和经济总值
    const mainData3 = {
      number: { data: [1.3, 3.7, 7.8, 8, 8.9, 9], name: '企业数量', type: 'bar' },
      value: { data: [1234, 2100, 3000, 3500, 500, 6000], name: '经济产值', type: 'line' }
    };
    const years = ['2012', '2013', '2014', '2015', '2016', '2017'];
    // 指定图表的配置项和数据
    const option = {
      color: ['#1eb5d4', '#f9b621', 'white', 'green', 'pink'],
      title: {
        //                text: '南部园区',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyleL: {
            color: '#999'
          }
        },
        formatter: '{b} 年<br/>{a}: {c} 万' + '<br/>{a1}: {c1} 亿元'
      },
      legend: {
        data: ['企业数量', '经济产值'],
        //                top: 30,
        textStyle: {
          color: '#fff',
          fontSize: 14
        }
      },
      toolbox: {},
      grid: {
        left: '20',
        right: '10',
        bottom: '20',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        splitLine: { show: false },
        data: years,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
        },
        axisTick: { length: 6 },
      }],
      dataZoom: [],
      yAxis: [{
        type: 'value',
        name: '企业数量（万）',
        min: 0,
        interval: 5,
        axisLabel: {

          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }, {
        type: 'value',
        name: '经济产值（亿）',
        min: 0,
        max: 8000,
        interval: 1000,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }],
      series: []
    };
    const Item = () => {
      return {
        name: '',
        type: '',
        yAxisIndex: 0,
        data: [],
        barWidth: '40%'
      };
    };
    // 填充数据

    // ---------------天府软件园区
    const Series = [];
    // 企业数量
    const jsonNumber = mainData.number;
    const number = Item();
    number.name = jsonNumber.name;
    number.type = jsonNumber.type;
    number.data = jsonNumber.data;
    Series.push(number);
    // 经济总值
    const jsonValue = mainData.value;
    const value = Item();
    value.name = jsonValue.name;
    value.type = jsonValue.type;
    value.data = jsonValue.data;
    value.yAxisIndex = 1;
    Series.push(value);

    option.series = Series;
    const optionMainPart = JSON.parse(JSON.stringify(option));
    // ---------------高新孵化园
    const Series1 = [];
    // 企业数量
    const jsonNumber1 = mainData1.number;
    const number1 = Item();
    number1.name = jsonNumber1.name;
    number1.type = jsonNumber1.type;
    number1.data = jsonNumber1.data;
    Series1.push(number1);
    // 经济总值
    const jsonValue1 = mainData1.value;
    const value1 = Item();
    value1.name = jsonValue1.name;
    value1.type = jsonValue1.type;
    value1.data = jsonValue1.data;
    value1.yAxisIndex = 1;
    Series1.push(value1);

    option.series = Series1;
    const optionMainPart1 = JSON.parse(JSON.stringify(option));
    // ---------------生命科技园
    const Series2 = [];
    // 企业数量
    const jsonNumber2 = mainData2.number;
    const number2 = Item();
    number2.name = jsonNumber2.name;
    number2.type = jsonNumber2.type;
    number2.data = jsonNumber2.data;
    Series2.push(number2);
    // 经济总值
    const jsonValue2 = mainData2.value;
    const value2 = Item();
    value2.name = jsonValue2.name;
    value2.type = jsonValue2.type;
    value2.data = jsonValue2.data;
    value2.yAxisIndex = 1;
    Series2.push(value2);

    option.series = Series2;
    const optionMainPart2 = JSON.parse(JSON.stringify(option));

    // ---------------天府新谷
    const Series3 = [];
    // 企业数量
    const jsonNumber3 = mainData3.number;
    const number3 = Item();
    number3.name = jsonNumber3.name;
    number3.type = jsonNumber3.type;
    number3.data = jsonNumber3.data;
    Series3.push(number3);
    // 经济总值
    const jsonValue3 = mainData3.value;
    const value3 = Item();
    value3.name = jsonValue3.name;
    value3.type = jsonValue3.type;
    value3.data = jsonValue3.data;
    value3.yAxisIndex = 1;
    Series3.push(value3);

    option.series = Series3;
    const optionMainPart3 = JSON.parse(JSON.stringify(option));

    // 热力图
    const yearsHeat = ['2012', '2013', '2014', '2015', '2016', '2017'];
    const industry_cluster = ['集成电路', '软件及服务外包', '光电', '生物医药', '通信', '精密机械'];
    const rankDataNum = [[0, 0, 0], [0, 1, 3], [0, 2, 5], [0, 3, 6], [0, 4, 2], [0, 5, 4],
      [1, 0, 1], [1, 1, 3], [1, 2, 1], [1, 3, 14], [1, 4, 6], [1, 5, 15],
      [2, 0, 11], [2, 1, 23], [2, 2, 4], [2, 3, 25], [2, 4, 6], [2, 5, 2],
      [3, 0, 1], [3, 1, 2], [3, 2, 5], [3, 3, 6], [3, 4, 0], [3, 5, 4],
      [4, 0, 6], [4, 1, 5], [4, 2, 4], [4, 3, 1], [4, 4, 2], [4, 5, 3],
      [5, 0, 5], [5, 1, 4], [5, 2, 6], [5, 3, 1], [5, 4, 2], [5, 5, 3]];
    const rankData = rankDataNum.map(function (item) {
      return [item[1], item[0], item[2] || '-'];
    });
    const optionHeats = {
      color: ['blue', 'yellow', 'white', 'green', 'pink'],
      title: {
//                    text: '南部园区行业热度统计',
        textStyle: {
          color: '#fff',
          fontSize: 16
        },
        x: 'center'
      },
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '55%',
        y: '18%',
        x: '22%'
      },
      xAxis: {
        type: 'category',
        data: yearsHeat,
        splitArea: {
          show: true
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //rotate: -30
        },
      },
      yAxis: {
        type: 'category',
        data: industry_cluster,
        splitArea: {
          show: true
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#B2B2B2',
            fontSize: 12,
          },
          interval: 0,
          //formatter: '{value} 万'
        },
        nameTextStyle: {
          color: '#B2B2B2',
          fontSize: 12
        }
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        textStyle: {
          color: '#B2B2B2',
          fontSize: 12,
        },
      },
      series: [{
        name: '行业热度',
        type: 'heatmap',
        data: rankData,
        label: {
          normal: {
            show: true
          }
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    // ---------------------天府软件园行业热度
    // 为echarts对象加载数据
    const optionHeatMap = JSON.parse(JSON.stringify(optionHeats));
    // ---------------------高新孵化园行业热度
//            option.title.text = '西部园区行业热度统计';
    const optionHeatMap1 = JSON.parse(JSON.stringify(optionHeats));
    // ---------------------生命科技园行业热度
//            option.title.text = '东部园区行业热度统计';
    const optionHeatMap2 = JSON.parse(JSON.stringify(optionHeats));
    // ---------------------天府新股行业热度
//            option.title.text = '东部园区行业热度统计';
    const optionHeatMap3 = JSON.parse(JSON.stringify(optionHeats));
    return new Observable<any>((observer) => {
      observer.next({
        optionMainPart: optionMainPart,
        optionMainPart1: optionMainPart1,
        optionMainPart2: optionMainPart2,
        optionMainPart3: optionMainPart3,
        optionHeatMap: optionHeatMap,
        optionHeatMap1: optionHeatMap1,
        optionHeatMap2: optionHeatMap2,
        optionHeatMap3: optionHeatMap3,
      });
    });
  }
  changeData(title) {
    this.isShowTimesColors = true;
    this.isShowTimesColors = false;
    console.log(this.isShowTimesColors, title);
  }
  /*园区统计菜单*/
  getParkRegistMoney(keyWord): Observable<any> {
      return this.http.get(`${this.parkRegistUrl}`)
        .map(res => (res));
  }
  getParkCompanyType(): Observable<any> {
      return this.http.get(`${this.parkCompanyTypeUrl}`)
        .map(res => (res));
  }
  getParkCompanyIncome(time): Observable<any> {
      return this.http.get(`${this.parkCompanyIncomeUrl + '?time=' + time}`)
        .map(res => (res));
  }
  /*地块菜单*/
  getLandNatureEchat(): Observable<any> {
      return this.http.get(`${this.LandNatureEchartUrl}`)
        .map(res => (res));
  }
  getLandNaturePolygon(): Observable<any> {
      return this.http.get(`${this.LandNaturePolygonUrl}`)
        .map(res => (res));
  }
  getSingleFloorEchart(): Observable<any> {
      return this.http.get(`${this.singleFloorEchartUrl}`)
        .map(res => (res));
  }
  getSingleFloorPolygon(): Observable<any> {
      return this.http.get(`${this.singleFloorPolygonUrl}`)
        .map(res => (res));
  }
  getEcoTopPolygon(revenueTime): Observable<any> {
    const typeArr = ['生物医药', '电子信息', '精密制造', '其他', '服务业'];
    let post1 = this.http.get(`${this.LandEcoTopDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&enterpriseType=${typeArr[0]}`);
    let post2 = this.http.get(`${this.LandEcoTopDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&enterpriseType=${typeArr[1]}`);
    let post3 = this.http.get(`${this.LandEcoTopDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&enterpriseType=${typeArr[2]}`);
    let post4 = this.http.get(`${this.LandEcoTopDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&enterpriseType=${typeArr[3]}`);
    let post5 = this.http.get(`${this.LandEcoTopDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&enterpriseType=${typeArr[4]}`);
    let post6 = this.http.get(`${this.allLandsUrl}`);
      return Observable.forkJoin([post1, post2, post3, post4, post5, post6]);
  }
  getEcoOutputPolygon(revenueTime): Observable<any> {
    const typeArr = ['生物医药', '电子信息', '精密制造', '其他', '服务业'];
    let post1 = this.http.get(`${this.LandEcoOutputDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&type=${typeArr[0]}`);
    let post2 = this.http.get(`${this.LandEcoOutputDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&type=${typeArr[1]}`);
    let post3 = this.http.get(`${this.LandEcoOutputDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&type=${typeArr[2]}`);
    let post4 = this.http.get(`${this.LandEcoOutputDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&type=${typeArr[3]}`);
    let post5 = this.http.get(`${this.LandEcoOutputDataByEnterpriseTypeUrl}?revenueTime=${revenueTime}&type=${typeArr[4]}`);
    let post6 = this.http.get(`${this.allLandsUrl}`);
      return Observable.forkJoin([post1, post2, post3, post4, post5, post6]);
  }
  getInefficientLandPolygon(): Observable<any> {
    return this.http.get(`${this.allLandsUrl}`);
  }
  getEcoTopCompanyList(revenueTime, enterpriseType): Observable<any> {
      return this.http.get(`${this.LandEcoTopCompanyListUrl}?revenueTime=${revenueTime}&enterpriseType=${enterpriseType}`);
  }
  getEcoOutputEchart(revenueTime): Observable<any> {
      return this.http.get(`${this.LandEcoOutputEchartUrl}?revenueTime=${revenueTime}`);
  }
  getInefficientLandData(): Observable<any> {
      return this.http.get(`${this.LandInefficientLandDataUrl}`);
  }
  changePolygonLands(type, options) {
      this.dataPolygonLands[type] = options;
  }
  getSavePolygonLands(type) {
      return this.dataPolygonLands[type];
  }
  changeSelectedLand(option) {
    this.selectedPolygonLands = option;
  }
  getSelectedLand() {
    return this.selectedPolygonLands;
  }
  /*楼宇菜单*/
  getBuildInformation(): Observable<any> {
    return this.http.get(`${this.buildBasicUrl}`)
      .map(res => (res));
  }
  /*getBuildCompanyList(landId): Observable<any> {
    return this.http.get(`${this.buildCompanyListUrl + '?landid=' + landId }`)
      .map(res => (res));
  }*/
  /*根据楼宇id搜索公司列表*/
  getBuildCompanyList(landId) {
    this.http.get(`${this.buildCompanyListUrl + '?landid=' + landId }`)
      .subscribe(res => {
        console.log(res)
        this.buildOfCompanys = res;
        this.subjectBuild.next({
          'buildOfCompanys': this.buildOfCompanys
        });
      });
  }
  /*给订阅者返回新获取的公司列表*/
  getBuildOfCompanys(): Observable<any> {
    return this.subjectBuild.asObservable();
  }
  /*获取所有楼宇的坐标等*/
  getBuildPositionList(): Observable<any> {
    return this.http.get(`${this.buildPositionListUrl}`)
      .map(res => (res));
  }
  /*获取楼宇的注册资金*/
  getBuildRegistMoney(id): Observable<any> {
    return this.http.get(`${this.buildRegistMoneyUrl}?floorId=${id}`);
  }
  /*中观产业菜单控制*/
  showIndustryMenus(flag) {
    switch (flag) {
      case 'IndustryMenu':
        this.industryMenusControl.isShowParkMenu = false;
        this.industryMenusControl.isShowLandMenu = false;
        this.industryMenusControl.isShowFloorMenu = false;
        this.industryMenusControl.isShowIndustryMenu = true;
        break;
      case 'ParkMenu':
        this.industryMenusControl.isShowLandMenu = false;
        this.industryMenusControl.isShowIndustryMenu = false;
        this.industryMenusControl.isShowFloorMenu = false;
        this.industryMenusControl.isShowParkMenu = true;
        break;
      case 'LandMenu':
        this.industryMenusControl.isShowIndustryMenu = false;
        this.industryMenusControl.isShowParkMenu = false;
        this.industryMenusControl.isShowFloorMenu = false;
        this.industryMenusControl.isShowLandMenu = true;
        break;
      case 'FloorMenu':
        this.industryMenusControl.isShowIndustryMenu = false;
        this.industryMenusControl.isShowParkMenu = false;
        this.industryMenusControl.isShowLandMenu = false;
        this.industryMenusControl.isShowFloorMenu = true;
        break;
    }
  }
  getIndustryMenusControl() {
    return this.industryMenusControl;
  }
  /*中观产业颜色和时间控制*/
  changeTimeColorControl(options?) {
    this.showTimeColorControl.isShowColorsBar = false,
    this.showTimeColorControl.isShowTime = false,
    this.showTimeColorControl.isShowEcoTime = false,
    this.showTimeColorControl.isShowTopTime = false,
    this.showTimeColorControl.isShowNatureColor = false,
    this.showTimeColorControl.isShowInefficientColor = false,
    this.showTimeColorControl.isShowTopColor = false,
    this.showTimeColorControl.isShowEcoColor = false,
    this.showTimeColorControl.isShowSingleColor = false
    if (options) {
      for (const item of options) {
        this.showTimeColorControl[item] = true;
      }
    }
    this.subjectTimeColor.next({
      'isShowColorsBar': this.showTimeColorControl.isShowColorsBar,
      'isShowTime': this.showTimeColorControl.isShowTime,
      'isShowEcoTime': this.showTimeColorControl.isShowEcoTime,
      'isShowTopTime': this.showTimeColorControl.isShowTopTime,
      'isShowNatureColor': this.showTimeColorControl.isShowNatureColor,
      'isShowInefficientColor': this.showTimeColorControl.isShowInefficientColor,
      'isShowTopColor': this.showTimeColorControl.isShowTopColor,
      'isShowEcoColor': this.showTimeColorControl.isShowEcoColor,
      'isShowSingleColor': this.showTimeColorControl.isShowSingleColor
    });
  }
  getTimeColorControl(): Observable<any> {
    return this.subjectTimeColor.asObservable();
  }
}
