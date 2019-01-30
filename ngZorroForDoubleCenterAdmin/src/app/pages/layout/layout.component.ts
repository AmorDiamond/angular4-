import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    const login = sessionStorage.getItem('login');
    if (!login) {
      this.router.navigate(['/login']);
    }
  }

}
