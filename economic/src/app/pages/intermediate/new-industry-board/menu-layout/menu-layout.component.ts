import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-menu-layout',
  templateUrl: './menu-layout.component.html',
  styleUrls: ['./menu-layout.component.css']
})
export class MenuLayoutComponent implements OnInit {

  constructor(
    private routerInfo: ActivatedRoute
  ) { }
  typeId = '';
  typeName = '';
  ngOnInit() {
    this.typeName = this.routerInfo.snapshot.queryParams['name'];
    this.typeId = this.routerInfo.snapshot.queryParams['id'];
  }

}
