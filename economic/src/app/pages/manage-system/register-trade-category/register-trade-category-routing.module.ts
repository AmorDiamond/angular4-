import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterCategoryComponent } from './register-category/register-category.component';
import { TradeCategoryComponent } from './trade-category/trade-category.component';
import { IndustryCategoryComponent } from './industry-category/industry-category.component';

const routes: Routes = [
  { path: '', redirectTo: 'registerCategory', pathMatch: 'full' },
  { path: 'registerCategory', component: RegisterCategoryComponent },
  { path: 'TradeCategory', component: TradeCategoryComponent },
  { path: 'industryCategory', component: IndustryCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterTradeCategoryRoutingModule { }
