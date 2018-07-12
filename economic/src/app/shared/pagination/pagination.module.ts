import { NgModule } from '@angular/core';
import { PaginationComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [PaginationComponent],
  exports: [
    PaginationComponent
  ],
})
export class PaginationModule { }
