import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-technology-platform',
  templateUrl: './technology-platform.component.html',
  styleUrls: ['./technology-platform.component.css']
})
export class TechnologyPlatformComponent implements OnInit {

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute
  ) { }
  menuName = '公共技术平台';
  ngOnInit() {
    this.router.events.subscribe((event:NavigationEnd) => {
      if (event instanceof NavigationEnd && event.url == '/technologyPlatform') {
        this.router.navigate(['technologyPlatform/list', this.menuName])
      }
    });
    if (this.router.url.indexOf('list') < 0 && this.router.url.indexOf('detail') < 0) {
      this.router.navigate(['technologyPlatform/list', this.menuName])
    }
  }

}
