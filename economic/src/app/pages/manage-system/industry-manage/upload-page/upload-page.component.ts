import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { CHANGE } from '../../../../core/loading-ngrx/loading.action';
import { Store } from '@ngrx/store';
import { LoadingShow } from '../../../../core/loading-ngrx/loading.model';
import { IndustryManagersService } from '../industry-managers.service';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.sass']
})
export class UploadPageComponent implements OnInit {

  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;

  private uploadUrl = '/manager/v1/epBaseInfoPojo/importExcelChangeType';


  constructor(
    private activatedRoute: ActivatedRoute,
    private toastModalService: ToastModalService,
    private industryManagersService: IndustryManagersService,
    private store: Store<LoadingShow>,
  ) {
    this.options = { concurrency: 1 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  nowLocation = '上传新信息';
  industryList = [];
  value: any;
  industryTypeId: any;
  ngOnInit() {
    this.industryManagersService.requestByParams({}, 'getIndustryType').subscribe(res => {
      console.log(res)
      if (res.responseCode === '_200') {
        this.industryList = res.data;
        if (this.industryList.length < 1) {
          this.toastModalService.addToasts({tipsMsg: '暂无产业类型！', type: 'warning'});
        }
      }
    });
    console.log(this.uploadUrl);
  }
  onUploadOutput(output: UploadOutput): void {
    // console.log('output.file==============>', output.file);
    if (output.file !== undefined) {
      switch (output.type) {
        case 'addedToQueue':
          this.files.push(output.file);
          break;
        case 'uploading':
          this.store.dispatch({
            type: CHANGE,
            payload: {
              show: true
            }
          });
          const index = this.files.findIndex(
            file =>
              typeof output.file !== 'undefined' && file.id === output.file.id
          );
          this.files[index] = output.file;
          break;
        case 'removed':
          this.files = this.files.filter(
            (file: UploadFile) => file !== output.file
          );
          break;
        case 'dragOver':
          this.dragOver = true;
          break;
        case 'dragOut':
          this.dragOver = false;
          break;
        case 'drop':
          this.dragOver = false;
          break;
        case 'rejected':
          console.log(output.file.name + ' rejected');
          break;
        case 'done':
          this.store.dispatch({
            type: CHANGE,
            payload: {
              show: false
            }
          });
          console.log('上传完成======》结果：', output.file.response);
          const result = output.file.response;
          if (result.responseCode === '_200') {
            this.toastModalService.addToasts({tipsMsg: '导入成功！', type: 'success', timeout: 2000, router: 'admin/industryManage/list'});
          }else {
            this.toastModalService.addToasts({tipsMsg: result.errorMsg ? result.errorMsg : '未知错误', type: 'error', timeout: 3000});
          }
          break;
        default:
          break;
      }
    }
    if (output.type === 'allAddedToQueue') {
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: 'http://ngx-uploader.com/upload',
      //   method: 'POST',
      //   data: { foo: 'bar' }
      // };
      // this.uploadInput.emit(event);
    }
    // else if (output.type === 'dragOver') {
    //   this.dragOver = true;
    // } else if (output.type === 'dragOut') {
    //   this.dragOver = false;
    // } else if (output.type === 'drop') {
    //   this.dragOver = false;
    // } else if (
    //   output.type === 'rejected' &&
    //   typeof output.file !== 'undefined'
    // ) {
    //   console.log(output.file.name + ' rejected');
    // } else {
    //   console.log(output.type);
    // }

    this.files = this.files.filter(
      file => file.progress.status !== UploadStatus.Done
    );
  }

  startUpload(): void {
    if (!this.industryTypeId) {
      this.toastModalService.addToasts({tipsMsg: '请选择产业类型！', type: 'warning'});
      return;
    }
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.uploadUrl,
      method: 'POST',
      data: {
        // type: 'KETPROJECTDECLARATIONPOJO'
        typeId: this.industryTypeId
      }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

}
