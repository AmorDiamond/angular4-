import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormManageRoutingModule } from './form-manage-routing.module';
import { TechnologyComponent } from './technology/technology.component';
import { DoubleVentureComponent } from './double-venture/double-venture.component';
import { SeedEnterpriseComponent } from './seed-enterprise/seed-enterprise.component';
import { GazelleEnterpriseComponent } from './gazelle-enterprise/gazelle-enterprise.component';
import { UnicornEnterpriseComponent } from './unicorn-enterprise/unicorn-enterprise.component';
import { TechnologyPlatformComponent } from './technology-platform/technology-platform.component';
import { IntermediaryComponent } from './intermediary/intermediary.component';
import { IncubatorComponent } from './incubator/incubator.component';
import { ShareModule } from '../../share/share.module';
import { UpdateFormComponent } from './upload-form/upload-form.component';
import { EnterpriseEditModalComponent } from './enterprise-edit-modal/enterprise-edit-modal.component';

@NgModule({
  declarations: [TechnologyComponent, DoubleVentureComponent, SeedEnterpriseComponent, GazelleEnterpriseComponent, UnicornEnterpriseComponent, TechnologyPlatformComponent, IntermediaryComponent, IncubatorComponent, UpdateFormComponent, EnterpriseEditModalComponent],
  imports: [
    CommonModule,
    FormManageRoutingModule,
    ShareModule
  ],
  entryComponents: [EnterpriseEditModalComponent]
})
export class FormManageModule { }
