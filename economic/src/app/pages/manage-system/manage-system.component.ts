import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-manage-system',
  templateUrl: './manage-system.component.html',
  styleUrls: ['./manage-system.component.css']
})
export class ManageSystemComponent implements OnInit {
  menusControl: any = { user: false };
  routerUrl: string;
  menusUrl: string;
  loginUserName = sessionStorage.getItem('userName');
  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        this.routerUrl = this.router.url.split('/')[2];
        this.menusUrl = this.routerUrl;
      });
  }
  changeMenuShow(name?) {
    // tslint:disable-next-line:forin
    this.menusUrl = this.menusUrl === name ? this.routerUrl : name;
  }

  loginOut(){
    console.log('tuichu================');
    
    sessionStorage.setItem('hasLogin', '');
    sessionStorage.setItem('userId', '');
    sessionStorage.setItem('userRole', '');
    sessionStorage.setItem('userDefaultPage', '');
    
    this.http.post('/ldap/security/logout',new HttpParams(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe((res: any) => {
      console.log(res);
      if (res.responseCode === '_200') {
        this.router.navigate(['login']);
      } else {

        this.router.navigate(['login']);
      }
    })
  }

}
