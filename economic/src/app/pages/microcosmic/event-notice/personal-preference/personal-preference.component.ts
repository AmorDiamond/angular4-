import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-preference',
  templateUrl: './personal-preference.component.html',
  styleUrls: ['./personal-preference.component.css']
})
export class PersonalPreferenceComponent implements OnInit {

  constructor() { }
  preference = {
    weiguan: false,
    zhongguan: false,
    hongguan: false,
    manage: false
  }
  ngOnInit() {
    const userDefaultPage = localStorage.getItem('userDefaultPage');
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
    for (const item in this.preference) {
      if (this.preference[item]) {
        localStorage.setItem('userDefaultPage', item);
      }
    }
  }

}
