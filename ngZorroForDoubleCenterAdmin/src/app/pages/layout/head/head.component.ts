import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit() {
  }
  logout () {
    const url = '/v1/security/logout';
    this.http.get(url).subscribe((res: any) => {});
    sessionStorage.setItem('login', '');
    this.router.navigate(['/login']);
  }

}
