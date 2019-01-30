import { Component, OnInit } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UpdateFormComponent implements OnInit {

  constructor(
    private msg: NzMessageService,
    private router: Router,
    private routerInfo: ActivatedRoute,
  ) { }
  type: any = '';
  ngOnInit() {
    this.routerInfo.params.subscribe(res => {
      console.log(res)
      this.type = res.type;
    });
  }
  handleChange({ file, fileList }): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }
  back () {
    history.back();
  }
}
