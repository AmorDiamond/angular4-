import { Component, OnInit } from '@angular/core';
import { CompanyBasicService } from './company-basic.service';
import { MicrocosmicService} from '../../microcosmic.service';

@Component({
  selector: 'app-company-basic-info',
  templateUrl: './company-basic-info.component.html',
  styleUrls: ['./company-basic-info.component.css'],
  providers: [CompanyBasicService]
})
export class CompanyBasicInfoComponent implements OnInit {
  companyDetail = {
    name: '',
    address: '',
    mainStaff: '',
    creditCode: '',
    enterpriseType: '',
    legalRepresentative: '',
    establishDate: '',
    registeredCapital: '',
    regOrganization: '',
    regStatus: '',
    approvedDate: '',
    epTelephone: '',
    mailingAddress: '',
    businessScope: '',
    /*参保信息数据*/
    unitAddress: '',
    insurType: '',
    socialInsurCode: '',
    regDate: '',
    isNewInsured: '',
    endowmentInsurNum: '',
    medicalInsurNum: '',
    employmentInjuryInsurNum: '',
    unemployedInsurNum: '',
    maternityInsurNum: '',
    yearShouldPay: '',
    yearReallyPay: '',
    isPayCompleted: '',
    overduePayment: '',
    paymentYear: '',
    insurPayStatus: '',
    dataSource: '',
    dataProvisionTime: '',
    // 是否被关注
    focusOfAttention: false,
    accumulationFundNum: ''
  };
  companyChangeList = [];
  companyTaxationList = [];
  companyName: string;
  constructor(private companyBasicService: CompanyBasicService, private microcosmicService: MicrocosmicService) { }

  ngOnInit() {
    this.microcosmicService.getCompanyName().subscribe(res => {
      this.companyName = res.companyName;
    });
    /*获取工商信息*/
    this.companyBasicService.getCompanyDetail('test1').subscribe(res => {
      this.companyDetail = res.data;
    });
    /*单独获取重要人员*/
    this.companyBasicService.getCompanyMainStaff('test1').subscribe(res => {
      const mainStaff = [];
      res.data.epMainStaffPojo.forEach( (v, i) => {
        mainStaff.push(v.peopleName);
      });
      this.companyDetail.mainStaff = mainStaff.toString();
    });
    /*获取工商变更信息*/
    this.companyBasicService.getCompanyChangeInfo('test1').subscribe(res => {
      this.companyChangeList = res.data.epChangeInfo;
    });
    /*获取税务登记信息*/
    this.companyBasicService.getCompanyTaxation('test1').subscribe(res => {
      res.data.epTaxationPojo.forEach((v, i) => {
        this.companyTaxationList.push(v);
      });
    });
  }

}
