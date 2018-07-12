import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-system',
  templateUrl: './manage-system.component.html',
  styleUrls: ['./manage-system.component.css']
})
export class ManageSystemComponent implements OnInit {
  menusControl = { user: false };
  loginUserName = sessionStorage.getItem('userName');
  constructor() {}

  ngOnInit() {}
  changeMenuShow(name?) {
    // tslint:disable-next-line:forin
    for (const i in this.menusControl) {
      this.menusControl[i] = false;
    }
    this.menusControl[name] = true;
  }
}
