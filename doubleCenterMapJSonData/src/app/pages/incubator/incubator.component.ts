import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-incubator',
  templateUrl: './incubator.component.html',
  styleUrls: ['./incubator.component.css']
})
export class IncubatorComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) { }
  menuName = '孵化器';
  ngOnInit() {
    this.router.events.subscribe((event:NavigationEnd) => {
      if (event instanceof NavigationEnd && event.url === '/incubator') {
        this.router.navigate(['incubator/list', this.menuName])
      }
    });
    if (this.router.url.indexOf('list') < 0 && this.router.url.indexOf('detail') < 0) {
      this.router.navigate(['incubator/list', this.menuName])
    }
  }

}
