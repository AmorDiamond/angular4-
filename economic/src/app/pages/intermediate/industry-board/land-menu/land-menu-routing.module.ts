import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandNatureComponent } from './land-nature/land-nature.component';
import { SingleFloorComponent } from './single-floor/single-floor.component';
import { EcoTopComponent } from './eco-top/eco-top.component';
import { EcoOutputComponent } from './eco-output/eco-output.component';
import { InefficientLandComponent } from './inefficient-land/inefficient-land.component';

const routes: Routes = [
  {path: 'landNature', component: LandNatureComponent},
  {path: 'singleFloor', component: SingleFloorComponent},
  {path: 'ecoTop', component: EcoTopComponent},
  {path: 'ecoOutput', component: EcoOutputComponent},
  {path: 'inefficientLand', component: InefficientLandComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandMenuRoutingModule { }
