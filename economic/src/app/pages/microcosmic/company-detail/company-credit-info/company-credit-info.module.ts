import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HonorComponent } from './honor/honor.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { RoutingModule } from './routing/routing.module';
import { CompanyCreditService } from './company-credit.service';
import { SharedModule } from '../../../../shared/shared.module';
import { PerformancePaymentComponent } from './performance-payment/performance-payment.component';
import { IndustryRatingComponent } from './industry-rating/industry-rating.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RoutingModule
  ],
  providers: [CompanyCreditService],
  declarations: [HonorComponent, BlacklistComponent, PerformancePaymentComponent, IndustryRatingComponent]
})
export class CompanyCreditInfoModule { }
