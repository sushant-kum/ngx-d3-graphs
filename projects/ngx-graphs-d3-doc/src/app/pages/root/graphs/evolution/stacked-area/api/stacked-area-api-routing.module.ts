import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StackedAreaApiComponent } from './stacked-area-api.component';

const routes: Routes = [
  {
    path: '',
    component: StackedAreaApiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StackedAreaApiRoutingModule {}
