import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-technology-intermediary',
  templateUrl: './technology-intermediary.component.html',
  styleUrls: ['./technology-intermediary.component.css']
})
export class TechnologyIntermediaryComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) { }
  menuName = '科技中介机构';
  ngOnInit() {
    this.router.events.subscribe((event:NavigationEnd) => {
      if (event instanceof NavigationEnd && event.url == '/intermediary') {
        this.router.navigate(['intermediary/list', this.menuName])
      }
    });
    if (this.router.url.indexOf('list') < 0 && this.router.url.indexOf('detail') < 0) {
      this.router.navigate(['intermediary/list', this.menuName])
    }
  }

}
