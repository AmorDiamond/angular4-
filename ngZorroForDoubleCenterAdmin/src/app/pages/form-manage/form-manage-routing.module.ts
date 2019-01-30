import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechnologyComponent } from './technology/technology.component';
import { DoubleVentureComponent } from './double-venture/double-venture.component';
import { SeedEnterpriseComponent } from './seed-enterprise/seed-enterprise.component';
import { GazelleEnterpriseComponent } from './gazelle-enterprise/gazelle-enterprise.component';
import { UnicornEnterpriseComponent } from './unicorn-enterprise/unicorn-enterprise.component';
import { TechnologyPlatformComponent } from './technology-platform/technology-platform.component';
import { IntermediaryComponent } from './intermediary/intermediary.component';
import { IncubatorComponent } from './incubator/incubator.component';
import { UpdateFormComponent } from './upload-form/upload-form.component';

const routes: Routes = [
  {path: 'technology', component: TechnologyComponent},
  {path: 'doubleVenture', component: DoubleVentureComponent},
  {path: 'sedEnterprise', component: SeedEnterpriseComponent},
  {path: 'gazelleEnterprise', component: GazelleEnterpriseComponent},
  {path: 'unicornEnterprise', component: UnicornEnterpriseComponent},
  {path: 'technologyPlatform', component: TechnologyPlatformComponent},
  {path: 'intermediary', component: IntermediaryComponent},
  {path: 'incubator', component: IncubatorComponent},
  {path: 'upload/:type', component: UpdateFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormManageRoutingModule { }
