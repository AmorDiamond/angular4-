import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';

@Component({
  selector: 'app-function-manage',
  templateUrl: './function-manage.component.html',
  styleUrls: ['./function-manage.component.css']
})
export class FunctionManageComponent implements OnInit {
  functionId: string;
  functionName: string;
  functionMethod: string = 'POST';
  functionDesc: string;
  editFunctionId: any = '';
  methods = ['POST', 'GET', 'DELETE', 'PATCH'];
  addPowerHttpParams = {url: '/v1/competence/', method: 'post'};
  getMethodDetailParams = {url: '/v1/competence/getById', method: 'post'};
  constructor(private http: HttpClient, private routeInfo: ActivatedRoute, private router: Router,
              private toastModalService: ToastModalService) {
  }

  ngOnInit() {
    this.routeInfo.params.subscribe((params: ParamMap) => {
      if (params['id'] !== '-1') {
        this.getMethodDetail(params['id']);
        this.editFunctionId = params['id'];
      }
    });
  }
  findListByUrl(findParams, type): Observable<any> {
    let paramsString = '';
    const url = this[type].url;
    const httpType = this[type].method;
    for (const key in findParams) {
      if (findParams.hasOwnProperty(key)) {
        paramsString += findParams[key] ? `${key}=${findParams[key]}&` : '';
      }
    }
    const params = new HttpParams({ fromString: paramsString });
    if (httpType === 'post') {
      return this.http.post(url, { params });
    }else if (httpType === 'get') {
      return this.http.get(url, { params });
    }
  }
  getMethodDetail(id) {
    const url = this.getMethodDetailParams.url;
    this.http.get(url + '?id=' + id).subscribe((res: any) => {
      this.functionId = res.data.id;
      this.functionName = res.data.comment;
      this.functionMethod = res.data.methods;
      this.functionDesc = res.data.resource;
    });
  }
  onSubmit() {
    if(!this.editFunctionId) {
      this.addFunction();
    }else {
      this.editFunction();
    }
  }
  /*添加新权限*/
  addFunction() {
    this.http.post('/v1/competence/', {
      'comment': this.functionName,
      'id': this.functionId ? this.functionId : '',
      'methods': this.functionMethod,
      'resource': this.functionDesc,
      'status': null
    }).subscribe((res: any) => {
      if (res.responseCode === '_200') {

        this.toastModalService.addToasts({tipsMsg: '添加成功！', type: 'success', router: 'admin/roles/function'});
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }
  /*修改权限信息*/
  editFunction() {
    this.http.patch('/v1/competence/', {
      'comment': this.functionName,
      'id': this.functionId ? this.functionId : '',
      'methods': this.functionMethod,
      'resource': this.functionDesc,
      'status': null
    }).subscribe((res: any) => {
      if (res.responseCode === '_200') {

        this.toastModalService.addToasts({tipsMsg: '修改成功！', type: 'success', router: 'admin/roles/function'});
      }else {
        this.toastModalService.addToasts({tipsMsg: res.errorMsg, type: 'error'});
      }
    });
  }

}
