import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-incubation-park',
  templateUrl: './incubation-park.component.html',
  styleUrls: ['./incubation-park.component.css']
})
export class IncubationParkComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) { }
  menuName = '孵化园区';
  ngOnInit() {
    this.router.events.subscribe((event:NavigationEnd) => {
      if (event instanceof NavigationEnd && event.url == '/incubationPark') {
        this.router.navigate(['incubationPark/list', this.menuName])
      }
    });
    if (this.router.url.indexOf('list') < 0 && this.router.url.indexOf('detail') < 0) {
      this.router.navigate(['incubationPark/list', this.menuName])
    }
  }

}
