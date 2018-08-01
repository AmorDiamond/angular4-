import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import 'rxjs/add/operator/share';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
// import { TreeNode } from 'primeng/api';


@Injectable()
export class MechanismManageService {

  private subject = new BehaviorSubject<any>(0);

  private url = '/assets/files.json';
  constructor(private http: HttpClient, private router: Router) { }

  getNodes() {
    // return this.http.get(this.url).toPromise().then(res => <TreeNode[]> res.json().data);
    // return this.http.get(this.url).map(res => <TreeNode[]> res.json().data);
    return this.http.get(this.url);
  }

}
