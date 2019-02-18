import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-technology-enterprise',
  templateUrl: './technology-enterprise.component.html',
  styleUrls: ['./technology-enterprise.component.css']
})
export class TechnologyEnterpriseComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) { }
  menuName = '科技型企业';
  ngOnInit() {
    this.router.events.subscribe((event:NavigationEnd) => {
      if (event instanceof NavigationEnd && event.url == '/technology') {
        this.router.navigate(['technology/list', this.menuName])
      }
    });
    if (this.router.url.indexOf('list') < 0 && this.router.url.indexOf('detail') < 0) {
      this.router.navigate(['technology/list', this.menuName])
    }
  }

}
