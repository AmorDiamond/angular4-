import { NgModule } from '@angular/core';
import { MicrocosmicComponent } from './microcosmic.component';
import { SharedModule } from '../../shared/shared.module';
import { MicrocosmicRoutingModule } from './microcosmic-routing/microcosmic-routing.module';
import { EventNoticeComponent } from './event-notice/event-notice.component';
import { TrackComponent } from './event-notice/track/track.component';
import { EarlyWarningComponent } from './event-notice/early-warning/early-warning.component';
import { RecommendComponent } from './event-notice/recommend/recommend.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { BreedTrackComponent } from './event-notice/breed-track/breed-track.component';
import { BreedTrackService } from './event-notice/track/business-training/breed-track.service';
import { CompanyBasicInfoComponent } from './company-detail/company-basic-info/company-basic-info.component';
import { CompanyQualificationsInfoComponent } from './company-detail/company-qualifications-info/company-qualifications-info.component';
import { CompanyCreditInfoComponent } from './company-detail/company-credit-info/company-credit-info.component';
import { CompanyEconomicInfoComponent } from './company-detail/company-economic-info/company-economic-info.component';
import { CompanyBusinessInfoComponent } from './company-detail/company-business-info/company-business-info.component';
import { CompanyOperatorNexusInfoComponent } from './company-detail/company-operator-nexus-info/company-operator-nexus-info.component';
import { CompanyOverviewInfoComponent } from './company-detail/company-overview-info/company-overview-info.component';
import { CompanyEconomicForecastComponent } from './company-detail/company-economic-forecast/company-economic-forecast.component';
import { CompanyQualificationsInfoService } from './company-detail/company-qualifications-info/company-qualifications-info.service';
import { IntangibleAssetsComponent } from './company-detail/intangible-assets/intangible-assets.component';
// import { MicrocosmicService } from './microcosmic.service';
import { MessagePushComponent } from './event-notice/track/message-push/message-push.component';
import { BusinessTrainingComponent } from './event-notice/track/business-training/business-training.component';
import { FocusBusinessComponent } from './event-notice/focus-business/focus-business.component';
import { PersonalPreferenceComponent } from './event-notice/personal-preference/personal-preference.component';

@NgModule({
  imports: [
    SharedModule,
    MicrocosmicRoutingModule
  ],
  declarations: [
    MicrocosmicComponent,
    EventNoticeComponent,
    TrackComponent,
    EarlyWarningComponent,
    RecommendComponent,
    CompanyDetailComponent,
    CompanyListComponent,
    BreedTrackComponent,
    CompanyBasicInfoComponent,
    CompanyQualificationsInfoComponent,
    CompanyCreditInfoComponent,
    CompanyEconomicInfoComponent,
    CompanyBusinessInfoComponent,
    CompanyOperatorNexusInfoComponent,
    CompanyOverviewInfoComponent,
    CompanyEconomicForecastComponent,
    IntangibleAssetsComponent,
    MessagePushComponent,
    BusinessTrainingComponent,
    FocusBusinessComponent,
    PersonalPreferenceComponent
  ],
  providers: [
    BreedTrackService,
    CompanyQualificationsInfoService
  ]
})
export class MicrocosmicModule { }
