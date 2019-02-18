import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { ShareModule } from "../../share/share.module";
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    ShareModule
  ],
  declarations: [ListComponent]
})
export class SearchModule { }
