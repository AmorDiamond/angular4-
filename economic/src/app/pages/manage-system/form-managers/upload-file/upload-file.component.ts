import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { ToastModalService } from '../../../../shared/toast-modal/toast-modal.service';
import { CHANGE } from '../../../../core/loading-ngrx/loading.action';
import { Store } from '@ngrx/store';
import { LoadingShow } from '../../../../core/loading-ngrx/loading.model';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload.component.sass']
})


export class UploadFileComponent implements OnInit {

  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;

  private uploadUrl = '';


  constructor(
    private activatedRoute: ActivatedRoute,
    private toastModalService: ToastModalService,
    private store: Store<LoadingShow>,
  ) {
    this.options = { concurrency: 1 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    this.uploadUrl = this.activatedRoute.snapshot.queryParams['url'];
  }

  ngOnInit() {
    console.log(this.uploadUrl);
  }
  /*返回*/
  backPrevPage() {
    window.history.back(-1);
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
            this.toastModalService.addToasts({tipsMsg: '导入成功！', type: 'success', timeout: 2000});
            setTimeout(() => {
              window.history.back(-1);
            }, 2500);
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
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.uploadUrl,
      method: 'POST',
      data: {
        type: 'KETPROJECTDECLARATIONPOJO'
        // index: '1'
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
