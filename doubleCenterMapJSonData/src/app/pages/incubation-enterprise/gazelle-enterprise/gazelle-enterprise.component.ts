import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-gazelle-enterprise',
  templateUrl: './gazelle-enterprise.component.html',
  styleUrls: ['./gazelle-enterprise.component.css']
})
export class GazelleEnterpriseComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) { }
  menuName = '瞪羚企业';
  ngOnInit() {
    this.router.events.subscribe((event:NavigationEnd) => {
      if (event instanceof NavigationEnd && event.url == '/gazelleEnterprise') {
        this.router.navigate(['/gazelleEnterprise/list', this.menuName])
      }
    });
    if (this.router.url.indexOf('list') < 0 && this.router.url.indexOf('detail') < 0) {
      this.router.navigate(['/gazelleEnterprise/list', this.menuName])
    }
  }

}
