import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterCategoryComponent } from './register-category/register-category.component';
import { TradeCategoryComponent } from './trade-category/trade-category.component';
import { RegisterTradeCategoryRoutingModule } from './register-trade-category-routing.module';
import { RegisterTradeCategoryComponent } from './register-trade-category.component';
import { TreeModule } from 'primeng/tree';
import { IndustryCategoryComponent } from './industry-category/industry-category.component';
import { RegisterCategoryService } from './register-category.service';

@NgModule({
  imports: [
    CommonModule,
    RegisterTradeCategoryRoutingModule,
    TreeModule
  ],
  providers: [RegisterCategoryService],
  declarations: [RegisterCategoryComponent, TradeCategoryComponent, RegisterTradeCategoryComponent, IndustryCategoryComponent]
})
export class RegisterTradeCategoryModule { }
