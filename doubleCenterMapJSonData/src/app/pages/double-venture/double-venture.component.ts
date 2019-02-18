import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-double-venture',
  templateUrl: './double-venture.component.html',
  styleUrls: ['./double-venture.component.css']
})
export class DoubleVentureComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) { }
  menuName = '双创企业';
  ngOnInit() {
    this.router.events.subscribe((event:NavigationEnd) => {
      if (event instanceof NavigationEnd && event.url === '/doubleVenture') {
        this.router.navigate(['doubleVenture/list', this.menuName])
      }
    });
    if (this.router.url.indexOf('list') < 0 && this.router.url.indexOf('detail') < 0) {
      this.router.navigate(['doubleVenture/list', this.menuName])
    }
  }

}
