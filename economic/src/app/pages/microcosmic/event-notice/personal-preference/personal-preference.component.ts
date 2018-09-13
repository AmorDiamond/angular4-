import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-personal-preference',
  templateUrl: './personal-preference.component.html',
  styleUrls: ['./personal-preference.component.css']
})
export class PersonalPreferenceComponent implements OnInit {

  constructor(private http: HttpClient, private toastModalService: ToastModalService) { }
  preference = {
    MICROSCOPIC: false,
    MESO: false,
    Macro: false,
    MANAGEMENT: false
  };
  ngOnInit() {
    const userDefaultPage = sessionStorage.getItem('userDefaultPage');
    this.preference[userDefaultPage] = true;
  }
  changePreference(options) {
    for (const item in this.preference) {
      if (item !== options) {
        this.preference[item] = false;
      }
    }
    this.preference[options] = !this.preference[options];
  }
  savePreference() {
    let pageParams;
    for (const item in this.preference) {
      if (this.preference[item]) {
        pageParams = item;
        const params = new HttpParams().set('preferenceType', pageParams);
        // localStorage.setItem('userDefaultPage', item);
        this.http.post('/v1/attentionEvent/choicePreference', params).subscribe((res: any) => {
          console.log(res)
          if (res.responseCode === '_200') {
            sessionStorage.setItem('userDefaultPage', pageParams);
            this.toastModalService.addToasts({tipsMsg: '个人偏好设置成功！', type: 'success'});
          }else {
            this.toastModalService.addToasts({tipsMsg: res.errorMsg ? res.errorMsg : '未知错误！', type: 'error'});
          }
        });
      }
    }
  }

}
