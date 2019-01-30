import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.css']
})
export class SiderComponent implements OnInit {

  constructor(
    private router: Router
  ) { }
  isCollapsed = false;
  menuStatus = {
    roles: false,
    formManage: false
  };
  ngOnInit() {
    /*this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      console.log(event)
    });*/
    this.handleMenuShow();
  }
  handleMenuShow () {
    const url = this.router.url;
    const urlPrefix = url.split('/')[1];
    this.menuStatus[urlPrefix] = true;
  }

}
