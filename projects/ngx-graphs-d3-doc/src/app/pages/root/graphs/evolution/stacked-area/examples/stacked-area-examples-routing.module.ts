import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StackedAreaExamplesComponent } from './stacked-area-examples.component';

const routes: Routes = [
  {
    path: '',
    component: StackedAreaExamplesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StackedAreaExamplesRoutingModule {}
