import { Component, OnInit, EventEmitter } from '@angular/core';
import {
  UploadOutput,
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions,
  UploadStatus
} from 'ngx-uploader';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass']
})
export class UploadComponent implements OnInit {
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  private uploadUrl = '/xlsx/fileUpload';

  constructor() {
    this.options = { concurrency: 1 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {}

  onUploadOutput(output: UploadOutput): void {
    // console.log('output.file==============>', output.file);
    if (output.file !== undefined) {
      switch (output.type) {
        case 'addedToQueue':
          this.files.push(output.file);
          break;
        case 'uploading':
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
          console.log('上传完成======》结果：', output.file.response);
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
