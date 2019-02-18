import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-seed-enterprise',
  templateUrl: './seed-enterprise.component.html',
  styleUrls: ['./seed-enterprise.component.css']
})
export class SeedEnterpriseComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) { }
  menuName = '种子企业';
  ngOnInit() {
    console.log(11)
    this.router.events.subscribe((event:NavigationEnd) => {
      if (event instanceof NavigationEnd && event.url == '/seedEnterprise') {
        this.router.navigate(['/seedEnterprise/list', this.menuName])
      }
    });
    if (this.router.url.indexOf('list') < 0 && this.router.url.indexOf('detail') < 0) {
      this.router.navigate(['/seedEnterprise/list', this.menuName])
    }
  }

}
