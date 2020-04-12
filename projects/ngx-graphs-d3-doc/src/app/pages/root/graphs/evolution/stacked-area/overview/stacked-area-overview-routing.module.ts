import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StackedAreaOverviewComponent } from './stacked-area-overview.component';

const routes: Routes = [
  {
    path: '',
    component: StackedAreaOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StackedAreaOverviewRoutingModule {}
