import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvolutionComponent } from './evolution.component';

const routes: Routes = [
  {
    path: '',
    component: EvolutionComponent,
    children: [
      {
        path: 'stacked-area',
        loadChildren: () =>
          import('@doc/src/app/pages/root/graphs/evolution/stacked-area/stacked-area.module').then(
            module => module.StackedAreaModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvolutionRoutingModule {}
