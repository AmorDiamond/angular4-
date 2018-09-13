import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-system',
  templateUrl: './manage-system.component.html',
  styleUrls: ['./manage-system.component.css']
})
export class ManageSystemComponent implements OnInit {
  menusControl: any = { user: false };
  routerUrl: string;
  menusUrl: string;
  loginUserName = sessionStorage.getItem('userName');
  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        this.routerUrl = this.router.url.split('/')[2];
        this.menusUrl = this.routerUrl;
      });
  }
  changeMenuShow(name?) {
    // tslint:disable-next-line:forin
    this.menusUrl = this.menusUrl === name ? this.routerUrl : name;
  }
}
