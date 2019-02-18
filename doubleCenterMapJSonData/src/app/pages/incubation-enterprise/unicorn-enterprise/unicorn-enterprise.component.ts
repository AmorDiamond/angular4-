import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-unicorn-enterprise',
  templateUrl: './unicorn-enterprise.component.html',
  styleUrls: ['./unicorn-enterprise.component.css']
})
export class UnicornEnterpriseComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) { }
  menuName = '独角兽企业';
  ngOnInit() {
    this.router.events.subscribe((event:NavigationEnd) => {
      if (event instanceof NavigationEnd && event.url == '/unicornEnterprise') {
        this.router.navigate(['/unicornEnterprise/list', this.menuName])
      }
    });
    if (this.router.url.indexOf('list') < 0 && this.router.url.indexOf('detail') < 0) {
      this.router.navigate(['/unicornEnterprise/list', this.menuName])
    }
  }

}
