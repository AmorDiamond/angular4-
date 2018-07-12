import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrademarkComponent } from './trademark/trademark.component';
import { PatentComponent } from './patent/patent.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { IcpComponent } from './icp/icp.component';
import { DomainNameComponent } from './domain-name/domain-name.component';
import { RoutingModule } from './routing/routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CompanyAssetsService } from './company-assets.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RoutingModule
  ],
  providers: [CompanyAssetsService],
  declarations: [TrademarkComponent, PatentComponent, CopyrightComponent, IcpComponent, DomainNameComponent]
})
export class IntangibleAssetsModule { }
