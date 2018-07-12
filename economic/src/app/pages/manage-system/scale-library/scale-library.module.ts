import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScaleLibraryComponent } from './scale-library.component';
import { ScaleLibraryRoutingModule } from "./scale-library-routing.module";
import { ListComponent } from './list/list.component';
import { UploadComponent } from './upload/upload.component';
import { ToastyModule } from 'ng2-toasty';
import { SharedModule } from "../../../shared/shared.module";
import { FormsModule } from '@angular/forms';
import { NgUploaderModule } from 'ngx-uploader';

@NgModule({
  imports: [
    CommonModule,
    ScaleLibraryRoutingModule,
    ToastyModule,
    SharedModule,
    FormsModule,
    NgUploaderModule
  ],
  declarations: [ScaleLibraryComponent, ListComponent, UploadComponent]
})
export class ScaleLibraryModule { }
