import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NewTradeBoardRoutingModule } from './new-trade-board-routing.module';
import { NewTradeBoardComponent } from './new-trade-board.component';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { AdvancedManufactureComponent } from './advanced-manufacture/advanced-manufacture.component';
import { LeadServiceComponent } from './lead-service/lead-service.component';
import { TradeBoardService } from './trade-board.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NewTradeBoardRoutingModule
  ],
  providers: [TradeBoardService],
  declarations: [NewTradeBoardComponent, MenuLayoutComponent, AdvancedManufactureComponent, LeadServiceComponent]
})
export class NewTradeBoardModule { }
